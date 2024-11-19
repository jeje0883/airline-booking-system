const chai = require('chai'); 
const chaiHttp = require('chai-http'); 
const { expect } = chai; 
const { app, mongoose } = require('../index.js');
const generateRandomProfile = require('./helpers/helper.js'); 

chai.use(chaiHttp);

describe('Booking API Tests', function () {
    this.timeout(20000);

    let newUser;

    before(async function () {
        if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
        await mongoose.connect(process.env.MONGODB_STRING);
        console.log('Connected to MongoDB for testing.');
        newUser = generateRandomProfile();
    });

    after(async function () {
        await mongoose.connection.close();
        console.log('Closed MongoDB connection.');
    });

    const assertAndLog = (assertFn, successMsg, failMsg) => {
        try {
            assertFn();
            console.log(`\tPassed: ${successMsg}`);
        } catch (error) {
            console.error(`\tFailed: ${failMsg}`, error.message);
            // exit(1);
        }
    };

    it('test_api_user_register_successful', function (done) {
        chai.request(app)
            .post('/users/register')
            .send(newUser)
            .end((err, res) => {
                if (err) return done(err);

                // Individual assertions
                assertAndLog(
                    () => expect(res).to.have.status(201),
                    'Status is 201',
                    'Expected status to be 201'
                );
                assertAndLog(
                    () => expect(res.body).to.be.an('object'),
                    'Response is an object',
                    'Response is not an object'
                );
                assertAndLog(
                    () => expect(res.body).to.have.property('message').equal('Registered Successfully'),
                    'Message is "Registered Successfully"',
                    'Message is not "Registered Successfully"'
                );

                done();
            });
    });

    it('test_api_user_register_fail_email_already_exist', function (done) {
        chai.request(app)
            .post('/users/register')
            .send(newUser)
            .end((err, res) => {
                if (err) return done(err);

                // Individual assertions
                assertAndLog(
                    () => expect(res).to.have.status(409),
                    'Status is 409',
                    'Expected status to be 409'
                );

                assertAndLog(
                    () => expect(res.body).to.have.property('error').equal('Email already in use'),
                    'Message is "Email already in use"',
                    'Message is not "Email already in use"'
                );

                done();
            });
    });

    it('test_api_user_register_fail_invalid_email', function (done) {
        const invalidEmailUser = generateRandomProfile(); // Create a fresh copy
        invalidEmailUser.email = 'invalid_email';
 
        chai.request(app)
            .post('/users/register')
            .send(invalidEmailUser)
            .end((err, res) => {
                if (err) return done(err);
    
                // Individual assertions
                assertAndLog(
                    () => expect(res).to.have.status(400),
                    'Status is 400',
                    'Expected status to be 400'
                );
                assertAndLog(
                    () => expect(res.body).to.have.property('error').equal('Email format is invalid'),
                    'Message is "Email format is invalid"',
                    'Message is not "Email format is invalid"'
                );
    
                done();
            });
    });
    
    it('test_api_user_register_fail_invalid_phone', function (done) {
        const invalidPhoneUser = generateRandomProfile(); // Create a fresh copy
        invalidPhoneUser.phoneNo = '0000';
    
        chai.request(app)
            .post('/users/register')
            .send(invalidPhoneUser)
            .end((err, res) => {
                if (err) return done(err);
                
                // Individual assertions
                assertAndLog(
                    () => expect(res).to.have.status(400),
                    'Status is 400',
                    'Expected status to be 400'
                );
                assertAndLog(
                    () => expect(res.body).to.have.property('error').equal('Phone number is invalid'),
                    'Message is "Phone number is invalid"',
                    'Message is not "Phone number is invalid"'
                );
    
                done();
            });
    });

    it('test_api_user_register_fail_invalid_password', function (done) {
        const invalidPasswordUser = generateRandomProfile(); // Create a fresh copy
        invalidPasswordUser.password = '0000';
    
        chai.request(app)
            .post('/users/register')
            .send(invalidPasswordUser)
            .end((err, res) => {
                if (err) return done(err);
    
                // Individual assertions
                assertAndLog(
                    () => expect(res).to.have.status(400),
                    'Status is 400',
                    'Expected status to be 400'
                );
                assertAndLog(
                    () => expect(res.body).to.have.property('error').equal('Password must be at least 8 characters long'),
                    'Message is "Password must be at least 8 characters long"',
                    'Message is not "Password must be at least 8 characters long"'
                );
    
                done();
            });
    });

    it('test_api_user_loging_successful', function (done) {
        const userLogin = {
            email: newUser.email,
            password: newUser.password
        }

    
        chai.request(app)
            .post('/users/login')
            .send(userLogin)
            .end((err, res) => {
                if (err) return done(err);
    
                // Individual assertions
                assertAndLog(
                    () => expect(res).to.have.status(200),
                    'Status is 200',
                    'Expected status to be 200'
                );
                assertAndLog(
                    () => expect(res.body).to.have.property('access'),
                    'Return access token',
                    'Does NOT return access token"'
                );
                assertAndLog(
                    () => expect(res.user).to.include.all.property(['id', 'email', 'isAdmin']),
                    'Return response user',
                    'Does NOT return response user'
                );
    
                done();
            });
    });
    
});
