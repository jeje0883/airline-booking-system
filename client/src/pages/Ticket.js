


import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { FaChair, FaPlaneDeparture, FaPlaneArrival, FaUser, FaPlane, FaCalendarAlt } from 'react-icons/fa';
import { FaLocationArrow } from "react-icons/fa6";
import { MdAirlineSeatReclineExtra } from "react-icons/md";
import { GiUpgrade } from "react-icons/gi";
import { IoTicket } from "react-icons/io5";
import { Button, Modal } from 'react-bootstrap';
import '../styles/ticket.css';
import logo from '../images/logo.png'; // Ensure this logo matches the desired aesthetic
import { Base64 } from 'js-base64';

const TicketDetails = () => {
  const location = useLocation();
  const { bookedData, guestEmail } = location.state || {};
  console.log('TicketDetails:', bookedData);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const departureTime = bookedData?.commercialFlightId?.departureTime || '00:00';
  const durationMins = bookedData?.commercialFlightId?.flight?.route?.durationMins || 0;

  useEffect(() => {
    if (guestEmail) {
      setShowEmailModal(true);
    }
  }, [guestEmail]);

  const handlePrint = () => {
    window.print();
  };

  const addTime = (departureTime, durationMins) => {
    const [departureHours, departureMinutes] = departureTime.split(':').map(Number);
    const durationHours = Math.floor(durationMins / 60);
    const durationRemainingMinutes = durationMins % 60;

    let totalHours = departureHours + durationHours;
    let totalMinutes = departureMinutes + durationRemainingMinutes;

    if (totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
    }

    totalHours %= 24;

    const formattedHours = totalHours.toString().padStart(2, '0');
    const formattedMinutes = totalMinutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  };

  if (!bookedData) {
    return <div className="ticket-page">No booking data available.</div>;
  }

  const mapSeatClass = (seatClass) => {
    const seatClassMap = {
      economySeat: 'Economy Class Passenger',
      premiumSeat: 'Premium Class Passenger',
      businessSeat: 'Business Class Passenger',
      firstClass: 'First Class Passenger'
    };

    return seatClassMap[seatClass] || 'Unknown Class';
  };

  const capitalizeName = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const shortenObjectId = (id) => {
    const hexToBytes = (hex) => {
      const bytes = [];
      for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
      }
      return bytes;
    };

    const buffer = hexToBytes(id);
    return Base64.fromUint8Array(new Uint8Array(buffer))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''); // Remove padding
  };

  const ticketNo = shortenObjectId(bookedData._id);

  return (
    <div className="ticket-page">
      <div className="ticket-actions">
        <Button variant="primary" onClick={handlePrint}>Print or Save as PDF</Button>
      </div>

      {bookedData.passengerIds.map((passenger, index) => (
        <div key={index} className="ticket">
          <div className="ticket-header">
            <img src={logo} alt="Logo" className="ticket-logo" />
            <h2>Fly Air Ticket</h2>
          </div>

          <hr className="divider" />

          <div className="ticket-body">
            <div className="ticket-section flight-info">
              <div>
                <h3>Ticket Information</h3>
                <p><IoTicket className="icon" /> Booking Reference: {ticketNo}</p>
                <p><MdAirlineSeatReclineExtra className="icon" /> {mapSeatClass(bookedData.seatClass)}</p>
                <p><GiUpgrade className='icon' /> Applied Upgrade:</p>
              </div>
              <br />

              <div>
                <h3>Passenger Details</h3>
                <p><FaUser className="icon" /> {capitalizeName(passenger.firstName)} {capitalizeName(passenger.lastName)}</p>
                <p><FaChair className="icon" /> Seat: {passenger.seatNumber || 'Not assigned'}</p>
              </div>
              <br />

              <div className="ticket-qr">
                <p>Scan to check-in</p>
                <QRCode
                  value={`https://airline-booking-front.vercel.app/checkin/${ticketNo}/${passenger.firstName}/${passenger.lastName}`}
                  size={80}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              </div>
            </div>

            <div className="ticket-section flight-info">
              <h3>Flight Details</h3>
              <p><FaPlane className="icon" /> Flight No: {bookedData.commercialFlightId.flight.flightNo}</p>
              <p><FaCalendarAlt className="icon" /> Date: {bookedData.commercialFlightId.date}</p>
              <br />
              <p><FaPlaneDeparture className="icon" /> Departure Time: {departureTime} H</p>
              <p><FaLocationArrow className="icon" /> From: {bookedData.commercialFlightId.flight.route.departure.airportCode}</p>
              <p>{bookedData.commercialFlightId.flight.route.departureAirportName}</p>
              <br />
              <p><FaPlaneArrival className="icon" /> Arrival Time: {addTime(departureTime, durationMins)} H</p>
              <p><FaLocationArrow className="icon" /> To: {bookedData.commercialFlightId.flight.route.destination.airportCode}</p>
              <p>{bookedData.commercialFlightId.flight.route.destinationAirportName}</p>
            </div>
          </div>

          <div className="ticket-footer">
            <p>Thank you for flying with us! Safe travels.</p>
          </div>
        </div>
      ))}

      {showEmailModal && (
        <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Booking Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            A confirmation email has been sent to {guestEmail}.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default TicketDetails;
