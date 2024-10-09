
// import React from 'react';
// import { SelectButton } from './Buttons';
// import '../styles/flighttable.css';

// // Define the available class options

// const CLASS_OPTIONS = [
//   { value: 'economySeat', label: 'Economy' },
//   { value: 'premiumSeat', label: 'Premium' },
//   { value: 'businessSeat', label: 'Business' },
//   { value: 'firstClass', label: 'First Class' },
// ];

// function FlightTable({ 
//   selectedFlights = [], 
//   selectedFlight, 
//   onSelectFlight, 
//   onClassChange, 
//   promo,
//   selectedClasses = {} // Receive selectedClasses as prop
// }) {
//   const discount = promo?.discount || 0;
//   const absolutePricing = promo?.absolutePricing || 0;

//   // Function to format duration from minutes
//   const formatDuration = (durationMins) => {
//     const hours = Math.floor(durationMins / 60);
//     const minutes = durationMins % 60;
//     return `${hours}h ${minutes}m`;
//   };

//   // Function to parse time strings into minutes for accurate comparison
//   const timeToMinutes = (timeStr) => {
//     if (!timeStr) return 0;
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours * 60 + minutes;
//   };

//   // Sort the selectedFlights array by departureTime
//   const sortedFlights = [...selectedFlights].sort((a, b) => {
//     const timeA = timeToMinutes(a.departureTime);
//     const timeB = timeToMinutes(b.departureTime);
//     return timeA - timeB;
//   });

//   // Optional: Function to adjust price based on class
//   const getPriceForClass = (pricing, flightId, distance, distanceFactor) => {
//     const selectedClass = selectedClasses[flightId] || 'economySeat';

//     // Define price multipliers for different classes
//     const classMultipliers = {
//       economySeat: pricing.economyFactor || 1,
//       businessSeat: pricing.businessFactor || 1.5,
//       premiumSeat: pricing.premiumFactor || 1.2,
//       firstClass: pricing.firstClassFactor || 2,
//     };

//     const multiplier = classMultipliers[selectedClass] || 1;
//     const basePrice = pricing.basePrice || 0;
//     const price = multiplier * (basePrice + (distance * distanceFactor));

//     // Apply promo discounts
//     const finalPrice = ((price * (100 - discount)) / 100) + absolutePricing;

//     return finalPrice.toLocaleString('en-US', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });
//   };


