import Event from '../models/Event.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../config/db.js'
import cloudinary from '../config/cloudinary.js';

if (!pool) {
    throw new Error('Database connection not established');
}
export const getPublicEvents = async (req, res) => {
    try {
        const events = await Event.getAll();
        if (!events || events.length === 0) {
            return res.status(200).json([]);
        }
        res.json(events);
    } catch (error) {
        console.error('Get public events error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch events',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getEvents = async (req, res) => {
    try {
        const events = await Event.getAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { title, comment, date } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }
         const newEvent = await Event.create({ 
            image_path: req.file.path, 
            title, 
            comment, 
            date 
        });  
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Create event error:', {
            message: error.message,
            stack: error.stack,
            dbError: error.code
        });
        if(req.file){
            fs.unlink(req.file.path,()=>{
                console.error('Failed to delete temporary file:', req.file.path);});
        }
        res.status(500).json({ 
            error: 'Failed to create event',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const imagePath = await Event.getImagePath(eventId);
        
        // Delete file from cloudinary
        if (imagePath) {
            const publicId = path.basename(imagePath, path.extname(imagePath));
            await cloudinary.uploader.destroy(`Events/${publicId}`);
        }
        
        await Event.delete(eventId);
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRecentEvents = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        
        const sendUpdate = async () => {
            try {
                const events = await Event.getRecent();
                if (events.length > 0) {
                    res.write(`data: ${JSON.stringify(events)}\n\n`);
                }
            } catch (err) {
                console.error('SSE Error:', err);
            }
        };
        
        // Initial check
        await sendUpdate();
        
        // Periodic checks every 5 seconds
        const interval = setInterval(sendUpdate, 5000);
        
        req.on('close', () => {
            clearInterval(interval);
            console.log('Client disconnected from SSE');
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};