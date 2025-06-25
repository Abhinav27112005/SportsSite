import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Modal, Form } from 'react-bootstrap';
import apiFetch from './api';
import './AdminEvents.css';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    comment: '',
    date: '',
    image: null,
    imagePreview: '',
  });
   const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  useEffect(() => {
  const fetchEvents = async () => {
  try {
    setLoading(true);
    const data = await apiFetch('/events/admin/list');
    
    const formattedEvents = data.map(event => ({
      id: event.id,
      title: event.title || '',
      comment: event.comment || '',
      date: event.date || new Date().toISOString(),
      image_path: event.image_path || null
    }));
    
    setEvents(formattedEvents);
    setError('');
  } catch (err) {
    console.error('Fetch events error:', err);
    setError(err.message);
    
    // Handle specific database errors
    if (err.message.includes('pool') || err.message.includes('database')) {
      setError('Database connection error - please try again later');
    }
  } finally {
    setLoading(false);
  }
};
    fetchEvents();
}, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

// Update the form submission to use apiFetch
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Modified validation - better check for image
  if (!formData.title.trim() || !formData.comment.trim() || !formData.date) {
    setError('Title, description and date are required');
    return;
  }
  
  if (!formData.image) {  // Separate check for image
    setError('Please select an image');
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append('title', formData.title);
  formDataToSend.append('comment', formData.comment);
  formDataToSend.append('date', formData.date);
  formDataToSend.append('image', formData.image);

  try {
    setLoading(true);
    const newEvent = await apiFetch('/events/admin/create', { 
      method: 'POST',
      body: formDataToSend,
      headers: {}
    });
     if (!newEvent) {
      throw new Error('No response from server');
    }
    setEvents(prevEvents => [newEvent, ...prevEvents]);
    setShowModal(false);
    setFormData({
      title: '',
      comment: '',
      date: '',
      image: null,
      imagePreview: ''
    });
    setError('');
  } catch (err) {
    console.error('Create event error:', {
      message: err.message,
      response: err.response
    });
    
    setError(err.message || 'Failed to create event');
  }
  finally{
    setLoading(false);
  }
};

  const handleDelete = async () => {
    try {
      await apiFetch(`/events/admin/delete/${selectedId}`, { method: 'DELETE' });
      setEvents(events.filter(event => event.id !== selectedId));
      setShowDeleteModal(false);
      setSelectedId(null);
      setError('');
      
    } catch (err) {
      console.error('Delete error:', err);
      setLoading(false);
      setError(err.message);
    }
  };

  if (loading) return <div className='fs-2 fw-bolder'>Loading events...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => setShowModal(true)} >
          Add New Event
        </Button>
      </div>

      <Table striped bordered hover responsive className='table fs-4 fw-normal'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.comment}</td>
              <td>
                    {event.date ? new Date(event.date).toLocaleDateString() : 'No date'}
              </td>
              <td>
                {event.image_path ? (
                    <img 
                    src={event.image_path} 
                        alt="Event" 
                        style={{ width: '100px' }}
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = '/placeholder-image.jpg'
                            e.target.style.objectFit = 'contain';
                        }}
                    />
                    ) : (
                        <span>No Image</span>
                    )}
                </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelectedId(event.id);
                    setShowDeleteModal(true);
                  }}
                  className='fs-4 fw-normal'
                  disabled={loading && selectedId === event.id}
                >
                  {loading && selectedId === event.id ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : null}
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="mt-2 text-muted fs-4 fw-bold mb-4">
            Showing {events.length} records
      </div>


      <Modal show={showModal} onHide={() => setShowModal(false)} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className='fs-4 fw-normal'
              />
            </Form.Group>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                required
                className='fs-4 fw-normal'
              />
            </Form.Group>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date || new Date().toISOString().split('T')[0]}
                onChange={handleInputChange}
                required
                className='fs-4 fw-normal'
              />
            </Form.Group>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="image"  // Add this line
                onChange={handleImageChange}
                className='fs-4 fw-normal'
              />
              {formData.imagePreview && (
                <img 
                  src={formData.imagePreview} 
                  alt="Preview" 
                  style={{ width: '100px', marginTop: '10px' }}
                />
              )}
            </Form.Group>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            <Button variant="primary" type="submit" className='fs-4 fw-normal'>
              Save Event
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this Event?</p>
          <p className="text-danger">
            <strong>This action cannot be undone.</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading} >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminEvents;