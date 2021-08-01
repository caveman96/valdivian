const router = require('express').Router();
let Product = require('../models/product.model');
const mongoose = require('mongoose');


router.route('/').get((req, res) => {
    //execute find all users and return response as json if no error
    Product.find()
        .then(products=> res.json(products))
        .catch(err=> res.status(400).json('Error: ' + err));
});

router.route('/').post((req, res) => {

    //create new object
    const newProduct = new Product(req.body);
    //save new user object
    newProduct.save()
        .then(() => res.json('product added successfully'))
        .catch((err)=> res.status(400).json('error: ' + err));

});

//get user by id
router.route('/:productid').get((req, res) => {
	//get username from url param and pass that to the find method
	Product.find({"productid": req.params.productid})
		.then(products=>res.json(products))
		.catch(err=> res.status(400).json('Error: ' + err));
});

//delete a user by id
router.route('/:productid').delete((req,res) => {
	//get username from url param and pass to the deleteone method
	Product.deleteOne({"productid": req.params.productid})
		.then(()=>res.json("success"))
        .catch(err=> res.status(400).json('Error: ' + err));
});

//update product by id
router.route('/:productid').post((req, res) => {
	//get id from url param and pass create a query object
    var myquery = { productid: req.params.productid };

	Product.updateOne(myquery, req.body)
    .then(()=>res.json("success"))
    .catch(err=> res.status(400).json('Error: '+ err));
});

module.exports = router;