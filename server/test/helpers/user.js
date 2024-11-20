// helpers/userHelper.js

const chai = require('chai');
const http = require('chai-http');
const { app, mongoose } = require("../../index");
const User = require('../../models/User');

chai.use(http);



// Helper function to log in and get the user token
const getToken = async (email, password) => { 
    // console.log(`Attempting to log in user with email: ${email}`);
    try {
        const res = await chai.request(app)
            .post('/users/login')
            .type('json')
            .send({
                email: email,
                password: password
            });
        
        if (res.status !== 200) {
            throw new Error(`Login failed with status ${res.status}`);
        }

        if (!res.body.access) {
            throw new Error('Access token not found in response.');
        }

        return res.body.access; 
    } catch (err) {
        throw err;
    }
};

// Helper function to add/register a user
const addUser = async (userData) => {
    // console.log( `Attempting to register user with email: ${userData.email}`);
    try {
        const res = await chai.request(app)
            .post('/users/register')
            .type('json')
            .send(userData);


        if (res.status !== 201 && res.status !== 200) { 
            throw new Error(`Registration failed with status ${res.status}`);
        }

        if (res.body.message === 'Registered Successfully') {
            const user = await User.findOne({ email: userData.email });
            if (!user) {
                throw new Error('User not found after registration.');
            }
            return { message: res.body.message, user };
        }

        return res.body;
    } catch (err) {
        throw err;
    }
};

// Helper function to delete a user
const deleteUser = async (userId, adminToken) => {
    // console.log( `Attempting to delete user with ID: ${userId}`);
    if (adminToken) {
        const truncatedToken = adminToken.length > 30 ? `${adminToken.substring(0, 30)}...` : adminToken;
    } else {
    }
    try {
        const res = await chai.request(app)
            .delete(`/users/delete/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        

        if (res.status !== 200 && res.status !== 204) { 
            throw new Error(`Deletion failed with status ${res.status}`);
        }

        return res.body;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getToken,
    addUser,
    deleteUser
};
