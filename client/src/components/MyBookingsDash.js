



import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from "react";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function AdminBookingDash() {
  const notyf = new Notyf({ duration: 3000 });
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null); // Added error state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [columnSearch, setColumnSearch] = useState({
    userId: "",
    bookingStatus: "",
    bookingDate: "",
    seatClass: "",
    isCancelled: ""
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // FETCH DATA - GET ALL BOOKINGS
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Retrieve token from localStorage
        const token = localStorage.getItem('token');
  
        // Check if token exists
        if (!token) {
          setError('You are not authorized to view this content. Please log in.');
          return;
        }
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/bookings/mybookings`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the header
          }
        });
  
        if (!response.ok) {
          // Handle unauthorized access
          if (response.status === 401 || response.status === 403) {
            setError('Your session has expired. Please log in again.');
            // Optionally redirect to login page
            // navigate('/login');
            return;
          }
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        console.log('Fetched data:', data);
  
        // Check if data is an array
        if (Array.isArray(data)) {
          setBookings(data);
        } else if (Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          setBookings([]); // Ensure bookings is an array
          setError('No bookings data found.');
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setError('There was a problem fetching the bookings.');
        setBookings([]); // Ensure bookings is set to an empty array
      }
    };
    fetchBookings();
  }, []);
  

  // HANDLE SORTING WHEN TABLE HEADER IS CLICKED
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // HANDLE SORTING
  const getSortedBookings = () => {
    const sortedBookings = [...bookings];
    if (sortConfig.key) {
      sortedBookings.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortedBookings;
  };

  // FILTER BOOKINGS
  const filteredBookings = getSortedBookings().filter((booking) =>
    Object.keys(columnSearch).every((key) => {
      const bookingValue = booking[key];
      const searchValue = columnSearch[key];

      if (searchValue === "") {
        return true; // If search input is empty, return all results
      }

      // Handle string searches (text)
      if (typeof bookingValue === "string") {
        return bookingValue.toLowerCase().includes(searchValue.toLowerCase());
      }

      // Handle boolean searches
      if (typeof bookingValue === "boolean") {
        return bookingValue === (searchValue === "true");
      }

      return true; // Default return for unmatched cases
    })
  );

  const paginatedBookings = filteredBookings.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);

  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setModalVisible(true);
  };

  const handleCloseModal = () => setModalVisible(false);

  const renderTableHeader = (label, key) => (
    <th onClick={() => handleSort(key)}>
      {label}
    </th>
  );

  const renderTableSearch = (key, type) => (
    <td>
      {type === 'text' ? (
        <input
          type="text"
          value={columnSearch[key] || ""}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          placeholder={`Search ${key}`}
          className="table-search-input"
        />
      ) : type === 'boolean' ? (
        <select
          value={columnSearch[key] || ""}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          className="table-search-input"
        >
          <option value="">All</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      ) : null}
    </td>
  );

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex justify-content-between mb-3">
        <Button variant="secondary" onClick={() => setColumnSearch({ userId: "", bookingStatus: "", bookingDate: "", seatClass: "", isCancelled: "" })} className="ms-2">Clear Search</Button>
        <select
          className='ms-auto'
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            {renderTableHeader("USER ID", "userId")}
            {renderTableHeader("BOOKING STATUS", "bookingStatus")}
            {renderTableHeader("BOOKING DATE", "bookingDate")}
            {renderTableHeader("SEAT CLASS", "seatClass")}
            {renderTableHeader("IS CANCELLED", "isCancelled")}
          </tr>
          <tr>
            {renderTableSearch("userId", "text")}
            {renderTableSearch("bookingStatus", "text")}
            {renderTableSearch("bookingDate", "text")}
            {renderTableSearch("seatClass", "text")}
            {renderTableSearch("isCancelled", "boolean")}
          </tr>
        </thead>
        <tbody>
          {paginatedBookings.length > 0 ? (
            paginatedBookings.map((booking) => (
              <tr key={booking._id} onClick={() => handleRowClick(booking)}>
                <td>{booking.userId ? booking.userId._id : 'N/A'}</td>
                <td>{booking.bookingStatus || 'N/A'}</td>
                <td>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}</td>
                <td>{booking.seatClass || 'N/A'}</td>
                <td>{booking.isCancelled != null ? (booking.isCancelled ? "Yes" : "No") : 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No bookings available</td>
            </tr>
          )}
        </tbody>
      </table>

      {filteredBookings.length > 0 && (
        <div className="pagination-controls">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      )}

      {/* MODAL FOR DETAILS */}
      {selectedBooking && (
        <Modal show={isModalVisible} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Booking Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>User ID:</strong> {selectedBooking.userId ? selectedBooking.userId._id : 'N/A'}</p>
            <p><strong>User Email:</strong> {selectedBooking.userId ? selectedBooking.userId.email : 'N/A'}</p>
            <p><strong>Booking Status:</strong> {selectedBooking.bookingStatus || 'N/A'}</p>
            <p><strong>Booking Date:</strong> {selectedBooking.bookingDate ? new Date(selectedBooking.bookingDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Seat Class:</strong> {selectedBooking.seatClass || 'N/A'}</p>
            <p><strong>Is Cancelled:</strong> {selectedBooking.isCancelled != null ? (selectedBooking.isCancelled ? "Yes" : "No") : 'N/A'}</p>
            <p><strong>Created:</strong> {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Last Update:</strong> {selectedBooking.updatedAt ? new Date(selectedBooking.updatedAt).toLocaleDateString() : 'N/A'}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
