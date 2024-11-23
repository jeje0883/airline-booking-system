const chai = require('chai'); 
const chaiHttp = require('chai-http'); 
const { expect } = chai; 
const { app, mongoose } = require('../index.js');
const generateRandomProfile = require('./helpers/helper.js'); 
const { getToken, deleteUser } = require('./helpers/user');

chai.use(chaiHttp);

const log = true; //flag for verbose logging of individual test to console

describe('Booking API Tests', function () {
    this.timeout(20000);

    let adminToken, userToken, newUser, newUserId;


    before(async function () {
        if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
        await mongoose.connect(process.env.MONGODB_STRING);
        await mongoose.connection.once("open", () => console.log(`Now connected to MongoDB Atlas in Mocha Test`));
        newUser = generateRandomProfile();
        adminToken = await getToken('admin@mail.com', 'admin123');
        // console.log(adminToken);

    });

    after(async function () {
        await mongoose.connection.close();
        console.log('Closed MongoDB connection.');
    });

    const assertAndLog = (assertFn, successMsg, failMsg) => {
        try {
            assertFn();
            if (log) console.log(`\tPassed: ${successMsg}`) ;
        } catch (error) {
            if (log) console.error(`\tFailed: ${failMsg}`, error.message);
            if (!log) exit(1);
        }
    };

    it('test_api_user_register_successful', function (done) {
        chai.request(app)
            .post('/users/register')
            .send(newUser)
            .end((err, res) => {
                if (err) return done(err);

                // console.log(res.body.user);
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
                assertAndLog(
                    () => expect(res.body).to.have.property('user'),
                    'Response has user details',
                    'Response no has user details'
                );

                assertAndLog(
                    () => expect(res.body.user).to.include.all.keys(['firstName', 'lastName', 'email', 'phoneNo']),
                    'Response user details has all the properties',
                    'Response user details does not have all the properties'
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
        const invalidEmailUser = { ...newUser}; // Create a fresh copy
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
        const invalidPhoneUser = {...newUser}; // Create a fresh copy
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
        const invalidPasswordUser = {...newUser}; // Create a fresh copy
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

    it('test_api_user_login_successful', function (done) {
        const user = { ...newUser};

        chai.request(app)
            .post('/users/login')
            .send({
                email: user.email,
                password: user.password
            })
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
                    'Returns access token',
                    'Does NOT return access token"'
                );

                userToken = res.body['access'];
                done();
            });
    });

    it('test_api_user_login_fail_invalid_email', function (done) {
        const user = { ...newUser };

        chai.request(app)
            .post('/users/login')
            .send({
                email: 'invalid_email',
                password: user.password
            })
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
                    'Error is "Email format is invalid"',
                    'Error is not "Email format is invalid"',
                );
    
                done();
            });
    });

    it('test_api_user_login_fail_invalid_password', function (done) {
        const user = { ...newUser };

        chai.request(app)
            .post('/users/login')
            .send({
                email: user.email,
                password: 'invalid_password'
            })
            .end((err, res) => {
                if (err) return done(err);
    
                // Individual assertions
                assertAndLog(
                    () => expect(res).to.have.status(401),
                    'Status is 401',
                    'Expected status to be 401'
                );
                assertAndLog(
                    () => expect(res.body).to.have.property('error').equal('Email and password do not match'),
                    'Error is "Email and password do not match"',
                    'Error is not "Email and password do not match"',
                );
    
                done();
            });
    });

    // it('test_api_user_login_fail_no_user_found', function (done) {
    //     let user = { ... newUser };

    //     chai.request(app)
    //         .post('/users/login')
    //         .send(user)
    //         .end((err, res) => {
    //             if (err) return done(err);
    
    //             // Individual assertions
    //             assertAndLog(
    //                 () => expect(res).to.have.status(404),
    //                 'Status is 404',
    //                 'Expected status to be 404'
    //             );
    //             assertAndLog(
    //                 () => expect(res.body).to.have.property('error').equal('No email found'),
    //                 'Error is "No email found"',
    //                 'Error is not "No email found"',
    //             );
    
    //             done();
    //         });
    // });

    it('test_api_user_details_success', function (done) {
        const user = { ...newUser}

        chai.request(app)
            .get('/users/details')
            .send(user)
            .type('json')
            .set('authorization' ,`Bearer ${userToken}`)
            .end((err, res) => {
                if (err) return done(err);
    
                // Individual assertions
                assertAndLog(
                    () => expect(res).to.have.status(200),
                    'Status is 200',
                    'Expected status to be 200'
                );
                assertAndLog(
                    () => expect(res.body).to.have.property('user'),
                    'Response body has property user',
                    'Response body has no property user',
                );
    
                newUserId = res.body['user']['_id'];
                done();
            });
    });
    
    // it('test_api_user_details_user_not_found', function (done) {
    //     const user = { ...newUser}

    //     chai.request(app)
    //         .get('/users/details')
    //         .send(user)
    //         .type('json')
    //         .set('authorization' ,`Bearer ${userToken}`)
    //         .end((err, res) => {
    //             if (err) return done(err);
    
    //             // Individual assertions
    //             assertAndLog(
    //                 () => expect(res).to.have.status(404),
    //                 'Status is 404',
    //                 'Expected status to be 404'
    //             );
    //             assertAndLog(
    //                 () => expect(res.body).to.have.property('user'),
    //                 'Error is "User not found"',
    //                 'Error is not "User not found"',
    //             );
    
    //             done();
    //         });
    // });

    it('test_api_user_set_as_admin_successful', function (done) {
        chai.request(app)
            .patch(`/users/${newUserId}/set-as-admin`)
            .set('authorization' ,`Bearer ${adminToken}`)
            .end((err, res) => {
                if (err) return done(err);
                
                // Individual assertions
                assertAndLog(
                    () => expect(res).to.have.status(200),
                    'Status is 200',
                    'Expected status to be 200'
                );
                assertAndLog(
                    () => expect(res.body).to.have.property('updatedUser'),
                    'Response body has property updatedUser',
                    'Response body has no property updatedUser',
                );
                assertAndLog(
                    () => expect(res.body.updatedUser).to.have.property('isAdmin').equal(true),
                    'Response body isAdmin property is equal to true',
                    'Response body isAdmin property is not equal to true',
                );
    
                done();
            });
    });    


});
