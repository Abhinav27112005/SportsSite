import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/AdmissionForm.css';
import { admissionAPI } from '../../services/api/client';

function AdmissionForm() {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    address: '',
    aadhaar: '',
    location: '',
    institution: '',
    course: ''
  });

  const [errors, setErrors] = useState({
    studentName: '',
    parentName: '',
    address: '',
    aadhaar: '',
    location: '',
    institution: '',
    course: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const courses = [
    'Computer Basics',
    'Tally with GST',
    'Graphic Designing',
    'Spoken English',
    'Web Development',
    'Programming in Python'
  ];

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'studentName':
      case 'parentName':
        if (!value.trim()) {
          error = 'This field is required';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Only alphabets and spaces are allowed';
        } else if (value.length < 3) {
          error = 'Must be at least 3 characters';
        }
        break;
        
      case 'address':
        if (!value.trim()) {
          error = 'Address is required';
        } else if (value.length < 10) {
          error = 'Address must be at least 10 characters';
        }
        break;
        
      case 'aadhaar':
        if (!value.trim()) {
          error = 'Aadhaar number is required';
        } else if (!/^\d{12}$/.test(value)) {
          error = 'Aadhaar must be 12 digits';
        }
        break;
        
      case 'location':
      case 'institution':
        if (!value.trim()) {
          error = 'This field is required';
        } else if (value.length < 3) {
          error = 'Must be at least 3 characters';
        }
        break;
        
      case 'course':
        if (!value) {
          error = 'Please select a course';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const error = validateField(name, value);
    
    setErrors({
      ...errors,
      [name]: error
    });
    
    setFormData({ 
      ...formData, 
      [name]: value 
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });
    
    setErrors(newErrors);
    return isValid;
  };
   
  const handleSubmit =async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try{
        console.log('Form submitted:', formData);

      setLoading(true);
        setErrorMessage('');
        await admissionAPI.submit(formData);
        setShowSuccess(true);
      setShowError(false);
      setFormData({
          studentName: '',
          parentName: '',
          address: '',
          aadhaar: '',
          location: '',
          institution: '',
          course: ''
        });
      setTimeout(() => setShowSuccess(false), 5000);
      

      }catch(error){
        console.error('Submission error:', error);
        setShowError(true);
        setErrorMessage(error.message);
        
        // Handle Aadhaar duplicate error specifically
        if (error.message.includes('Aadhaar')) {
          setErrors({
            ...errors,
            aadhaar: error.message
          });
        }
      }finally{
        setLoading(false);
        setTimeout(() => {
          setShowSuccess(false);
          setShowError(false);
        }, 5000);
      }
    } else {
      setShowError(true);
      setShowSuccess(false);
      
      // Hide error notification after 5 seconds
      setTimeout(() => setShowError(false), 5000);
    }
  };

  return (
    <div className="form-container container mt-5">
      {/* Success Notification */}
      {showSuccess && (
        <div className="alert alert-success alert-dismissible fade show fs-4" role="alert">
          Admission submitted successfully!
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setShowSuccess(false)}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      {/* Error Notification */}
      {showError && (
        <div className="alert alert-danger alert-dismissible fade show fs-4" role="alert">
          {errorMessage || 'Please fix the errors in the form before submitting'}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setShowError(false)}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      <h2 className="mb-4 fs-1 fw-bold">Student Admission Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <input 
            type="text" 
            name="studentName" 
            placeholder="Student's Full Name" 
            value={formData.studentName}
            onChange={handleChange} 
            className={`form-control ${errors.studentName ? 'is-invalid' : ''} fs-4 fw-normal`}
          />
          {errors.studentName && <div className="invalid-feedback">{errors.studentName}</div>}
        </div>
        
        <div className="form-group mb-3">
          <input 
            type="text" 
            name="parentName" 
            placeholder="Parent's Name" 
            value={formData.parentName}
            onChange={handleChange} 
            className={`form-control ${errors.parentName ? 'is-invalid' : ''} fs-4 fw-normal`}
          />
          {errors.parentName && <div className="invalid-feedback">{errors.parentName}</div>}
        </div>
        
        <div className="form-group mb-3">
          <textarea 
            name="address" 
            placeholder="Address" 
            value={formData.address}
            onChange={handleChange} 
            className={`form-control ${errors.address ? 'is-invalid' : ''} fs-4 fw-normal`}
            maxLength="200"
            rows="3"
          ></textarea>
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>
        
        <div className="form-group mb-3">
          <input 
            type="text" 
            name="aadhaar" 
            placeholder="Aadhaar Number" 
            maxLength="12"
            value={formData.aadhaar}
            onChange={handleChange} 
            className={`form-control ${errors.aadhaar ? 'is-invalid' : ''} fs-4 fw-normal`}
          />
          {errors.aadhaar && <div className="invalid-feedback">{errors.aadhaar}</div>}
        </div>
        
        <div className="form-group mb-3">
          <input 
            type="text" 
            name="location" 
            placeholder="Location" 
            value={formData.location}
            onChange={handleChange} 
            className={`form-control ${errors.location ? 'is-invalid' : ''} fs-4 fw-normal`}
          />
          {errors.location && <div className="invalid-feedback">{errors.location}</div>}
        </div>
        
        <div className="form-group mb-3">
          <input 
            type="text" 
            name="institution" 
            placeholder="School or College Name" 
            value={formData.institution}
            onChange={handleChange} 
            className={`form-control ${errors.institution ? 'is-invalid' : ''} fs-4 fw-normal`}
          />
          {errors.institution && <div className="invalid-feedback">{errors.institution}</div>}
        </div>
        
        <div className="form-group mb-4">
          <select 
            name="course" 
            value={formData.course}
            onChange={handleChange} 
            className={`form-select ${errors.course ? 'is-invalid' : ''} fs-4 fw-normal`}
          >
            <option value="">Select a Course</option>
            {courses.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
          {errors.course && <div className="invalid-feedback">{errors.course}</div>}
        </div>
        
         <button 
          type="submit" 
          className="btn btn-primary fs-4 fw-normal"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Submitting...
            </>
          ) : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default AdmissionForm;