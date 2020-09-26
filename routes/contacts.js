var express = require("express")
var router = express.Router()
var jwt = require("jsonwebtoken")



const getJWTToken = (req) => {
    if (!req.headers.authorization)
        return null

    let rawToken = req.headers.authorization
    rawToken = rawToken.split(" ")[1] //removing the "Bearer" keyword


    try {
        return jwt.verify(rawToken, process.env.SUPER_SECRET_KEY)
    } catch (err) {
        console.error(err)
        return null
    }
}

//to generate errors
var createError = require('http-errors');

//contacts
var Contact = require("./../mongodb/Contact")


router.use((req, res, next) => {
    let token = getJWTToken(req)
    if (!token)
        return next(createError(403, "You need to login first or invalid login session"))

    req.token = token
    return next()
})

//get a list of all the contacts
router.get("/", (req, res, next) => {

    Contact.find({ userId: req.token._id }, (err, data) => {
        //if error occurs, return error
        if (err)
            return next(err)


        //return list of contacts
        res.json(data)
    })
})


//add a new contact
router.post("/", (req, res, next) => {
    if (!req.body.name)
        return next(createError(400, "Please provide name"))
    let name = req.body.name

    if (!req.body.mobile)
        return next(createError(400, "Please provide mobile"))
    let mobile = req.body.mobile


    //add a new contact
    Contact.create({ name, mobile, userId: req.token._id }, (err, data) => {
        //if error occurs, return error
        if (err)
            return next(err)

        res.json(data)
    })

})


//update a contact
router.put("/:contactId", (req, res, next) => {
    let contactId = req.params.contactId

    let update = {}
    if (req.body.name)
        update = { ...update, name: req.body.name }

    if (req.body.mobile)
        update = { ...update, mobile: req.body.mobile }

    Contact.find({ _id: contactId, userId: req.token._id }, (err, data) => {
        //if error occurs, return error
        if (err)
            return next(err)

        //record does not exist
        if (!data || data.length == 0)
            return next(createError(404, "Contact not found!"))


        //record exists, updating record.
        Contact.findByIdAndUpdate(contactId, update, (err, data) => {
            //if error occurs, return error
            if (err)
                return next(err)

            res.json(
                {
                    message: "Sucessfully updated contact!",
                    contact: { ...data._doc, ...update }
                }
            )
        })
    })
})

//delete a contact
router.delete("/:contactId", (req, res, next) => {
    let contactId = req.params.contactId

    Contact.find({ _id: contactId, userId: req.token._id }, (err, data) => {
        //if error occurs, return error
        if (err)
            return next(err)

        //record does not exist
        if (!data || data.length == 0)
            return next(createError(404, "Contact not found!"))

        Contact.findByIdAndDelete(contactId, (err, data) => {
            //if error occurs, return error
            if (err)
                return next(err)

            res.json(
                {
                    message: "Sucessfully deleted contact!"
                }
            )
        })

    })
})

module.exports = router