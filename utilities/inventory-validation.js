const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")

const validateClassification = {}
const validateInventory = {}


validateClassification.rules = () => {
    return [
      body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a name."),
    body("classification_name")
        .trim()
        .isAlphanumeric()
        .withMessage("Only numbers and letters are allowed"),

    ]
}
validateClassification.rules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a name."),
        body("classification_name")
            .trim()
            .isAlphanumeric()
            .withMessage("Only numbers and letters are allowed"),
    ]
}

validateClassification.checkData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = []
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        flash: req.flash(),
        classification_name,
      });
      return;
    }
    next();
};


validateInventory.rules = () => {
    return [
      body("inv_price")
        .trim()
        .isNumeric()
        .withMessage("Price can only contain digits"),
      body("inv_miles")
        .trim()
        .isNumeric()
        .withMessage("Mileage can only contain valid numbers"),
      body("classification_id")
        .trim()
        .isNumeric()
        .withMessage("Select a valid class"),
      body("inv_description")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Description box cannot be empty"),
      body("inv_image")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Image path is required"),
      body("inv_thumbnail")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Thumbnail is required"),
      body("inv_color")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Color field is required."),
      body("inv_make")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Inventory make cannot be empty."),
      body("inv_model")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Inventory model cannot be empty."),
      body("inv_year")
        .trim()
        .isNumeric()
        .withMessage("Enter a valid number."),
    ];
};


validateInventory.checkData = async (req, res, next) => {
    const { inv_price, inv_miles, classification_id, inv_description, inv_image, inv_thumbnail, inv_color, inv_make, inv_model, inv_year } = req.body;
    let classification = await invModel.getClassifications();
    let inventoryList = await utilities.getInv();
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            classification,
            inventoryList,
            flash: req.flash(),
            inv_price,
            inv_miles,
            classification_id,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_color,
            inv_make,
            inv_model,
            inv_year,
        });
        return;
    }
    next();
};


module.exports = {
    validateClassification,
    validateInventory,
};