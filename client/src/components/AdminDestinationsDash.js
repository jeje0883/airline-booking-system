import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function AdminDestinationDash() {
  const notyf = new Notyf({ duration: 3000 });
  const [destinations, setDestinations] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [columnSearch, setColumnSearch] = useState({
    destination: "",
    rating: "",
    isActive: "",
  });
  const [newDestination, setNewDestination] = useState({
    destination: "",
    rating: 0,
    photoUrl1: "",
    photoUrl2: "",
    title: "", // New field
    p1: "",
    p2: "",
    p3: "",
    isActive: true
  });
  const [editDestination, setEditDestination] = useState(null); // New state for editable destination

  // Loading states
  const [loadingData, setLoadingData] = useState(true); // For initial data fetching
  const [addingDestination, setAddingDestination] = useState(false); // For adding a destination
  const [updatingDestinationId, setUpdatingDestinationId] = useState(null); // For updating a destination
  const [togglingDestinationId, setTogglingDestinationId] = useState(null); // For toggling active status

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoadingData(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/destinations/all`);
        if (!response.ok) {
          throw new Error(`Error fetching destinations: ${response.statusText}`);
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(data);
          notyf.success("Destinations fetched successfully.");
        } else {
          setDestinations([]);
          notyf.error("No destinations found.");
        }
      } catch (error) {
        notyf.error('There was a problem fetching destinations.');
        console.error('Fetch Error:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDestinations();
  }, []);

  // TOGGLE ACTIVE STATUS
  const toggleIsActive = async (id, isActive) => {
    setTogglingDestinationId(id); // Set the ID of the destination being toggled
    const action = isActive ? 'archive' : 'activate';

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/destinations/${id}/${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setDestinations((prevDestinations) =>
          prevDestinations.map((destination) =>
            destination._id === id ? { ...destination, isActive: !destination.isActive } : destination
          )
        );
        notyf.success(`Destination ${isActive ? 'archived' : 'activated'} successfully.`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} the destination.`);
      }
    } catch (error) {
      notyf.error(`Error: ${error.message}`);
      console.error(`Toggle Status Error:`, error);
    } finally {
      setTogglingDestinationId(null); // Reset toggling state
    }
  };

  // HANDLE SORTING
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // GET SORTED DESTINATIONS
  const getSortedDestinations = () => {
    const sortedDestinations = Array.isArray(destinations) ? [...destinations] : [];
    if (sortConfig.key) {
      sortedDestinations.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortedDestinations;
  };

  // FILTERED DESTINATIONS BASED ON SEARCH
  const filteredDestinations = getSortedDestinations().filter((destination) =>
    Object.keys(columnSearch).every((key) => {
      const destinationValue = destination[key];
      const searchValue = columnSearch[key];

      if (searchValue === "") {
        return true; // If search input is empty, return all results
      }

      // Handle string searches (text)
      if (typeof destinationValue === "string") {
        return destinationValue.toLowerCase().includes(searchValue.toLowerCase());
      }

      // Handle number searches
      if (typeof destinationValue === "number") {
        return destinationValue === Number(searchValue); // Ensure both are numbers for comparison
      }

      // Handle boolean searches
      if (typeof destinationValue === "boolean") {
        return destinationValue === (searchValue === "true");
      }

      return true; // Default return for unmatched cases
    })
  );

  // PAGINATED DESTINATIONS
  const paginatedDestinations = filteredDestinations.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredDestinations.length / rowsPerPage);

  // HANDLE ROW CLICK TO SHOW DETAILS
  const handleRowClick = (destination) => {
    setSelectedDestination(destination);
    setIsEditing(false); // Ensure modal is in view mode
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsEditing(false);
    setEditDestination(null);
  };

  // RENDER TABLE HEADER WITH SORTING
  const renderTableHeader = (label, key) => (
    <th onClick={() => handleSort(key)} style={{ cursor: "pointer" }}>
      {label} {sortConfig.key === key ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
    </th>
  );

  // RENDER TABLE SEARCH INPUTS
  const renderTableSearch = (key, type) => (
    <td>
      {type === 'number' ? (
        <input
          type="number"
          value={columnSearch[key] || ""}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          placeholder={`Search ${key}`}
          className="table-search-input form-control"
        />
      ) : type === 'boolean' ? (
        <select
          value={columnSearch[key] || ""}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          className="table-search-input form-select"
        >
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Archived</option>
        </select>
      ) : (
        <input
          type="text"
          value={columnSearch[key] || ""}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          placeholder={`Search ${key}`}
          className="table-search-input form-control"
        />
      )}
    </td>
  );

  // CLEAR ALL SEARCH FILTERS
  const handleClearSearch = () => {
    setColumnSearch({
      destination: "",
      rating: "",
      isActive: "",
    });
    notyf.success("Search filters cleared.");
  };

  // CLOSE ADD MODAL
  const handleCloseAddModal = () => {
    setAddModalVisible(false);
  };

  // HANDLE ADD DESTINATION FORM SUBMISSION
  const handleAddDestination = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setAddingDestination(true); // Start adding destination

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/destinations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newDestination), // Send the form data
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to add new destination: ${response.status} ${responseData.message}`);
      }

      setDestinations((prevDestinations) => [...prevDestinations, responseData]);
      setAddModalVisible(false); // Close the modal after adding the destination
      setNewDestination({
        destination: "",
        rating: 0,
        photoUrl1: "",
        photoUrl2: "",
        title: "", // Reset new field
        p1: "",
        p2: "",
        p3: "",
        isActive: true
      }); // Reset form
      notyf.success('Destination added successfully.');
    } catch (error) {
      notyf.error(`Error adding destination: ${error.message}`);
      console.error('Add Destination Error:', error);
    } finally {
      setAddingDestination(false); // Stop adding destination
    }
  };

  // HANDLE INPUT CHANGE IN ADD FORM
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDestination((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  // HANDLE INPUT CHANGE IN EDIT FORM
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDestination((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  // HANDLE EDIT BUTTON CLICK
  const handleEditClick = () => {
    setIsEditing(true);
    setEditDestination({ ...selectedDestination });
  };

  // HANDLE CANCEL EDIT
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditDestination(null);
  };

  // HANDLE SAVE EDIT
  const handleEditSave = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (!editDestination) return;

    setUpdatingDestinationId(editDestination._id); // Start updating

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/destinations/${editDestination._id}`, {
        method: 'PATCH', // Assuming PATCH for partial updates
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editDestination),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to update destination: ${response.status} ${responseData.message}`);
      }

      // Update destinations state
      setDestinations((prevDestinations) =>
        prevDestinations.map((destination) =>
          destination._id === editDestination._id ? responseData : destination
        )
      );

      // Update selectedDestination and reset edit states
      setSelectedDestination(responseData);
      setIsEditing(false);
      setEditDestination(null);
      notyf.success('Destination updated successfully.');
    } catch (error) {
      notyf.error(`Error updating destination: ${error.message}`);
      console.error('Update Destination Error:', error);
    } finally {
      setUpdatingDestinationId(null); // Stop updating
    }
  };

  return (
    <div className="dash-container">
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <div>
          <Button 
            variant="primary" 
            onClick={() => setAddModalVisible(true)}
            disabled={loadingData} // Disable if data is loading
          >
            {loadingData ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                /> Loading...
              </>
            ) : (
              "Add Destination"
            )}
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleClearSearch} 
            className="ms-2"
            disabled={loadingData} // Disable if data is loading
          >
            Clear Search
          </Button>
        </div>
        <div>
          <select
            className='form-select'
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Loading Spinner for Data Fetching */}
      {loadingData ? (
        <div className="d-flex justify-content-center my-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <table className="table table-hover"> 
          <thead>
            {/* Sorting Header Row */}
            <tr>
              {renderTableHeader("Destination", "destination")}
              {renderTableHeader("Rating", "rating")}
              {renderTableHeader("Photo URL 1", "photoUrl1")}
              {renderTableHeader("Photo URL 2", "photoUrl2")}
              {renderTableHeader("Title", "title")} {/* New Header */}
              {renderTableHeader("Description 1", "p1")}
              {renderTableHeader("Description 2", "p2")}
              {renderTableHeader("Description 3", "p3")}
              {renderTableHeader("Status", "isActive")}
            </tr>
            {/* Search Row */}
            <tr>
              {renderTableSearch("destination", "text")}
              {renderTableSearch("rating", "number")}
              {renderTableSearch("photoUrl1", "text")}
              {renderTableSearch("photoUrl2", "text")}
              {renderTableSearch("title", "text")} {/* New Search */}
              {renderTableSearch("p1", "text")}
              {renderTableSearch("p2", "text")}
              {renderTableSearch("p3", "text")}
              {renderTableSearch("isActive", "boolean")}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(paginatedDestinations) && paginatedDestinations.length > 0 ? (
              paginatedDestinations.map((destination) => (
                <tr key={destination._id} onClick={() => handleRowClick(destination)} style={{ cursor: "pointer" }}>
                  <td>{destination.destination || 'N/A'}</td>
                  <td>{destination.rating !== undefined ? destination.rating : 'N/A'}</td>
                  <td>
                    {destination.photoUrl1 ? (
                      <a href={destination.photoUrl1} target="_blank" rel="noopener noreferrer">View</a>
                    ) : 'N/A'}
                  </td>
                  <td>
                    {destination.photoUrl2 ? (
                      <a href={destination.photoUrl2} target="_blank" rel="noopener noreferrer">View</a>
                    ) : 'N/A'}
                  </td>
                  <td>{destination.title || 'N/A'}</td> {/* New Field */}
                  <td>{destination.p1 || 'N/A'}</td>
                  <td>{destination.p2 || 'N/A'}</td>
                  <td>{destination.p3 || 'N/A'}</td>
                  <td>
                    <Button
                      className="action-button"
                      variant={destination.isActive ? "success" : "danger"}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event
                        toggleIsActive(destination._id, destination.isActive);
                      }}
                      disabled={togglingDestinationId === destination._id} // Disable if this destination is being toggled
                    >
                      {togglingDestinationId === destination._id ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        destination.isActive ? "Active" : "Archived"
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No destinations available</td> {/* Updated colspan */}
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      {!loadingData && Array.isArray(filteredDestinations) && filteredDestinations.length > 0 && (
        <div className="d-flex justify-content-between align-items-center">
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

      {/* MODAL FOR DETAILS / EDIT */}
      {selectedDestination && (
        <Modal show={isModalVisible} onHide={handleCloseModal} className="modal-details" size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? "Edit Destination" : "Destination Details"}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-details-body">
            {isEditing ? (
              // Edit Mode: Display Editable Form
              <form onSubmit={handleEditSave}>
                {/* Destination Name */}
                <div className="mb-3">
                  <label htmlFor="destination" className="form-label">Destination</label>
                  <input
                    type="text"
                    className="form-control"
                    id="destination"
                    name="destination"
                    value={editDestination.destination}
                    onChange={handleEditChange}
                    required
                    placeholder="Enter destination name"
                  />
                </div>

                {/* Rating */}
                <div className="mb-3">
                  <label htmlFor="rating" className="form-label">Rating</label>
                  <input
                    type="number"
                    className="form-control"
                    id="rating"
                    name="rating"
                    value={editDestination.rating}
                    onChange={handleEditChange}
                    required
                    placeholder="Enter rating (0-5)"
                    min="0"
                    max="5"
                  />
                </div>

                {/* Photo URL 1 */}
                <div className="mb-3">
                  <label htmlFor="photoUrl1" className="form-label">Photo URL 1</label>
                  <input
                    type="url"
                    className="form-control"
                    id="photoUrl1"
                    name="photoUrl1"
                    value={editDestination.photoUrl1}
                    onChange={handleEditChange}
                    required
                    placeholder="Enter first photo URL"
                  />
                </div>

                {/* Photo URL 2 */}
                <div className="mb-3">
                  <label htmlFor="photoUrl2" className="form-label">Photo URL 2</label>
                  <input
                    type="url"
                    className="form-control"
                    id="photoUrl2"
                    name="photoUrl2"
                    value={editDestination.photoUrl2}
                    onChange={handleEditChange}
                    required
                    placeholder="Enter second photo URL"
                  />
                </div>

                {/* Title */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={editDestination.title}
                    onChange={handleEditChange}
                    required
                    placeholder="Enter title"
                  />
                </div>

                {/* Description Paragraph 1 */}
                <div className="mb-3">
                  <label htmlFor="p1" className="form-label">Description Paragraph 1</label>
                  <textarea
                    className="form-control"
                    id="p1"
                    name="p1"
                    value={editDestination.p1}
                    onChange={handleEditChange}
                    required
                    placeholder="Enter first paragraph of description"
                  />
                </div>

                {/* Description Paragraph 2 */}
                <div className="mb-3">
                  <label htmlFor="p2" className="form-label">Description Paragraph 2</label>
                  <textarea
                    className="form-control"
                    id="p2"
                    name="p2"
                    value={editDestination.p2}
                    onChange={handleEditChange}
                    placeholder="Enter second paragraph of description (optional)"
                  />
                </div>

                {/* Description Paragraph 3 */}
                <div className="mb-3">
                  <label htmlFor="p3" className="form-label">Description Paragraph 3</label>
                  <textarea
                    className="form-control"
                    id="p3"
                    name="p3"
                    value={editDestination.p3}
                    onChange={handleEditChange}
                    placeholder="Enter third paragraph of description (optional)"
                  />
                </div>

                {/* Status (isActive) */}
                <div className="mb-3">
                  <label htmlFor="isActive" className="form-label">Status</label>
                  <select
                    className="form-select"
                    id="isActive"
                    name="isActive"
                    value={editDestination.isActive ? "true" : "false"}
                    onChange={(e) => setEditDestination({ ...editDestination, isActive: e.target.value === "true" })}
                    required
                  >
                    <option value="true">Active</option>
                    <option value="false">Archived</option>
                  </select>
                </div>

                {/* Display createdAt and updatedAt as read-only */}
                <div className="mb-3">
                  <label className="form-label">Created:</label>
                  <p>{selectedDestination.createdAt ? new Date(selectedDestination.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Last Update:</label>
                  <p>{selectedDestination.updatedAt ? new Date(selectedDestination.updatedAt).toLocaleString() : 'N/A'}</p>
                </div>

                {/* Modal Footer with Save and Cancel */}
                <Modal.Footer>

                  <Button type="submit" variant="primary" disabled={updatingDestinationId === editDestination._id}>
                    {updatingDestinationId === editDestination._id ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        /> Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button variant="secondary" onClick={handleEditCancel}>
                    Cancel
                  </Button>
                </Modal.Footer>
              </form>
            ) : (
              // View Mode: Display Details
              <>
                <p><strong>Destination:</strong> {selectedDestination.destination || 'N/A'}</p>
                <p><strong>Rating:</strong> {selectedDestination.rating !== undefined ? selectedDestination.rating : 'N/A'}</p>
                <p><strong>Photo URL 1:</strong> {selectedDestination.photoUrl1 ? <a href={selectedDestination.photoUrl1} target="_blank" rel="noopener noreferrer">View</a> : 'N/A'}</p>
                <p><strong>Photo URL 2:</strong> {selectedDestination.photoUrl2 ? <a href={selectedDestination.photoUrl2} target="_blank" rel="noopener noreferrer">View</a> : 'N/A'}</p>
                <p><strong>Title:</strong> {selectedDestination.title || 'N/A'}</p> {/* New Field */}
                <p><strong>Description Paragraph 1:</strong> {selectedDestination.p1 || 'N/A'}</p>
                <p><strong>Description Paragraph 2:</strong> {selectedDestination.p2 || 'N/A'}</p>
                <p><strong>Description Paragraph 3:</strong> {selectedDestination.p3 || 'N/A'}</p>
                <p><strong>Status:</strong> {selectedDestination.isActive ? "Active" : "Archived"}</p>
                <p><strong>Created:</strong> {selectedDestination.createdAt ? new Date(selectedDestination.createdAt).toLocaleString() : 'N/A'}</p>
                <p><strong>Last Update:</strong> {selectedDestination.updatedAt ? new Date(selectedDestination.updatedAt).toLocaleString() : 'N/A'}</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            {isEditing ? null : (
              <>

                <Button variant="primary" onClick={handleEditClick}>
                  Edit
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      )}

      {/* MODAL FOR ADD DESTINATION */}
      <Modal show={isAddModalVisible} onHide={handleCloseAddModal} className="modal-add" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Destination</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-add-body">
          <form onSubmit={handleAddDestination}>
            {/* Destination Name */}
            <div className="mb-3">
              <label htmlFor="destination" className="form-label">Destination</label>
              <input
                type="text"
                className="form-control"
                id="destination"
                name="destination"
                value={newDestination.destination}
                onChange={handleInputChange}
                required
                placeholder="Enter destination name"
              />
            </div>

            {/* Rating */}
            <div className="mb-3">
              <label htmlFor="rating" className="form-label">Rating</label>
              <input
                type="number"
                className="form-control"
                id="rating"
                name="rating"
                value={newDestination.rating}
                onChange={handleInputChange}
                required
                placeholder="Enter rating (0-5)"
                min="0"
                max="5"
              />
            </div>

            {/* Photo URL 1 */}
            <div className="mb-3">
              <label htmlFor="photoUrl1" className="form-label">Photo URL 1</label>
              <input
                type="url"
                className="form-control"
                id="photoUrl1"
                name="photoUrl1"
                value={newDestination.photoUrl1}
                onChange={handleInputChange}
                required
                placeholder="Enter first photo URL"
              />
            </div>

            {/* Photo URL 2 */}
            <div className="mb-3">
              <label htmlFor="photoUrl2" className="form-label">Photo URL 2</label>
              <input
                type="url"
                className="form-control"
                id="photoUrl2"
                name="photoUrl2"
                value={newDestination.photoUrl2}
                onChange={handleInputChange}
                required
                placeholder="Enter second photo URL"
              />
            </div>

            {/* Title */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={newDestination.title}
                onChange={handleInputChange}
                required
                placeholder="Enter title"
              />
            </div>

            {/* Description Paragraph 1 */}
            <div className="mb-3">
              <label htmlFor="p1" className="form-label">Description Paragraph 1</label>
              <textarea
                className="form-control"
                id="p1"
                name="p1"
                value={newDestination.p1}
                onChange={handleInputChange}
                required
                placeholder="Enter first paragraph of description"
              />
            </div>

            {/* Description Paragraph 2 */}
            <div className="mb-3">
              <label htmlFor="p2" className="form-label">Description Paragraph 2</label>
              <textarea
                className="form-control"
                id="p2"
                name="p2"
                value={newDestination.p2}
                onChange={handleInputChange}
                placeholder="Enter second paragraph of description (optional)"
              />
            </div>

            {/* Description Paragraph 3 */}
            <div className="mb-3">
              <label htmlFor="p3" className="form-label">Description Paragraph 3</label>
              <textarea
                className="form-control"
                id="p3"
                name="p3"
                value={newDestination.p3}
                onChange={handleInputChange}
                placeholder="Enter third paragraph of description (optional)"
              />
            </div>

            {/* Status (isActive) */}
            <div className="mb-3">
              <label htmlFor="isActive" className="form-label">Status</label>
              <select
                className="form-select"
                id="isActive"
                name="isActive"
                value={newDestination.isActive ? "true" : "false"}
                onChange={(e) => setNewDestination({ ...newDestination, isActive: e.target.value === "true" })}
                required
              >
                <option value="true">Active</option>
                <option value="false">Archived</option>
              </select>
            </div>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAddModal}>
                Close
              </Button>
              <Button type="submit" variant="primary" disabled={addingDestination}>
                {addingDestination ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    /> Adding...
                  </>
                ) : (
                  "Add Destination"
                )}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
