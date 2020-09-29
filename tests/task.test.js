const request = require('supertest');
const app = require('../src/app.js');
const Task = require('../src/models/task.js');
const {
    testUserId,
    testUser,
    testUserTwoId,
    testUserTwo,
    taskOne,
    taskTwo,
    taskThree,
    authString,
    authStringTwo,
    setupDatabase
} = require('./fixtures/db.js');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
    const response = await request(app).post('/tasks')
        .send({
            description: "From my test"
        })
        .set("Authorization", authString)
        .expect(201)
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.done).toBe(false);
})

test('Should fetch tasks for user', async () => {
    const response = await request(app).get('/tasks')
        .send()
        .set("Authorization", authString)
        .expect(200)

    expect(response.body.length).toBe(2)
})

test('Should not delete other users tasks', async () => {
    const response = await request(app).delete(`/tasks/${taskOne._id}`)
        .set('Authorization', authStringTwo)
        .send()
        .expect(404)

    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull();
})
