var mongoose = require("./connect")

var Schema = mongoose.Schema


var Contact = new Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Contact", Contact)