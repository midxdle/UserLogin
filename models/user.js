var mongoose = require('mongoose');
var { MongoClient } = require('mongodb');
var bcrypt = require('bcryptjs');

const uri = "mongodb+srv://midxdle:fFbE2DpWoxmGTAXF@cluster0.axsj3.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("test").collection("users");
    // perform actions on the collection object
    client.close();
  });
mongoose.connect(uri ,{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('connected...'))
.catch((err)=> console.log(err));

var db = mongoose.connection;


// User Schema

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String,
    }, 
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    profileimage: {
        type: String,
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id ,callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.comparePassword = function(condidatepassword , hash, callback){
    // Load hash from your password DB.
    bcrypt.compare(condidatepassword, hash, function(err, isMatch) {
    // res === true
     callback(null, isMatch);
    });
}

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
            // Store hash in your password DB.
        });
    });
}