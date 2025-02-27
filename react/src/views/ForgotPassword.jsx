import React, { useState } from 'react'
import { useStateContext } from '../contexts/contextprovider';
import axiosClient from '../axios-client';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);
  const { csrf } = useStateContext();

  const onSubmit = async (e) => {
    e.preventDefault();
    await csrf(); // CSRF protection
    setErrors([]); // Clear previous errors
    setStatus(null); // Clear previous status
    try {
      const response = await axiosClient.post("/forgot-password", { email });
      setStatus("An email has been sent."); // Custom success message
    } catch (e) {
      if (e.response && e.response.status === 422) { // Validation error handling
        setErrors(e.response.data.errors);
      }
    }
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Forgot Password</h1>
          
          {status && <div className="alertgreen">{status}</div>} {/* Status Message */}
          
          <input 
            type="email" 
            placeholder="Email" 
            value={email} // Bind email state to input
            onChange={(e) => setEmail(e.target.value)} // Update email state on change
          />
          
          {/* Display errors */}
          {errors.email && <div className="error">{errors.email}</div>} 
          
          <button className="btn btn-block">Submit</button>
        </form>
      </div>
    </div>
  );
}
