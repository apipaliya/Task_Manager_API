const express = require('express');
const Task = require('../models/task');
const router = new express.Router();
const auth = require('../middleware/auth');

router.post('/tasks', auth,(req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    task.save().then(() => {
        res.send(task)
    }).catch((err) => {
        res.status(400).send(err)

    })
})

//GET /tasks?completed=true
//GET /tasks?limit=2&skip=0
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks',auth, async(req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if (!req.query.limit)
        req.query.limit = 3
    if (!req.query.skip)
        req.query.skip = 0

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit : parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })  
        res.status(200).send(req.user.tasks)        
    }catch(err) {
        res.status(500).send(err)
    }
})

//fetch particular field using url
router.get('/tasks/:id',auth, async(req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id,owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(err) {
        res.status(500).send(err)
    }
})

//we use async await
router.patch("/tasks/:id", auth ,async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) =>
        allowUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates!" });
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true,
        // });
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id})
        console.log(task);
        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update)=>  task[update] = req.body[update])
        await task.save(); 
        res.send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete('/tasks/:id', auth ,async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete({_id:req.params.id , owner: req.user._id})
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);

    } catch (err) {
        res.status(500).send(err);
    }

})

module.exports = router