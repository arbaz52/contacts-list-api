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
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
})

module.exports = mongoose.model("Contact", Contact)