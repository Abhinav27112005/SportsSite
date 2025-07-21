import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/AdmissionForm.css';
import FloatingLabelInput from '../../components/common/FloatingLabelInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { admissionAPI } from '../../services/api/client';

const courses = [
  'Computer Basics',
  'Tally with GST',
  'Graphic Designing',
  'Spoken English',
  'Web Development',
  'Programming in Python'
];

const admissionSchema = yup.object({
  studentName: yup.string().required('Student name is required').min(3, 'Must be at least 3 characters'),
  parentName: yup.string().required('Parent name is required').min(3, 'Must be at least 3 characters'),
  address: yup.string().required('Address is required').min(10, 'Address must be at least 10 characters'),
  aadhaar: yup.string().required('Aadhaar number is required').matches(/^\d{12}$/, 'Aadhaar must be 12 digits'),
  location: yup.string().required('Location is required').min(3, 'Must be at least 3 characters'),
  institution: yup.string().required('Institution is required').min(3, 'Must be at least 3 characters'),
  course: yup.string().required('Please select a course'),
});

function AdmissionForm() {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    resolver: yupResolver(admissionSchema)
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await admissionAPI.submit(data);
      setShowSuccess(true);
      setShowError(false);
      reset();
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      setShowError(true);
      setErrorMessage(error.message);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Floating label select
  const courseValue = watch('course', '');
  const [isCourseFocused, setIsCourseFocused] = useState(false);
  const shouldFloatCourse = isCourseFocused || !!courseValue;

  return (
    <div className="form-container container mt-5">
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
      <h2 className="mb-4 fs-1 fw-bold contact-title">Student Admission Form</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FloatingLabelInput
          label="Student's Full Name"
          name="studentName"
          register={register('studentName')}
          error={errors.studentName}
          value={watch('studentName', '')}
        />
        <FloatingLabelInput
          label="Parent's Name"
          name="parentName"
          register={register('parentName')}
          error={errors.parentName}
          value={watch('parentName', '')}
        />
        <FloatingLabelInput
          label="Address"
          name="address"
          type="textarea"
          register={register('address')}
          error={errors.address}
          value={watch('address', '')}
          rows={3}
          maxLength={200}
        />
        <FloatingLabelInput
          label="Aadhaar Number"
          name="aadhaar"
          register={register('aadhaar')}
          error={errors.aadhaar}
          value={watch('aadhaar', '')}
          maxLength={12}
        />
        <FloatingLabelInput
          label="Location"
          name="location"
          register={register('location')}
          error={errors.location}
          value={watch('location', '')}
        />
        <FloatingLabelInput
          label="School or College Name"
          name="institution"
          register={register('institution')}
          error={errors.institution}
          value={watch('institution', '')}
        />
        {/* Floating label select */}
        <div className="floating-label-group position-relative mb-4">
          <select
            name="course"
            {...register('course')}
            value={courseValue}
            onFocus={() => setIsCourseFocused(true)}
            onBlur={() => setIsCourseFocused(false)}
            className={`form-select ${errors.course ? 'is-invalid' : ''} fw-normal`}
            style={{padding:"1.1rem 1rem"}}
          >
            <option value="">{null}</option>
            {courses.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
          <motion.label
            htmlFor="course"
            initial={false}
            animate={shouldFloatCourse ? { y: -24, scale: 0.85 } : { y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="floating-label position-absolute px-2"
            style={{
              left: 14,
              top: 14,
              pointerEvents: 'none',
              fontSize: '1.1rem',
              background: 'rgba(255,255,255,0.85)',
              color: '#3a6ea5',
              zIndex: 2,
            }}
          >
            Course
          </motion.label>
          <AnimatePresence>
            {errors.course && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="invalid-feedback d-block"
                id="course-error"
                style={{ fontSize: '1rem' }}
              >
                {errors.course.message}
              </motion.div>
            )}
          </AnimatePresence>
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