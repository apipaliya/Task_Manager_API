const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

router.post('/tasks', (req, res) => {
    const task = new Task(req.body)

    task.save().then(() => {
        res.send(task)
    }).catch((err) => {
        res.status(400).send(err)

    })
})

router.get('/tasks', (req, res) => {
    Task.find().then((tasks) => {
        res.status(200).send(tasks)
    }).catch((err) => {
        res.status(500).send(err)
    })
})

//fetch particular field using url
router.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    Task.findById(_id).then((task) => {
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }).catch((e) => {
        res.status(500).send()
    })
})

//we use async await
router.patch("/tasks/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) =>
        allowUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates!" });
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (err) {
        res.status(500).send(e);
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);

    } catch (err) {
        res.status(500).send(e);
    }

})

module.exports = router