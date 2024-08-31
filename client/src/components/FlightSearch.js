import Form from 'react-bootstrap/Form';
import 'react-bootstrap';
import '../styles/flightsearch.css';
import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// import images
import planeUp from '../assets/planeup.png';
import division from '../assets/division.png';
import swapIcon from '../assets/swapicon.png';
import dropDownIcon from '../assets/dropdowngray.png';
import calendar from '../assets/calendar.png';

function FlightSearchSelector() {
  return (
    <select className="flight-search-selector">
      <option value="oneway">ONE WAY</option>
      <option value="roundTrip">ROUND TRIP</option>
      <option value="multiCity">MULTI-CITY</option>
    </select>
  );
}


function DateSelector() {
  const [startDate, setStartDate] = useState(new Date());
  const datePickerRef = useRef(null); // Use a ref to control the DatePicker

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true); // Open the calendar when the icon is clicked
    }
  };

  const handleDateChange = (selectedDate) => {
    setStartDate(selectedDate);
  };

  const day = startDate.toLocaleString('en-US', { weekday: 'short' }); // 3-char day abbreviation
  const month = startDate.toLocaleString('en-US', { month: 'short' }); // 3-char month abbreviation
  const date = startDate.getDate(); // Day of the month
  const year = startDate.getFullYear().toString().slice(-2); // Last 2 digits of the year



  return (
    <div className="date-selector-container d-flex flex-row">

      <img src={calendar} alt='calendar icon' />
      <span className="date-display">{startDate.getDate()}</span>
      <img src={division} alt='divisions icon' />
  

      <div className="">
        <div className="day-display">{startDate.toLocaleString('en-US', { weekday: 'short' })}</div>
        <div className="mmmyy-display">{startDate.toLocaleString('en-US', { month: 'short' })}'{startDate.getFullYear().toString().slice(-2)}</div>
      </div>

      <img 
        src={dropDownIcon} 
        alt="dropdown icon" 
        onClick={handleIconClick} 
        style={{ cursor: 'pointer' }} // Make the icon clickable
      />

      <DatePicker
        ref={datePickerRef}
        selected={startDate}
        onChange={handleDateChange}
        className="hidden-datepicker" // Hide the default input if needed
        onClickOutside={() => datePickerRef.current.setOpen(false)} // Close calendar when clicking outside
      />
    </div>
  );
}

function PortSelector() {
  return (
    <select className="port-selector">
      <option value="dvo">Davao</option>
      {/* Add more options here */}
    </select>
  );
}

function DepartureSearchSelector() {
  return (
    <div className="flight-search container d-flex">
      <div className="departure-search airport-select box"> 
        <p>DEPARTURE AIRPORT</p>
        <div className="">
          <img className="plane-icon" src={planeUp} alt="plane departing" />
          <div className="departure-port-code">DVO</div>
          <img src={division} alt="division icon" />
          <div>
            <PortSelector />
          </div>
        </div>
        <img src={dropDownIcon} alt="dropdown icon" />
      </div>

      <div>
        <img className="swap-icon" src={swapIcon} alt="swap departure and arrival locations" />
      </div>

      <div className="return-search airport-select box">
        <p>ARRIVAL AIRPORT</p>
        <div>MNL</div>
      </div>

      <div className="departure-date box">
        <p>DEPARTURE DATE</p>
        <div className='cont'>
          <DateSelector />
        </div>
      </div>
    </div>
  );
}

export default FlightSearchSelector;
export { DepartureSearchSelector };