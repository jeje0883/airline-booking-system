import React, { useState, useContext, useEffect } from 'react';
import '../styles/loginwindow.css';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext.js';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';


function LoginWindow({ isVisible, onClose, handleSignUpClick, initialEmail }) { // Add initialEmail prop
  const notyf = new Notyf({ duration: 3000});
  const [email, setEmail] = useState(initialEmail || ''); // Pre-fill with initialEmail if provided

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Function to handle form submission
  const handleLogin = (event) => {
    event.preventDefault();
    setLoading(true);
    setError(''); // Clear any previous errors

    fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data.access) {
          localStorage.setItem('token', data.access); // Save token
          setEmail('');
          setPassword('');
          retrieveUserDetails(data.access); // Call retrieveUserDetails after successful login
          notyf.success('Successfully logged in.');
        } else {
          setError(data.message || 'Login failed. Please try again.');
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        setError(error.message || 'An error occurred. Please try again.');
        setLoading(false);
      });
  };

  const retrieveUserDetails = (token) => {
    console.log('Retrieving user details with token:', token);
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const user = data.user;
        if (user && user._id) {
          login({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
            email: user.email,
            mobileNo: user.mobileNo,
          });
  
          // Store the token in localStorage
          localStorage.setItem('token', token);
  
          navigate(user.isAdmin ? '/admin/create' : '/flights');
          setLoading(false);
          onClose(); // Optionally close the login window after navigating
        } else {
          setError('User details not found.');
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
        setError('Failed to retrieve user details.');
        setLoading(false);
      });
  };

  return (
    <div className={`login-window ${isVisible ? 'visible' : ''}`}>
      <div className="close-btn-container">
        <button onClick={onClose} className="btn-close">&times;</button>
      </div>
      <div className="login-window-content">
        <h2>Login to Your Account</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Enter your password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password-btn"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* <div className="separator">
          <span>Or</span>
        </div>

        <div className="social-login">
          <button className="btn btn-google" disabled={loading}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
              alt="Google"
              className="social-icon"
            />
            <span>Login with Google</span>
          </button>
          <button className="btn btn-apple" disabled={loading}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="Apple"
              className="social-icon"
            />
            <span>Login with Apple</span>
          </button>
        </div> */}

        <div className="signup-link">
          <span>
            Don't have an account?{' '}
            <button type="button" onClick={handleSignUpClick} className="switch-btn mx-2">
              Sign Up
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginWindow;
