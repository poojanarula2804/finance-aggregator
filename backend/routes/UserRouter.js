// imports and dependencies
const express = require('express')
const router = express.Router()
const User = require('../models/User')

// retrieve all the users present
router.get('/', async(req, res) => {
    try {
        const allUsers = await User.find()
        res.status(200).json({ message: allUsers, status: 1 })
    } catch (err) {
        res.status(400).json({ message: 'Error is ' + err, status: 0 })
    }
})

// verify user login
router.post('/login', async(req, res) => {
    try {
        await User.find({ email: req.body.email }).then(data => {
            if (data[0].password = req.body.password) {
                res.status(200).json({ message: "successful", status: 1 })
            }
        }).catch(err => {
            console.log(err)
        })
        res.status(400)
    } catch (err) {
        console.log(err)
    }
})

// create a user, for the first time (Bookmarks are null here, only personal details added)
router.post('/', async(req, res) => {
    const UserObject = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        address: req.body.address,
        bookmarks: {
            fd: [],
            loans: [],
            insurance: []
        }
    })
    try {
        // check if a user with this email already exits
        await User.find({ "email": req.body.email }).then(data => {
            if (data.length > 0) {
                res.status(200).json({ status: 0, message: 'A user with this email already exists. Please login instead.' })
                return;
            } else {
                // create user
                User.create(UserObject)
                    .then(data => {
                        res.status(200).json({ status: 1 })
                        return;
                    })
                    .catch(err => {
                        const resp = { status: 0, message: 'Error is ' + err }
                        res.status(400).json(resp)
                        return;
                    })
            }
        })

    } catch (err) {
        res.status(400).json({ status: 0, message: 'Error is ' + err })
    }
})

// based on type (fd, loan or insurance the update is made) the chosen policy is added as a bookmark
router.post('/bookmark/:type', async(req, res) => {
    try {
        const allUsers = await User.find()
        for (const obj of allUsers) {
            if (obj.email === req.body.email) {
                var allBookmarks = obj.bookmarks
                if (req.params.type === 'fd') {
                    var fd = allBookmarks.fd
                    fd.push(req.body.bookmarks.fd)
                    allBookmarks.fd = fd
                } else if (req.params.type === 'loan') {
                    var loan = allBookmarks.loan
                    loan.push(req.body.bookmarks.loan)
                    allBookmarks.loan = loan
                } else if (req.params.type === 'insurance') {
                    var insurance = allBookmarks.insurance
                    insurance.push(req.body.bookmarks.insurance)
                    allBookmarks.insurance = insurance
                }
                User.findOneAndUpdate({ _id: obj._id }, { bookmarks: allBookmarks }, { upsert: true }, function(err, res) {
                    if (err != null) {
                        console.log('Error is ' + err)
                    }
                })
            }
        }
        res.status(200).json({ status: 1 })
    } catch (err) {
        console.log(err)
        res.status(400).json({ status: 0, message: 'Error is ' + err })
    }
})

router.post('/data:email', async(req, res) => {
    try {
        const userDetails = await User.find({
            email: req.body.email
        })
    } catch (error) {
        console.log(err)
        res.status(400).json({ status: 0, message: 'Could not fetch details' })
    }
})
module.exports = router