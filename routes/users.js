var express = require("express")
var router = express.Router()

var User = require("./../mongodb/User")

//to generate errors
var createError = require('http-errors');


//jwt token
var jwt = require("jsonwebtoken")

//sign up | register
router.post("/register", async (req, res, next) => {
    if (!req.body.username)
        return next(createError(400, "Please provide username"))
    if (!req.body.password)
        return next(createError(400, "Please provide password"))

    let username = req.body.username
    let password = req.body.password

    //checking if this username is already taken
    try{
        var users = await User.find({username})
        if(users.length > 0)
            return next(createError(403, "Username already taken"))

    }catch(err){
        return next(err)
    }

    User.create({
        username, password
    }, (err, data) => {
        //if error occurs, return error
        if (err)
            return next(err)


        //return the jwt token
        let token = jwt.sign({_id: data._id, username: data.username}, process.env.SUPER_SECRET_KEY)

        res.json({
            user: data, token
        })
    })
})

//login
router.post("/login", (req, res, next) => {
    if (!req.body.username)
        return next(createError(400, "Please provide username"))
    if (!req.body.password)
        return next(createError(400, "Please provide password"))

    let username = req.body.username
    let password = req.body.password


    User.find({username}, (err, data) => {
        //if error occurs, return error
        if (err)
            return next(err)

        if(data.length == 0)
            return next(createError(404, "Username not found"))

        let user = data[0] //data is a list of all the users with this username
        if(user.password != password)
            return next(createError(403, "Invalid password"))

        
        //return the jwt token
        let token = jwt.sign({_id: user._id, username: user.username}, process.env.SUPER_SECRET_KEY)

        res.json({
            user, token
        })
    })

})

module.exports = router