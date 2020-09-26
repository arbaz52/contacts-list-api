var mongoose = require("mongoose")
// connect to database
mongoose.connect("mongodb+srv://banadoc:1234@cluster0.wfrz2.mongodb.net/contacts?retryWrites=true&w=majority")
module.exports = mongoose