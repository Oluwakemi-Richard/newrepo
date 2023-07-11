// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const validate = require('../utilities/inventory-validation');
const utilities = require('../utilities');
const Util = require("../utilities");



// Route to build inventory by classification view
router.get("/",
    utilities.checkLogin,
    utilities.checkAuthorizarion,
    utilities.handleErrors(invController.viewInv)
);

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:carId",  utilities.handleErrors(invController.getCarDetailByCarId));


router.get("/add-classification", utilities.handleErrors(invController.buildClassification));

router.post(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkAuthorizarion,
    validate.validateClassification.rules(),
    validate.validateClassification.checkData,
    utilities.handleErrors(invController.addClassification)
);

router.get("/add-inventory",
    utilities.checkLogin,
    utilities.checkAuthorizarion,
    utilities.handleErrors(invController.buildInventory));

router.post(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkAuthorizarion,
    validate.validateInventory.rules(),
    validate.validateInventory.checkData,
    utilities.handleErrors(invController.addInventory)
);

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


router.get("/edit-inventory/:inv_id",
    utilities.checkLogin,
    utilities.checkAuthorizarion,
    utilities.handleErrors(invController.editInventory)
)

router.post("/edit-inventory/",
    utilities.checkLogin,
    utilities.checkAuthorizarion,
    validate.validateInventory.rules(),
    validate.validateInventory.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)


router.get("/delete-confirm/:inv_id",
    utilities.checkLogin,
    utilities.checkAuthorizarion,
    utilities.handleErrors(invController.deleteInventory)
)

router.post("/delete-confirm/",
    utilities.checkLogin,
    utilities.checkAuthorizarion,
    utilities.handleErrors(invController.removeInventory)
)

module.exports = router;







