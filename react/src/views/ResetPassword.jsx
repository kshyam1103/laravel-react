import React, { useState, useEffect } from 'react'
import { useStateContext } from '../contexts/contextprovider';
import {Link, useParams, useSearchParams} from "react-router-dom";
import axiosClient from '../axios-client';

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const { csrf } = useStateContext();

  const { token } = useParams(); // Get token from URL 

useEffect(() => {
    setEmail(searchParams.get("email"));
}, []);


const onSubmit = async (e) => {
  e.preventDefault();
  await csrf(); // CSRF protection

  setErrors([]);
  setStatus(null);

  try {
      const token = searchParams.get("token"); 
      const email = searchParams.get("email"); 
    
      const response = await axiosClient.post("/reset-password", {
          token,
          email,
          password, // Use state variable
          password_confirmation, // Use state variable
      });

      setStatus(response.data.message);
  } catch (e) {
      if (e.response && e.response.status === 422) {
          setErrors(e.response.data.errors);
          // Check if the error is about using the same password
          if (e.response.data.errors.password) {
              setStatus(e.response.data.errors.password[0]); // Show the error message
          }
      }
  }
};




  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Reset Password</h1>
          
          {status && <div className="alertgreen">{status}</div>} {/* Status Message */}
          {errors.password && <div className="alertgreen">{errors.password[0]}</div>} {/* Show password error */}

          
          <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}/>
          <input type="password" placeholder="Confirm Password" value={password_confirmation} 
          onChange={(e) => setPasswordConfirmation(e.target.value)}/>

          {/* Display errors */}
          {errors.email && <div className="error">{errors.email}</div>} 
          
          <button className="btn btn-block">Reset</button>
          <p className="message">
            <Link to="/login">Go To Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
