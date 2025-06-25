import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import "./Events.css";

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading,setLoading] = useState(true);

  const navigate=useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/public`);
        if (!response.ok) {
          if (response.status === 404 || response.status === 204) {
            setEvents([]);
            return;
          }
          throw new Error(`Server responded with ${response.status}`);
        }
        const data = await response.json();
        setEvents(Array.isArray(data)?data:[]);
        // console.log('Fetched events:', data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setEvents([]);
      }finally{
        setLoading(false);
      }
    };

    const setupSSE = () => {
      const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/events/updates`);
      let reconnectAttempts = 0;
      const maxReconnectAttempts = 5;

      eventSource.onmessage = (e) => {
        if (reconnectAttempts > 0) {
          console.log(`Reconnected after ${reconnectAttempts} attempts`);
          reconnectAttempts = 0; // Reset on successful message
        }
        try {
          const newData = JSON.parse(e.data);
          setEvents(prev => [...newData,...prev]);
        } catch (err) {
          console.error('SSE parsing error:', err);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
         if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          setTimeout(setupSSE, 1000 * Math.min(reconnectAttempts, 5)); // Exponential backoff
        }
      };

      return eventSource;
    };

    fetchData();
    const eventSource = setupSSE();

    return () => {
      eventSource.close();
    };
  }, []);

  if (error) {
    return (
      <div className="alert alert-danger mx-auto mt-5" style={{ maxWidth: '600px' }}>
        <h4>Error loading events</h4>
        <p>{error}</p>
        <button 
          className="btn btn-primary" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
    if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <section className="events-section">
      <h2 className="events-title">🎉 Upcoming Events</h2>
      {events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3 className="empty-title">No Events Scheduled Yet</h3>
          <p className="empty-message">
            Check back later for an upcoming events.
          </p>
          {events.isAdmin && (
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/admin/events/create')}
            >
              Create Your First Event
            </button>
          )}
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event, index) => (
            <div className="event-card" key={index}>
              <div className="event-image-container">
                <img 
                  src={event.image_path} 
                  alt={event.title}
                  className="event-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                    e.target.classList.add('placeholder-image');
                  }}
                  loading="lazy"
                />
              </div>
              <div className="event-date-badge">
                <FaCalendarAlt className="calendar-icon" />
                {new Date(event.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="event-content">
                <h3>{event.title}</h3>
                <p>{event.comment}</p>
                <button className="register-btn" onClick={()=>navigate('/register')}>Register</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};