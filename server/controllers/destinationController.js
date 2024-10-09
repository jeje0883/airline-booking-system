const Destination = require('../models/Destination');

// Create a new destination
exports.createDestination = async (req, res) => {
  try {
    console.log('Create Destination Request Body:', req.body); // Log the incoming request body
    const destination = new Destination(req.body);
    await destination.save();
    console.log('Destination Created Successfully:', destination); // Log the newly created destination
    res.status(201).json(destination);
  } catch (error) {
    console.error('Error Creating Destination:', error.message); // Log the error
    res.status(400).json({ message: error.message });
  }
};

// Get all destinations
exports.getAllDestinations = async (req, res) => {
  try {
    console.log('Fetching All Destinations'); // Log when fetching all destinations
    const destinations = await Destination.find();
    console.log('All Destinations Fetched Successfully:', destinations.length, 'destinations found'); // Log the number of destinations found
    res.status(200).json(destinations);
  } catch (error) {
    console.error('Error Fetching All Destinations:', error.message); // Log the error
    res.status(500).json({ message: error.message });
  }
};

// Get a single destination by ID
exports.getDestinationById = async (req, res) => {
  try {
    console.log('Fetching Destination by ID:', req.params.id); // Log the ID of the destination being fetched
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      console.log('Destination Not Found:', req.params.id); // Log when the destination is not found
      return res.status(404).json({ message: 'Destination not found' });
    }
    console.log('Destination Fetched Successfully:', destination); // Log the fetched destination
    res.status(200).json(destination);
  } catch (error) {
    console.error('Error Fetching Destination by ID:', error.message); // Log the error
    res.status(500).json({ message: error.message });
  }
};

// Update a destination by ID
exports.updateDestination = async (req, res) => {
  try {
    console.log('Updating Destination ID:', req.params.id); // Log the ID of the destination being updated
    console.log('Update Data:', req.body); // Log the new data for the update
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true // Validate before updating
    });

    if (!destination) {
      console.log('Destination Not Found for Update:', req.params.id); // Log if the destination is not found
      return res.status(404).json({ message: 'Destination not found' });
    }

    console.log('Destination Updated Successfully:', destination); // Log the updated destination
    res.status(200).json(destination);
  } catch (error) {
    console.error('Error Updating Destination:', error.message); // Log the error
    res.status(400).json({ message: error.message });
  }
};

// Delete a destination by ID
exports.deleteDestination = async (req, res) => {
  try {
    console.log('Deleting Destination ID:', req.params.id); // Log the ID of the destination being deleted
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      console.log('Destination Not Found for Deletion:', req.params.id); // Log if the destination is not found
      return res.status(404).json({ message: 'Destination not found' });
    }
    console.log('Destination Deleted Successfully:', destination); // Log the deleted destination
    res.status(200).json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Error Deleting Destination:', error.message); // Log the error
    res.status(500).json({ message: error.message });
  }
};

// Activate a destination by ID
exports.activateDestination = async (req, res) => {
  try {
    console.log('Activating Destination ID:', req.params.id); // Log the ID of the destination being activated
    const destination = await Destination.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!destination) {
      console.log('Destination Not Found for Activation:', req.params.id); // Log if the destination is not found
      return res.status(404).json({ message: 'Destination not found' });
    }
    console.log('Destination Activated Successfully:', destination); // Log the activated destination
    res.status(200).json({ message: 'Destination activated successfully', destination });
  } catch (error) {
    console.error('Error Activating Destination:', error.message); // Log the error
    res.status(400).json({ message: error.message });
  }
};

// Archive a destination by ID (set isActive to false)
exports.archiveDestination = async (req, res) => {
  try {
    console.log('Archiving Destination ID:', req.params.id); // Log the ID of the destination being archived
    const destination = await Destination.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!destination) {
      console.log('Destination Not Found for Archiving:', req.params.id); // Log if the destination is not found
      return res.status(404).json({ message: 'Destination not found' });
    }
    console.log('Destination Archived Successfully:', destination); // Log the archived destination
    res.status(200).json({ message: 'Destination archived successfully', destination });
  } catch (error) {
    console.error('Error Archiving Destination:', error.message); // Log the error
    res.status(400).json({ message: error.message });
  }
};
