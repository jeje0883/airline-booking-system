// src/components/ErrorBoundary.js

import React from 'react';
import { Alert } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to display fallback UI on next render
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log error details for debugging
    console.error('Error Boundary Caught an Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Alert variant="danger">Something went wrong. Please try again later.</Alert>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
