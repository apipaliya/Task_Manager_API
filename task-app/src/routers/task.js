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

router.get('/tasks',auth, async(req, res) => {
    try{
        await req.user.populate('tasks').execPolpulate()
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
    }catch(e) {
        res.status(500).send()
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
        const task = await Task.findOneAndUpdate({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update)=>  task[update] = req.body[update])
        await task.save(); 
        res.send(task);
    } catch (err) {
        res.status(500).send(e);
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
        res.status(500).send(e);
    }

})

module.exports = router