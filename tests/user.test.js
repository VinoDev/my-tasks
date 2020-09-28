const request = require('supertest');
const app = require('../src/app.js');
const User = require('../src/models/user.js');

const testUser = {
    name: "Ron",
    email: "rom@mail.com",
    password: "rontest123"
}

beforeEach(async ()=>{
    await User.deleteMany();
    await new User(testUser).save();
})

test('Should signup a new user', async()=>{
    await request(app).post('/users').send({
        name: "Bob",
        email: "bob@mail.com",
        password: "test123"
    }).expect(201)
})

test('Should login exsiting user', async ()=>{
    await request(app).post('/users/login').send({
        email: testUser.email,
        password: testUser.password
    }).expect(200)
})

test('Should NOT login if user dont exist', async ()=>{
    await request(app).post('/users/login').send({
        email: "idontexist@mail.com",
        password: "idontexist123"
    }).expect(400)
})