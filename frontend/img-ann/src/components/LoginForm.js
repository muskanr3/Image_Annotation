import React, { useState } from "react";
import axios from "axios";
import "../css/LoginForm.css"; // Import CSS file for styling

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login/", formData);
      console.log(response.data); // Handle successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="form-input" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="form-input" />
        <button type="submit" className="submit-button">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
