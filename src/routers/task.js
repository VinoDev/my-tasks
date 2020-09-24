const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth.js');
const Task = require('../models/task.js');


router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error); 
    }
}) 

// GET /tasks?done=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
    try {
        const match = {owner: req.user._id};
        const sort = {};

        if(req.query.done)
            match.done = req.query.done === "true";
        if(req.query.sortBy){
            const [by, order] = req.query.sortBy.split(":");
            console.log(by);
            console.log(order);
            sort[by] = order === 'desc' ? -1 : 1;
        }

        const options = {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        };
        
        const tasks = await Task.find(match, null, options);
        res.send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get("/tasks/:id", auth, async (req, res)=>{
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id});       

        if(!task)
            return res.status(404).send();
        
        res.send(task);
    } catch (error) {   
        res.status(500).send(error);
    };
})

router.patch("/tasks/:id", auth, async (req, res)=>{
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "done"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation)
        return res.status(400).send({error: "invalid updates!"})
    
    try {
        const task = await Task.findOne({_id, owner: req.user._id});
        
        if(!task)
            return res.status(404).send();

        updates.forEach((update) => task[update] = req.body[update]);

        await task.save();
        
        res.send(task);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
})

router.delete("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id});

        if(!task)
            return res.status(404).send();

        res.send(task);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})


module.exports = router;