import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingSummaryTable from '../components/BookingSummaryTable';
import { BackButton, PayButton } from '../components/Buttons';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { Spinner, Modal } from 'react-bootstrap';

export default function BookingSummary() {
  const notyf = new Notyf();
  const location = useLocation();
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(() => {
    const stateData = location.state?.bookingData;
    const localData = localStorage.getItem('bookingData');
    if (stateData) {
      localStorage.setItem('bookingData', JSON.stringify(stateData));
      return stateData;
    }
    return localData ? JSON.parse(localData) : null;
  });

  const [guestEmail, setGuestEmail] = useState(() => {
    const stateEmail = location.state?.guestEmail;
    const localEmail = localStorage.getItem('guestEmail');
    if (stateEmail) {
      localStorage.setItem('guestEmail', stateEmail);
      return stateEmail;
    }
    return localEmail || '';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  useEffect(() => {
    if (!bookingData) {
      navigate('/flights');
    }
  }, [bookingData, navigate]);

  useEffect(() => {
    if (bookingData) {
      localStorage.setItem('bookingData', JSON.stringify(bookingData));
    }
  }, [bookingData]);

  useEffect(() => {
    if (guestEmail) {
      localStorage.setItem('guestEmail', guestEmail);
    }
  }, [guestEmail]);

  const createPassengers = async (guests) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/passengers/addmultiple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ passengers: guests }),
    });
    return response.json();
  };

  const createBooking = async (passengerIds) => {
    const bookingPayload = {
      userId: bookingData?.user?.id || null,
      passengerIds,
      commercialFlightId: bookingData?.selectedFlight?._id,
      promoId: bookingData?.promo || null,
      fare: bookingData?.fare,
      seatClass: bookingData?.seatClass,
    };

    const response = await fetch(`${process.env.REACT_APP_API_URL}/bookings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(bookingPayload),
    });
    return response.json();
  };

  const handleCreateBooking = async () => {
    try {
      setIsPaymentProcessing(true);
      setIsLoading(true); // Set loading to true at the start
      const guestsToSubmit = bookingData?.finalGuests.map((guest) => {
        const birthday =
          guest.year && guest.month && guest.day
            ? `${guest.year}-${String(guest.month).padStart(2, '0')}-${String(guest.day).padStart(2, '0')}`
            : '';
        return { ...guest, birthday };
      });
  
      if (!guestsToSubmit?.length) return;
  
      const passengerData = await createPassengers(guestsToSubmit);
      const bookedData = await createBooking(passengerData.passengerIds);
  
      localStorage.removeItem('guestEmail');
      navigate('/payment', { state: { bookedData, guestEmail } });
    } catch (error) {
      notyf.error(`Error booking: ${error.message}`);
    } finally {
      setIsPaymentProcessing(false);
      setIsLoading(false); // Set loading to false after completion
    }
  };

  if (!bookingData) return null; // Or display a loading spinner or message

  return (
    <div>
      <div className="container">
        <Modal
          show={isLoading}
          centered
          backdrop="static"
          keyboard={false}
        >
            <Modal.Body className="d-flex align-items-center justify-content-center text-center">
              <Spinner animation="border" role="status" className="me-3">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mb-0">Processing your booking, please wait ...</p>
            </Modal.Body>
        </Modal>
  
        <h5>Please review your booking before proceeding to payment</h5>
        <h2>Booking Summary</h2>
        <BookingSummaryTable bookingData={bookingData} />
        <div>
          <p>
            By clicking the ‘Continue’ button below, I confirm that I have read, understood, and accept all the conditions set by the airline.
          </p>
        </div>
        <div className="d-flex">
          <div className="ms-auto">
            <BackButton link="/flights/guests" />
            {!isLoading && (
              <PayButton onClick={handleCreateBooking} disabled={isPaymentProcessing} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
}
