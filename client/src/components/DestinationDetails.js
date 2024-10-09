// src/components/DestinationDetails.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Button, Badge, Alert, Container } from 'react-bootstrap';
import '../styles/destinationDetails.css'; // Ensure this CSS file exists and is correctly styled

export default function DestinationDetails() {
  const { id } = useParams(); // Extract the destination ID from the URL
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/destinations/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched Destination:', data); // Debugging line
        setDestination(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching destination:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  // Handle going back to the previous page
  const handleBack = () => {
    navigate(-1);
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Render loading state
  if (loading) {
    return (
      <div className="destination-details-container d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading destination details...</span>
        </Spinner>
      </div>
    );
  }

  // Render error state
  if (error || !destination) {
    return (
      <div className="destination-details-container d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Alert variant="danger">Failed to load destination details. Please try again later.</Alert>
      </div>
    );
  }

  return (
    <div className="destination-details-container" >
      <Container className="my-5" data-aos="fade-up">
        <Button variant="secondary" onClick={handleBack} className="mb-4">
          &larr; Back
        </Button>
        <div className="destination-details-content">
          <div className="destination-images">
            <img src={destination.photoUrl1} alt={`${destination.title} - Main`} className="img-fluid main-image" />
            {destination.photoUrl2 && (
              <img src={destination.photoUrl2} alt={`${destination.title} - Additional`} className="img-fluid secondary-image mt-3" />
            )}
          </div>
          <div className="destination-info mt-4">
            <h2>{destination.title}</h2>
            <h4 className="text-muted">{destination.destination}</h4>
            <div className="mb-3">
              <Badge bg="warning" text="dark">
                <i className="bi bi-star-fill" style={{ color: '#FFD700' }}></i> {destination.rating.toFixed(2)}
              </Badge>
            </div>
            <div className="description-section">
              <p>{destination.p1}</p>
              {destination.p2 && <p> {destination.p2}</p>}
              {destination.p3 && <p> {destination.p3}</p>}
            </div>
            {/* <div className="status-section mt-3">
              <strong>Status:</strong> {destination.isActive ? <Badge bg="success">Active</Badge> : <Badge bg="secondary">Archived</Badge>}
            </div>
            <div className="timestamps-section mt-2">
              <small className="text-muted">
                Created At: {formatDate(destination.createdAt)}<br />
                Last Updated: {formatDate(destination.updatedAt)}
              </small>
            </div> */}
          </div>
        </div>
      </Container>
    </div>

   
      // <div className="destination-details-container">
      //   <Container className="my-5" data-aos="zoom-in">
      //     <Button variant="secondary" onClick={handleBack} className="mb-4">
      //       &larr; Back
      //     </Button>
      //     <div className="destination-details-content">
      //       <h2>{destination.title}</h2>
      //       <h4 className="text-muted">{destination.destination}</h4>
      //     </div>
      //   </Container>
      // </div>
  
    
  );
}
