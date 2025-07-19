import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import apiFetch from '../../../services/api/client';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        // console.log('Current token:', localStorage.getItem('authToken'));
        
        const data = await apiFetch('/contacts/admin/list');
        if (!data) {
          throw new Error('Received empty response from server');
        }
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        // console.log('API Response:', data);
        
        // if (data.length > 0) {
        //   console.log('First message object:', data[0]);
        //   console.log('Available keys:', Object.keys(data[0]));
        // }
        
        setMessages(data || []);
        setError('');
      } catch (err) {
        console.error('Full error details:', {
          message: err.message,
          response: err.response,
          stack: err.stack
        });
        
        let errorMsg = err.message;
        if (err.response?.data?.details) {
          errorMsg += ` (${err.response.data.details})`;
        }
        
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      setError('Invalid message ID');
      return;
    }

    try {
      await apiFetch(`/contacts/admin/delete/${id}`, {
        method: 'DELETE'
      });
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete message');
    }
  };

  if (loading) return <div className='fs-4 fw-normal text-primary'>Loading messages...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
    <Table striped bordered hover responsive cellPadding={0} cellSpacing={0} className='table fs-4 fw-normal'>
      <thead>
        <tr>
          <th>S.No.</th>
          <th>Name</th>
          <th>Email</th>
          <th>Message</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {messages.map((message, index) => (
          <tr key={message.id || `message-${index}`}>
            <td>{index + 1}</td>
            <td>{message.name}</td>
            <td>{message.email}</td>
            <td>{message.message}</td>
            <td>
              <Button 
                variant="danger"
                className="fs-4 fw-normal" 
                size="sm"
                onClick={() => handleDelete(message.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    <div className="mt-2 text-muted fs-4 fw-bold mb-4">
        Showing {messages.length} records
    </div>
    </>
  );
};

export default AdminContacts;