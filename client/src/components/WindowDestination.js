// src/components/WindowDestination.js

import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import '../styles/windowdestination.css';
import Spinner from 'react-bootstrap/Spinner';

export default function WindowDestination() {
  const navigate = useNavigate();

  // State variables for destinations, loading, and error
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch destinations from the backend API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/destinations/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Optional: Filter out inactive destinations if needed
        const activeDestinations = data.filter(destination => destination.isActive);

        setDestinations(activeDestinations);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Handle card click to navigate to destination details page
  const handleCardClick = (destinationId) => {
    navigate(`/destination/${destinationId}`);
  };

  // Render loading state
  if (loading) {
    return (
      <div className='window-destination-container' data-aos="fade-up">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading destinations...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className='window-destination-container' data-aos="fade-up">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <p className="text-danger">Failed to load destinations. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='window-destination-container' data-aos="fade-up">
      <div className="mt-5">
        <h3 className="window-destination-title"><strong>Your Next Vacation</strong></h3>
        <p className="window-destination-subtitle">Come and visit these places</p>

        <div className="window-destination-grid">
          {destinations.map((destination) => (
            <div
              key={destination._id}
              className="window-destination-card"
              onClick={() => handleCardClick(destination._id)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleCardClick(destination._id);
              }}
              role="button"
              tabIndex="0"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <img 
                className="window-destination-image" 
                src={destination.photoUrl1} 
                alt={destination.title} 
                loading="lazy"
              />
              <div className="window-destination-body">
                <div className="window-destination-header">
                  <h4 className="window-destination-name">{destination.destination}</h4>
                  <div className="window-destination-rating">
                    <i className="bi bi-star-fill" style={{ color: '#FFD700' }}></i>
                    <span>{destination.rating.toFixed(2)}</span>
                  </div>
                </div>
                <p className="window-destination-description">{destination.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
