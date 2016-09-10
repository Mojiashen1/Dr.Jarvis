var mongoose = require('mongoose');
// var findOrCreate = require('mongoose-findorcreate')

// Create a connect.js inside the models/ directory that
// exports your MongoDB URI!


var userSchema = mongoose.Schema({
  symptom: String,
  disease: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disease'
  },
<<<<<<< HEAD
=======
  medicine: String,
>>>>>>> tmpbranch
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  phoneNumber: Number
});

var doctorSchema = mongoose.Schema({
  name: String,
  number: Number,
});

var diseaseSchema = mongoose.Schema({
  name: String,
<<<<<<< HEAD
  medicine: String,
  usage: String
=======
  symptom: String,
  medicine: String
>>>>>>> tmpbranch
});
var connect = process.env.MONGODBURI;

mongoose.connect(connect);
// userSchema.plugin(findOrCreate);
module.exports = {User: mongoose.model('User', userSchema),
Doctor: mongoose.model('Doctor', doctorSchema),
Disease: mongoose.model('Disease', diseaseSchema)};
