const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// POST /api/destinations - Create a new destination
router.post('/', destinationController.createDestination);

// GET /api/destinations - Get all destinations
router.get('/all', destinationController.getAllDestinations);

// GET /api/destinations/:id - Get a destination by ID
router.get('/:id', destinationController.getDestinationById);

// PUT /api/destinations/:id - Update a destination by ID
router.patch('/:id', destinationController.updateDestination);

// DELETE /api/destinations/:id - Delete a destination by ID
router.delete('/:id', destinationController.deleteDestination);

// PATCH /api/destinations/:id/activate - Activate a destination by ID
router.patch('/:id/activate', destinationController.activateDestination);

// PATCH /api/destinations/:id/archive - Archive a destination by ID (set isActive to false)
router.patch('/:id/archive', destinationController.archiveDestination);

module.exports = router;
