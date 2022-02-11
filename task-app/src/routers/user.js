const express = require("express");
const User = require("../models/user");
const router = new express.Router();

router.post("/users", async (req, res) => {
    const user = new User(req.body);

    await user.save()
    try {
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    }
    catch (err) {
        res.status(400).send(err);
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (err) {
        res.status(400).send()
    }
})

router.get("/users", (req, res) => {
    User.find()
        .then((users) => {
            res.status(200).send(users);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

//fetch particular field using url
router.get("/users/:id", (req, res) => {
    const _id = req.params.id;
    User.findById(_id)
        .then((user) => {
            if (!user) {
                return res.status(404).send();
            }
            res.send(user);
        })
        .catch((e) => {
            res.status(500).send();
        });
});

//we use async await
router.patch("/users/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) =>
        allowUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates!" });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (err) {
        res.status(500).send(e);
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);

    } catch (err) {
        res.status(500).send(e);
    }

})

module.exports = router;
