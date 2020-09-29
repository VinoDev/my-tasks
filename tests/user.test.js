const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app.js');
const User = require('../src/models/user.js');

const testUserId = new mongoose.Types.ObjectId();
const testUser = {
    _id: testUserId,
    name: "Ron",
    email: "rom@mail.com",
    password: "rontest123",
    tokens: [{
        token: jwt.sign({ _id: testUserId }, process.env.JWT_SECRET)
    }]
}

const authString = `Bearer ${testUser.tokens[0].token}`;

beforeEach(async () => {
    await User.deleteMany();
    await new User(testUser).save();
})

test('Should signup a new user', async () => {
    const response = await request(app).post('/users')
        .send({
            name: "Bob",
            email: "bob@mail.com",
            password: "test123"
        })
        .expect(201)
    
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: {
            name: "Bob",
            email: "bob@mail.com"
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe("test123");
})

test('Should login exsiting user', async () => {
    const response = await request(app).post('/users/login')
        .send({
            email: testUser.email,
            password: testUser.password
        })
        .expect(200)

    const user = await User.findById(response.body.user._id);
    expect(response.body.token).toBe(user.tokens[1].token);
})

test('Should NOT login if user dont exist', async () => {
    await request(app).post('/users/login')
        .send({
            email: "idontexist@mail.com",
            password: "idontexist123"
        })
        .expect(400)
})

test('Should get profile for user', async () => {
    await request(app).get('/users/me')
        .set('Authorization', authString)
        .send()
        .expect(200)
})

test('Should NOT get profile for unauthenticated user', async () => {
    await request(app).get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    const response = await request(app).delete('/users/me')
        .set('Authorization', authString)
        .send()
        .expect(200)
    
    const user = await User.findById(response.body._id);
    expect(user).toBeNull();
})

test('Should NOT delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me')
        .send()
        .expect(401)
})