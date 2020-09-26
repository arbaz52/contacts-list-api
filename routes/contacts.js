var express = require("express")
var router = express.Router()

//to generate errors
var createError = require('http-errors');

//contacts
var Contact = require("./../mongodb/Contact")

//get a list of all the contacts
router.get("/", (req, res, next) => {
    Contact.find({}, (err, data) => {
        //if error occurs, return error
        if (err)
            return next(err)


        //return list of users
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
    Contact.create({ name, mobile }, (err, data) => {
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


    Contact.findById(contactId, (err, data) => {
        //if error occurs, return error
        if (err)
            return next(err)

        //record does not exist
        if (!data)
            return next(createError(404, "Contact not found!"))


        //record exists, updating record.
        Contact.findByIdAndUpdate(contactId, update, (err, data) => {
            //if error occurs, return error
            if (err)
                return next(err)

            res.json(
                {
                    message: "Sucessfully updated contact!",
                    contact: {...data._doc, ...update}
                }
            )
        })
    })
})

//delete a contact
router.delete("/:contactId", (req, res, next) => {
    let contactId = req.params.contactId

    Contact.findById(contactId, (err, data) => {
        //if error occurs, return error
        if (err)
            return next(err)

        //record does not exist
        if (!data)
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