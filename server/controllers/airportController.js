const Airport = require('../models/Airport'); // Adjust the path according to your project structure

// Controller for Airport Operations
const AirportController = {

  // Add a new Airport
  async addAirport(req, res) {
    console.log('addAirport called with req.body:', req.body);
    try {
      const { airportName, airportCode, airportCity, airportCountry } = req.body;
      console.log('Extracted variables:', { airportName, airportCode, airportCity, airportCountry });

      const newAirport = new Airport({
        airportName,
        airportCode,
        airportCity,
        airportCountry
      });
      console.log('New Airport instance created:', newAirport);

      const savedAirport = await newAirport.save();
      console.log('Saved Airport to database:', savedAirport);
      res.status(201).json(savedAirport);
    } catch (error) {
      console.error('Error adding Airport:', error);
      res.status(500).json({ message: 'Error adding Airport', error });
    }
  },

  // Edit an existing Airport by _id
  async editAirport(req, res) {
    console.log('editAirport called with id:', req.params.id, 'and updates:', req.body);
    try {
      const { id } = req.params; // Use _id
      const updates = req.body;

      const updatedAirport = await Airport.findByIdAndUpdate(id, updates, { new: true });
      console.log('Updated Airport:', updatedAirport);

      if (!updatedAirport) {
        console.log('Airport not found with id:', id);
        return res.status(404).json({ message: 'Airport not found' });
      }
      res.status(200).json(updatedAirport);
    } catch (error) {
      console.error('Error editing Airport:', error);
      res.status(500).json({ message: 'Error editing Airport', error });
    }
  },

  // Archive an Airport by _id (soft delete, using an `isActive` flag)
  async archiveAirport(req, res) {
    console.log('archiveAirport called with id:', req.params.id);
    try {
      const { id } = req.params; // Use _id
      const updatedAirport = await Airport.findByIdAndUpdate(
        id,
        { isActive: false }, // Set the Airport as inactive
        { new: true }
      );
      console.log('Archived Airport:', updatedAirport);

      if (!updatedAirport) {
        console.log('Airport not found with id:', id);
        return res.status(404).json({ message: 'Airport not found' });
      }
      res.status(200).json({ message: 'Airport archived successfully', updatedAirport });
    } catch (error) {
      console.error('Error archiving Airport:', error);
      res.status(500).json({ message: 'Error archiving Airport', error });
    }
  },

  // Activate an Airport by _id (set `isActive` flag to true)
  async activateAirport(req, res) {
    console.log('activateAirport called with id:', req.params.id);
    try {
      const { id } = req.params; // Use _id
      const updatedAirport = await Airport.findByIdAndUpdate(
        id,
        { isActive: true }, // Set the Airport as active
        { new: true }
      );
      console.log('Activated Airport:', updatedAirport);

      if (!updatedAirport) {
        console.log('Airport not found with id:', id);
        return res.status(404).json({ message: 'Airport not found' });
      }
      res.status(200).json({ message: 'Airport activated successfully', updatedAirport });
    } catch (error) {
      console.error('Error activating Airport:', error);
      res.status(500).json({ message: 'Error activating Airport', error });
    }
  },

  // View all Airports
  async viewAllAirports(req, res) {
    console.log('Fetching all Airports...');
    try {
      // Query the database and log the raw result
      const airports = await Airport.find({});
      console.log('Retrieved Airports:', airports);

      if (!airports || airports.length === 0) {
        console.log('No Airports found');
        return res.status(404).json({ message: 'No Airports found' });
      }

      res.status(200).json(airports);
    } catch (error) {
      console.error('Error fetching Airports:', error);
      res.status(500).json({ message: 'Error fetching Airports', error });
    }
  },

  // Get Airport details by _id
  async getAirportDetails(req, res) {
    console.log('getAirportDetails called with id:', req.params.id);
    try {
      const { id } = req.params; // Use _id

      const airport = await Airport.findById(id);
      console.log('Retrieved Airport details:', airport);

      if (!airport) {
        console.log('Airport not found with id:', id);
        return res.status(404).json({ message: 'Airport not found' });
      }
      res.status(200).json(airport);
    } catch (error) {
      console.error('Error fetching airport details:', error);
      res.status(500).json({ message: 'Error fetching airport details', error });
    }
  }

};

module.exports = AirportController;
