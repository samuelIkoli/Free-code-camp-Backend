var dotenv = require('dotenv').config();
const { Db } = require('mongodb');
var mongoose = require("mongoose");
const { Schema } = mongoose;




mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true })

let Person;

var PersonSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [{ type: String }]
});
Person = mongoose.model('Person', PersonSchema);


const createAndSavePerson = (done) => {
  const person = new Person({ name: 'Sam Ikoli', age: 25, favoriteFoods: ['Chicken Burger'] });

  person.save((err, data) => err ? done(null) : done(null, data));
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => err ? done(err) : done(null, data));
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => err ? done(err) : done(null, data));
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => err ? done(err) : done(null, data));
};

const findPersonById = (personId, done) => {
  Person.findById({ _id: personId }, (err, data) => err ? done(err) : done(null, data));
};

const findEditThenSave = function (personId, done) {
  var foodToAdd = 'hamburger';
  var person = Person.findById(personId, function (err, person) {
    if (err) return console.log(err);
    person.favoriteFoods.push(foodToAdd);
    person.save(function (err, data) {
      if (err) console.log(err);
      done(null, data)
    });
  })
}


const findAndUpdate = function (personName, done) {
  var ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName },
    { $set: { age: ageToSet } },
    { new: true },
    (err, data) => {
      if (err)
        done(err);
      done(null, data);
    })
};

const removeById = function (personId, done) {
  Person.findByIdAndRemove(personId, (err, data) => err ? console.log(err) : done(null, data));
};

const removeManyPeople = function (done) {
  var nameToRemove = "Mary";
  Person.remove({ name: nameToRemove }, function (error, data) {
    error ? done(error) : done(null, data);
  });
};


const queryChain = function (done) {
  var foodToSearch = "burrito";
  Person.find({ favoriteFoods: foodToSearch }).sort({ name: 'asc' }).limit(2).select({ age: 0 }).exec(function (err, data) {
    console.log(data)
    done(null, data);
  })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
