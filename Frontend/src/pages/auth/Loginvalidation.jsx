const validate = (values) => {
    const errors = {};
    const email = String(values.email || "").trim();
    const password = String(values.password || "").trim();
  
    // Email validation
    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email";
    }
  
    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
  
    return errors;
  };
  
  export default validate;