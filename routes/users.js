const router = require('express').Router();
let User = require('../models/user.model');
const mongoose = require('mongoose');


//main path /users is configured in server.js

router.route('/').get((req, res) => {
    //execute find all users and return response as json if no error
    User.find()
        .then(users=> res.json(users))
        .catch(err=> res.status(400).json('Error: ' + err));
});

router.route('/').post((req, res) => {
    //get name and email from payload
    ({name, email} = req.body);
    //create new user object
    const newUser = new User({"name": name, "email": email});
    //save new user object
    newUser.save()
        .then(() => res.json('user added successfully'))
        .catch((err)=> res.status(400).json('error: ' + err));

});

//get user by id
router.route('/:email').get((req, res) => {
	//get email from url param and pass that to the find method
	User.find({"email": req.params.email})
		.then(users=>res.json(users))
		.catch(err=> res.status(400).json('Error: ' + err));
});

//update user by id
router.route('/:email').post((req, res) => {
    ({name, email} = req.body);
	//get email from url param and pass create a query object
    var myquery = { email: req.params.email };

	User.updateOne(myquery, {"name": name, "email": email})
    .then(()=>res.json("success"))
    .catch(err=> res.status(400).json('Error: '+ err));
});

//delete a user by id
router.route('/:email').delete((req,res) => {
	//get email from url param and pass to the deleteone method
	User.deleteOne({"email": req.params.email}, function (err) {
		if (err) res.status(400).json('Error: '+ err);
		// deleted at most one document
		})
		.then(()=>res.json("success"));
});

module.exports = router;