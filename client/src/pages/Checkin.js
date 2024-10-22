
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import '../styles/checkin.css';
import { Modal, Spinner } from 'react-bootstrap'; // Import Modal and Spinner

// Create an instance of Notyf for notifications
const notyf = new Notyf();

export default function Checkin() { 

  const { id, firstName, lastName } = useParams(); // Extract parameters
  const [firstname, setFirstname] = useState(firstName || "");
  const [lastname, setLastname] = useState(lastName || "");
  const [ticket, setTicket] = useState(id || "");
  const [checkinData, setCheckinData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // State to handle loading

  const decodeShortenedObjectId = (shortId) => {
    const base64ToUint8Array = (base64) => {
      const decoded = base64.replace(/-/g, '+').replace(/_/g, '/');
      const padded = decoded.padEnd(decoded.length + (4 - (decoded.length % 4)) % 4, '=');
      return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
    };

    const bytesToHex = (bytes) => {
      return Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
    };

    const bytes = base64ToUint8Array(shortId);
    return bytesToHex(bytes);
  };

  useEffect(() => {
    // Optionally, you can trigger the submit automatically if all params are present
    if (firstname && lastname && ticket) {
      handleSubmit(new Event('submit'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const originalId = decodeShortenedObjectId(ticket);

    // Check if the originalId is a valid 24-character ObjectId
    if (!originalId || originalId.length !== 24) {
      setErrorMessage('Invalid ticket number. Please check and try again.');
      setCheckinData(null);
      return;
    }

    // Clear any previous error message and check-in data before the new request
    setErrorMessage(null);
    setCheckinData(null);
    setIsProcessing(true); // Start the loading spinner

    const payload = {
      firstName: firstname,
      lastName: lastname,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/bookings/${originalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      setCheckinData(data);
      notyf.success(data.message);
    } catch (error) {
      console.error('There was an error fetching the check-in data:', error);
      setErrorMessage(error.message || 'There was an error processing your check-in.');
      notyf.error(error.message || 'There was an error processing your check-in.');
    } finally {
      setIsProcessing(false); // Stop the loading spinner
    }
  }

  return (
    <div className="checkin-container">
      <h1>Check-in</h1>
      <form className="checkin-form" onSubmit={handleSubmit}>
        <label htmlFor="firstname">
          First Name:
          <input
            type="text"
            id="firstname"
            name="firstname"
            placeholder="Please enter name exactly as it appears on your ticket"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </label>
        <label htmlFor="lastname">
          Last Name:
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Please enter name exactly as it appears on your ticket"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </label>
        <label htmlFor="ticket">
          Ticket Number:
          <input
            type="text"
            id="ticket"
            name="ticket"
            placeholder="Case sensitive"
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            required
          />
        </label>
        <input type="submit" value="Submit" />
      </form>

      {/* Display error message or check-in message */}
      {(errorMessage || checkinData?.message) && (
        <div className={`message-container ${errorMessage ? 'error' : 'success'}`}>
          <p>{errorMessage || checkinData.message}</p>
        </div>
      )}

      {/* Check-in details */}
      {checkinData?.booking && checkinData.booking.commercialFlightId && (
        <div className="checkin-info">
          <h2>Check-in Information</h2>
          <p><strong>Flight:</strong> {checkinData.booking.commercialFlightId.flight?.flightNo}</p>
          <p>
            <strong>Route:</strong>{' '}
            {checkinData.booking.commercialFlightId.flight?.route?.departureAirportCode} -{' '}
            {checkinData.booking.commercialFlightId.flight?.route?.destinationAirportCode}
          </p>
          <p>
            <strong>Departure:</strong> {checkinData.booking.commercialFlightId.date} /{' '}
            {checkinData.booking.commercialFlightId.departureTime} H
          </p>
        </div>
      )}

      {/* Modal for Processing Check-in */}
      <Modal show={isProcessing} backdrop="static" keyboard={false} centered>
        <Modal.Body className="d-flex align-items-center justify-content-center text-center">
          <Spinner animation="border" role="status" className="me-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mb-0">Processing your check-in, please wait ...</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}
