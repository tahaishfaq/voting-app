//NPM Packages
const router = require("express").Router();

// controller 
const { signup, login } = require("../controller/user");


//Routes
router.post("/signup", signup);
router.post("/login" , login)





module.exports = router;
