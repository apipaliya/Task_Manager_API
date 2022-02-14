const express = require("express");
const multer = require('multer');
const sharp = require('sharp');
const User = require("../models/user");
const router = new express.Router();
const auth = require('../middleware/auth');
const { sendWelcomeMail ,sendCancelationMail } = require('../emails/email')


router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save()
        sendWelcomeMail(user.name , user.email)
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

const upload = multer({

    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return cb(new Error('Please upload a jpg or jpeg or png file'))
        }
        
        cb(undefined, true)
    }
})

router.post("/users/me/avatar", upload.single('avatar'), auth, async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250 , height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (err, req, res, next) => {
    res.status(400).send({ err: err.message })
})

router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (err, req, res, next) => {
    res.status(400).send({ err: err.message })
})  

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch (err) {
        res.status(404).send()
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
router.patch("/users/me", auth, async (req, res) => {
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

router.delete("/users/me", auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user)
        //     return res.status(404).send("User not found")
        await req.user.remove()
        sendCancelationMail(req.user.email , req.user.name)
        res.status(200).send(req.user)
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router;
