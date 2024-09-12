// import React, { useState, useEffect } from "react";
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import '../styles/adminairportdash.css';

// export default function AdminAirportDash() {
//   const [airports, setAirports] = useState([]);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedAirport, setSelectedAirport] = useState(null);
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [columnSearch, setColumnSearch] = useState({
//     airportName: "",
//     airportCode: "",
//     airportCity: "",
//     airportCountry: "",
//   });

//   useEffect(() => {
//     // Fetch data from the API
//     const fetchAirports = async () => {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_URL}/airports/all`);
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setAirports(data);
//         console.log(`Airports: ${data}`);
//       } catch (error) {
//         console.error('There was a problem with the fetch operation:', error);
//       }
//     };

//     fetchAirports();
//   }, []);

//   // Sorting logic
//   const handleSort = (key) => {
//     let direction = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   // Helper function for sorting
//   const getSortedAirports = () => {
//     const sortedAirports = [...airports];
//     if (sortConfig.key) {
//       sortedAirports.sort((a, b) => {
//         const aValue = a[sortConfig.key];
//         const bValue = b[sortConfig.key];
        
//         if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
//         if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
//         return 0;
//       });
//     }
//     return sortedAirports;
//   };

//   // Filter the airports based on search inputs
//   const filteredAirports = getSortedAirports().filter((airport) =>
//     Object.keys(columnSearch).every((key) => {
//       const airportValue = airport[key];
  
//       // Ensure airportValue is a string before applying .toLowerCase()
//       if (airportValue && typeof airportValue === "string") {
//         return airportValue.toLowerCase().includes(columnSearch[key].toLowerCase());
//       }
  
//       // If airportValue is not a string, just return true
//       return true; 
//     })
//   );

//   const paginatedAirports = filteredAirports.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
//   const totalPages = Math.ceil(filteredAirports.length / rowsPerPage);

//   // Handle row click to show modal
//   const handleRowClick = (airport) => {
//     setSelectedAirport(airport);
//     setModalVisible(true);
//   };

//   const handleCloseModal = () => setModalVisible(false);

//   const renderSortArrow = (key) => {
//     if (sortConfig.key !== key) return null;
//     return sortConfig.direction === "ascending" ? "▲" : "▼";
//   };

//   const handleHeaderClick = (key) => {
//     handleSort(key);
//   };

//   // Helper for rendering table headers with sorting and search
//   const renderTableHeader = (label, key) => (
//     <th onClick={() => handleHeaderClick(key)}>
//       {label} {renderSortArrow(key)}
//       <input
//         type="text"
//         value={columnSearch[key] || ""}
//         onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
//         placeholder={`Search ${label}`}
//         className="table-search-input"
//       />
//     </th>
//   );

//   return (
//     <div className="admin-airports-dash">
//       {/* Search Input and Rows per Page */}
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search by airport name, code, city, or country"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <select
//           value={rowsPerPage}
//           onChange={(e) => setRowsPerPage(Number(e.target.value))}
//         >
//           <option value={10}>10</option>
//           <option value={20}>20</option>
//           <option value={50}>50</option>
//           <option value={100}>100</option>
//         </select>
//       </div>

//       {/* Airports Table */}
//       <table>
//         <thead>
//           <tr>
//             {renderTableHeader("AIRPORT NAME", "airportName")}
//             {renderTableHeader("AIRPORT CODE", "airportCode")}
//             {renderTableHeader("CITY", "airportCity")}
//             {renderTableHeader("COUNTRY", "airportCountry")}
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedAirports.length > 0 ? (
//             paginatedAirports.map((airport, index) => (
//               <tr key={index} onClick={() => handleRowClick(airport)}>
//                 <td>{airport.airportName}</td>
//                 <td>{airport.airportCode}</td>
//                 <td>{airport.airportCity}</td>
//                 <td>{airport.airportCountry}</td>
            
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="4">No airports available</td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination Controls */}
//       <div className="pagination-controls">
//         <Button
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//         >
//           Previous
//         </Button>
//         <span>Page {currentPage} of {totalPages}</span>
//         <Button
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//         >
//           Next
//         </Button>
//       </div>

//       {/* Modal for Airport Details */}
//       {selectedAirport && (
//         <Modal show={isModalVisible} onHide={handleCloseModal}>
//           <Modal.Header closeButton>
//             <Modal.Title>Airport Details - {selectedAirport.airportName}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <p><strong>Name:</strong> {selectedAirport.airportName}</p>
//             <p><strong>Code:</strong> {selectedAirport.airportCode}</p>
//             <p><strong>City:</strong> {selectedAirport.airportCity}</p>
//             <p><strong>Country:</strong> {selectedAirport.airportCountry}</p>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleCloseModal}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       )}
//     </div>
//   );
// }

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../styles/adminairportdash.css';
import React, { useState, useEffect } from "react";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';


export default function AdminAirportDash() {
  const notyf = new Notyf({ duration: 3000});
  const [airports, setAirports] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [columnSearch, setColumnSearch] = useState({
    airportName: "",
    airportCode: "",
    airportCity: "",
    airportCountry: "",
  });

  useEffect(() => {
    // Fetch data from the API
    const fetchAirports = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/airports/all`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAirports(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchAirports();
  }, []);

  const toggleIsActive = async (id, isActive) => {
    const action = isActive ? 'archive' : 'activate'; // Determine the API endpoint

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/airports/${action}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(response.message);
      }

      // Update state after successful API call
      setAirports((prevAirports) =>
        prevAirports.map((airport) =>
          airport._id === id ? { ...airport, isActive: !airport.isActive } : airport
        )
      );
    } catch (error) {
      console.error(`There was a problem with the ${action} operation:`, error);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedAirports = () => {
    const sortedAirports = [...airports];
    if (sortConfig.key) {
      sortedAirports.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortedAirports;
  };

  const filteredAirports = getSortedAirports().filter((airport) =>
    Object.keys(columnSearch).every((key) => {
      const airportValue = airport[key];
      if (airportValue && typeof airportValue === "string") {
        return airportValue.toLowerCase().includes(columnSearch[key].toLowerCase());
      }
      return true;
    })
  );

  const paginatedAirports = filteredAirports.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredAirports.length / rowsPerPage);

  const handleRowClick = (airport) => {
    setSelectedAirport(airport);
    setModalVisible(true);
  };

  const handleCloseModal = () => setModalVisible(false);

  const handleHeaderClick = (key) => {
    handleSort(key);
  };

  const renderTableHeader = (label, key) => (
    <th onClick={() => handleHeaderClick(key)}>
      {label}
      <input
        type="text"
        value={columnSearch[key] || ""}
        onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
        placeholder={`Search ${label}`}
        className="table-search-input"
      />
    </th>
  );

  const handleAddAirport = () => {
    // Placeholder function for adding a new airport
    console.log('Add new airport');
    setAddModalVisible(true);
  };

  const handleCloseAddModal = () => setAddModalVisible(false);

  return (
    <div>
      {/* Add Airport Button */}
      <div className="d-flex justify-content-between mb-3">
      <Button variant="primary" onClick={handleAddAirport}>Add Airport</Button>
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
      

      {/* Airports Table */}
      <table>
        <thead>
          <tr>
            {renderTableHeader("AIRPORT NAME", "airportName")}
            {renderTableHeader("AIRPORT CODE", "airportCode")}
            {renderTableHeader("CITY", "airportCity")}
            {renderTableHeader("COUNTRY", "airportCountry")}
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAirports.length > 0 ? (
            paginatedAirports.map((airport) => (
              <tr key={airport._id} onClick={() => handleRowClick(airport)}>
                <td>{airport.airportName}</td>
                <td>{airport.airportCode}</td>
                <td>{airport.airportCity}</td>
                <td>{airport.airportCountry}</td>
                <td>
                  <Button
                    variant={airport.isActive ? "success" : "danger" }
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      toggleIsActive(airport._id, airport.isActive);
                    }}
                  >
                    {airport.isActive ? "Activated" : "Archived"}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No airports available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
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

      {/* Modal for Airport Details */}
      {selectedAirport && (
        <Modal show={isModalVisible} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Airport Details - {selectedAirport.airportName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Name:</strong> {selectedAirport.airportName}</p>
            <p><strong>Code:</strong> {selectedAirport.airportCode}</p>
            <p><strong>City:</strong> {selectedAirport.airportCity}</p>
            <p><strong>Country:</strong> {selectedAirport.airportCountry}</p>
            <p><strong>Status:</strong> {selectedAirport.isActive ? "Active" : "Archived"}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal for Adding New Airport */}
      <Modal show={isAddModalVisible} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Airport</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form for adding a new airport */}
          <p>Form goes here...</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Close
          </Button>
          <Button variant="primary">
            Add Airport
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
