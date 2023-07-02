// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invvalidattion = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:carId", utilities.handleErrors(invController.getCarDetailByCarId));

// Management view route
router.get("/", utilities.handleErrors(invController.viewInv));


//add classification routes
router.get("/add-classification", utilities.handleErrors(invController.buildClassification));
router.post(
    "/add-classification",
    invvalidattion.validateClassification.rules(),
    invvalidattion.validateClassification.checkData,
    utilities.handleErrors(invController.addClassification)
);
// add inventory routes
router.get("/add-inventory", utilities.handleErrors(invController.buildInventory));
router.post(
    "/add-inventory",
    invvalidattion.validateInventory.rules(),
    invvalidattion.validateInventory.checkData,
    utilities.handleErrors(invController.addInventory)
);



module.exports = router;