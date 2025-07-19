const Validate = (values) => {
    const errors = {};
    const name = String(values.name || "").trim();
    const email = String(values.email || "").trim();
    const message = String(values.message || "").trim();
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
  
    // message validation
    if (!message) {
      errors.message = "Message is required";
    } else if (message.length < 10) {
      errors.message = "Message should be meaningful (at least 10 characters)";
    }
  
    return errors;
  };
  
  export default Validate;