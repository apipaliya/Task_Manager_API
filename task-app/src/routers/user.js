const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const auth = require('../middleware/auth');

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

router.get("/users/me", auth, async (req, res) => {
    res.status(200).send(req.user)
})

router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send("Successfully logout..")
    } catch (err) {
        res.status(500).send("Error while loging out..")
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send("Successfully logout from All accounts..")
    } catch (err) {
        res.send("Error while loging out from All accounts..")
    }

})

//we use async await
router.patch("/users/me",auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) =>
        allowUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Updates!" });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true,
        // });
        if (!req.user) {
            return res.status(404).send();
        }
        res.status(200).send(req.user);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete('/users/me', auth,async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user)
        //     return res.status(404).send("User not found")
        await req.user.remove()
        res.status(200).send(req.user)

    } catch (err) {
        res.status(500).send(err);
    }

})

module.exports = router;
