const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user.js');
const Task = require('../../src/models/task.js')

const testUserId = new mongoose.Types.ObjectId();
const testUser = {
    _id: testUserId,
    name: "Ron",
    email: "ron@mail.com",
    password: "rontest123",
    tokens: [{
        token: jwt.sign({ _id: testUserId }, process.env.JWT_SECRET)
    }]
}

const testUserTwoId = new mongoose.Types.ObjectId();
const testUserTwo = {
    _id: testUserTwoId,
    name: "Nero",
    email: "nero@mail.com",
    password: "nerotest123",
    tokens: [{
        token: jwt.sign({ _id: testUserTwoId }, process.env.JWT_SECRET)
    }]    
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "first task",
    done: false,
    owner: testUser._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "second task",
    done: true,
    owner: testUser._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "third task",
    done: true,
    owner: testUserTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(testUser).save();
    await new User(testUserTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

const authString = `Bearer ${testUser.tokens[0].token}`;

const authStringTwo = `Bearer ${testUserTwo.tokens[0].token}`;

module.exports = {
    testUserId,
    testUser,
    testUserTwo,
    testUserTwoId,
    taskOne,
    taskTwo,
    taskThree,
    authString,
    authStringTwo,
    setupDatabase
}