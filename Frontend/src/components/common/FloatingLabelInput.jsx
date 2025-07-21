import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingLabelInput = ({ label, type = "text", register, error, value, name, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);
  // The label floats if focused or has value
  const shouldFloat = isFocused || (!!value && value.length > 0);
  return (
    <div className="floating-label-group position-relative mb-3">
      <input
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''} py-3`}
        {...register}
        {...rest}
        name={name}
        value={value}
        onFocus={e => { setIsFocused(true); rest.onFocus && rest.onFocus(e); }}
        onBlur={e => { setIsFocused(false); rest.onBlur && rest.onBlur(e); }}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        autoComplete="off"
      />
      <motion.label
        htmlFor={rest.id || name}
        initial={false}
        animate={shouldFloat ? { y: -24, scale: 0.85 } : { y: 0, scale: 1 }}
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
        {label}
      </motion.label>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="invalid-feedback d-block"
            id={`${name}-error`}
            style={{ fontSize: '1rem' }}
          >
            {error.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingLabelInput; 