import React, { useState } from "react";
import axios from "axios";
import "../css/RegistrationForm.css"; // Import CSS file for styling

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/register/", formData);
      console.log(response.data); // Handle successful registration
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="registration-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="form-input" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="form-input" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="form-input" />
        <button type="submit" className="submit-button">Register</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