//   return (
//     <div className="flight-table-container">
//       {sortedFlights.length === 0 ? (
//         <p>No available flights.</p>
//       ) : (
//         <table className="flight-table">
//           <thead>
//             <tr>
//               <th>Departure Time</th>
//               <th>Arrival Airport</th>
//               <th>Duration</th>
//               <th>Flight No</th>
//               <th>Price & Seats</th>
//               <th>Class</th> {/* New Class column */}
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {sortedFlights.map((flight) => {
//               // Calculate flight details
//               const flightDuration =
//                 flight.route && flight.route.durationMins
//                   ? formatDuration(flight.route.durationMins)
//                   : 'N/A';

//               const pricing = flight.pricing || {};
//               const departureTime = flight.departureTime || 'N/A';
//               const arrivalAirport =
//                 flight.route && flight.route.destination
//                   ? flight.route.destination.airportName
//                   : 'N/A';
              
//               const distance = flight.flight.route.distanceKM || 0;
//               const distanceFactor = pricing.distanceFactor || 0;
//               const isSelected = selectedFlight === flight;
//               const selectedClass = selectedClasses[flight._id] || 'economySeat';
//               const displayedPrice = getPriceForClass(pricing, flight._id, distance, distanceFactor);

//               return (
//                 <tr key={flight._id} className={isSelected ? 'selected' : ''}>
//                   <td>{departureTime}</td>
//                   <td>{arrivalAirport}</td>
//                   <td>{flightDuration}</td>
//                   <td>{flight.flightNo}</td>
//                   <td>
//                     PHP {displayedPrice} ({flight.availableSeats[selectedClass]} seats)
//                   </td>
//                   <td>
//                     <select
//                       value={selectedClass}
//                       onChange={(e) => {
//                         if (isSelected) {
//                           onClassChange(flight._id, e.target.value);
//                         }
//                       }}
//                       disabled={!isSelected} // Disable if not selected
//                       className={!isSelected ? 'disabled-select' : ''}
//                     >
//                       {CLASS_OPTIONS.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td>
//                     <SelectButton
//                       isSelected={isSelected}
//                       onClick={() => onSelectFlight(flight)}
//                       disabled={flight.availableSeats[selectedClass] === 0}
//                     />
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default FlightTable;


import React from 'react';
import { SelectButton } from './Buttons';
import '../styles/flighttable.css';

// Define the available class options
const CLASS_OPTIONS = [
  { value: 'economySeat', label: 'Economy' },
  { value: 'premiumSeat', label: 'Premium' },
  { value: 'businessSeat', label: 'Business' },
  { value: 'firstClass', label: 'First Class' },
];

function FlightTable({ 
  selectedFlights = [], 
  selectedFlight, 
  onSelectFlight, 
  onClassChange, 
  promo,
  selectedClasses = {} // Receive selectedClasses as prop
}) {
  const discount = promo?.discount || 0;
  const absolutePricing = promo?.absolutePricing || 0;

  // Function to format duration from minutes
  const formatDuration = (durationMins) => {
    const hours = Math.floor(durationMins / 60);
    const minutes = durationMins % 60;
    return `${hours}h ${minutes}m`;
  };

  // Function to parse time strings into minutes for accurate comparison
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Sort the selectedFlights array by departureTime
  const sortedFlights = [...selectedFlights].sort((a, b) => {
    const timeA = timeToMinutes(a.departureTime);
    const timeB = timeToMinutes(b.departureTime);
    return timeA - timeB;
  });

  // Function to adjust price based on class
  const getPriceForClass = (pricing, flightId, distance, distanceFactor) => {
    const selectedClass = selectedClasses[flightId] || 'economySeat';

    // Define price multipliers for different classes
    const classMultipliers = {
      economySeat: pricing.economyFactor || 1,
      businessSeat: pricing.businessFactor || 1.5,
      premiumSeat: pricing.premiumFactor || 1.2,
      firstClass: pricing.firstClassFactor || 2,
    };

    const multiplier = classMultipliers[selectedClass] || 1;
    const basePrice = pricing.basePrice || 0;
    const price = multiplier * (basePrice + (distance * distanceFactor));

    // Apply promo discounts
    const finalPrice = ((price * (100 - discount)) / 100) + absolutePricing;

    return finalPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="flight-table-container">
      {sortedFlights.length === 0 ? (
        <p>No available flights.</p>
      ) : (
        <table className="flight-table">
          <thead>
            <tr>
              <th>Departure Time</th>
              <th>Arrival Airport</th>
              <th>Duration</th>
              <th>Flight No</th>
              <th>Price & Seats</th>
              <th>Class</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedFlights.map((flight) => {
              // Calculate flight details
              const flightDuration =
                flight.route && flight.route.durationMins
                  ? formatDuration(flight.route.durationMins)
                  : 'N/A';

              const pricing = flight.pricing || {};
              const departureTime = flight.departureTime || 'N/A';
              const arrivalAirport =
                flight.route && flight.route.destination
                  ? flight.route.destination.airportName
                  : 'N/A';
              
              const distance = flight.flight.route.distanceKM || 0;
              const distanceFactor = pricing.distanceFactor || 0;
              const isSelected = selectedFlight === flight;
              const selectedClass = selectedClasses[flight._id] || 'economySeat';
              const displayedPrice = getPriceForClass(pricing, flight._id, distance, distanceFactor);
              const availableSeats = flight.availableSeats?.[selectedClass] || 0;

              return (
                <tr key={flight._id} className={isSelected ? 'selected' : ''}>
                  <td>{departureTime}</td>
                  <td>{arrivalAirport}</td>
                  <td>{flightDuration}</td>
                  <td>{flight.flightNo}</td>
                  <td>
                    PHP {displayedPrice} ({availableSeats > 0 ? `${availableSeats} seats` : 'Sold Out'})
                  </td>
                  <td>
                    <select
                      value={selectedClass}
                      onChange={(e) => {
                        onClassChange(flight._id, e.target.value);
                      }}
                      disabled={!isSelected} // Disable if not selected
                      className={!isSelected ? 'disabled-select' : ''}
                    >
                      {CLASS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <SelectButton
                      isSelected={isSelected}
                      onClick={() => onSelectFlight(flight)}
                      //disabled={availableSeats === 0}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FlightTable;
