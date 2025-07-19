import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { admissionAPI } from '../../../services/api/client'; 
const AdminAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const loadAdmissions = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await admissionAPI.getAll();
        setAdmissions(response.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error loading admissions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAdmissions();
  }, []);

  const handleDelete = async () => {
    try {
      setError('');
      await admissionAPI.delete(selectedId);
      setAdmissions(admissions.filter(admission => admission.id !== selectedId));
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting admission:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        {error}
        <Button 
          variant="link" 
          onClick={() => window.location.reload()}
          className="p-0 ms-2"
        >
          Try again
        </Button>
      </Alert>
    );
  }

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className='fs-1 fw-bold'>Admission Applications</h2>
        <Button 
          variant="primary" 
          onClick={() => window.location.reload()}
          disabled={loading}
          className='w-25'
        >
          Refresh
        </Button>
      </div>
      
      {admissions.length === 0 ? (
        <Alert variant="info" className='fs-4 fw-normal'>No admission applications found</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive className="mt-3 fs-4 fw-normal">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Parent Name</th>
                <th>Course</th>
                <th>Institution</th>
                <th>Location</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="fs-4 fw-normal">
              {admissions.map(admission => (
                <tr key={admission.id}>
                  <td>{admission.id}</td>
                  <td>{admission.student_name}</td>
                  <td>{admission.parent_name}</td>
                  <td>{admission.course}</td>
                  <td>{admission.institution}</td>
                  <td>{admission.location}</td>
                  <td>{new Date(admission.created_at).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setSelectedId(admission.id);
                        setShowDeleteModal(true);
                      }}
                      className='w-100 fs-4 fw-normal'
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <div className="mt-2 text-muted fs-4 fw-bold">
            Showing {admissions.length} records
          </div>
        </>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this admission record?</p>
          <p className="text-danger">
            <strong>This action cannot be undone.</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminAdmissions;