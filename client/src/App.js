import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import ErrorBoundary from './components/ErrorBoundary'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';


import NavBar from '../src/components/NavBar';
import Home from './pages/Home';

// Search flights pages
import FlightsSearch from './pages/FlightsSearch';
import FlightsOptions from './pages/FlightsOptions';
import FlightsGuests from './pages/FlightsGuests';
import BookingSummary from './pages/BookingSummary';
import Payment from './pages/Payment';
import Test from './pages/Test';
import Destinations from './pages/Destinations';
import LoginPage from './pages/LoginPage';

// Admin pages exclusive
import AdminControl from './pages/AdminControl';
import AdminPage from './pages/AdminPage';
import AdminCreate from './pages/AdminCreate';

// Logged users exclusive
import MyBookingsPage from './pages/MyBookings';
import Users from './pages/UserDash';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Deals from './pages/Deals';

import Checkin from './pages/Checkin';
import TicketP from './pages/Ticket';


import DestinationDetails from './components/DestinationDetails';
import WindowDestination from './components/WindowDestination';



function App() {
  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration
      easing: 'ease-in-out', // Easing function
      once: true, // Whether animation should happen only once
    });
  }, []);

  return (
    <>
    
      <UserProvider>
      <ErrorBoundary>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<FlightsSearch />} />
            <Route path="/flights/options" element={<FlightsOptions />} />
            <Route path="/flights/guests" element={<FlightsGuests />} />
            <Route path="/bookings" element={<BookingSummary />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/test" element={<Test />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mybookings" element={<MyBookingsPage />} />

            <Route path="/admin/create" element={<AdminCreate />} />
            <Route path="/admin/control" element={<AdminControl />} />
            <Route path="/admin/page" element={<AdminPage />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ticket" element={<TicketP />} />
            <Route path="/checkin" element={<Checkin />} />

            {/* Dynamic Check-in Route */}
            <Route path="/checkin/:id/:firstName/:lastName" element={<Checkin />} />
            <Route path="/destination/:id" element={<DestinationDetails />} />
            <Route path="/" element={<WindowDestination />} />

            <Route path="/*" element={<NotFound />} />
          </Routes>
        </Router>
        </ErrorBoundary>
      </UserProvider>
      
    </>
  );
}

export default App;
