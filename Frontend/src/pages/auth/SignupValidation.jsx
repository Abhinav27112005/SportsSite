const Validate = (values) => {
    const errors = {};
    const name = String(values.name || "").trim();
    const email = String(values.email || "").trim();
    const password = String(values.password || "").trim();
    const confirmPassword = String(values.confirmPassword || "").trim();
  
    // Name validation
    if (!name) {
      errors.name = "Name is required";
    } else if (name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
  
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
  
    // Confirm Password validation
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }
  
    return errors;
  };
  
  export default Validate;