const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


invCont.getCarDetailByCarId = async function (req, res, next) {
  const carId = req.params.carId
  const data = await invModel.getInventoryByCarId(carId)
  console.log(data)
  const carDetail = await utilities.carDetail(data)
  let nav = await utilities.getNav()
  const titleName = data.inv_make +" "+ data.inv_model
  res.render("./inventory/detail", {
    title: titleName,
    nav,
    carDetail,
  })
}


invCont.viewInv = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classification = await invModel.getClassifications();
  res.render('inventory/management', {
    title: 'Management',
    nav,
    flash: req.flash(),
    classification,
    errors: null,
  });
}

invCont.buildClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('inventory/add-classification', {
    title: 'Add Classification',
    nav,
    flash: req.flash(),
    errors: null,
  });
}
invCont.addClassification = async function (req, res, next) {
  const classificationName = req.body.classification_name
  try {
    const data = await invModel.addClassName(classificationName)
    if (data) {
      let nav = await utilities.getNav()
      req.flash(
        "notice",
        `New classification has been added successfully`
      )
      res.status(201).render("inventory/management", {
        title: 'Management',
        nav,
        flash: req.flash(),
        errors: null,
      });
    } else {
      req.flash("notice", "Failed to add new classification")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        flash: req.flash(),
        errors: null,
      })
    }
  } catch (error) {
    console.error("addClassification error: ", error);
    req.flash("notice", 'Sorry, an error occured.')
    res.status(500).render("inventory/add-classification", {
      title: "Error",
      nav,
      flash: req.flash(),
      errors: null,
    });
  }
};

invCont.buildInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classification = await invModel.getClassifications();
  let inventoryList = await utilities.getInv();
  res.render('inventory/add-inventory', {
    title: 'Add Inventory',
    nav,
    classification,
    inventoryList,
    flash: req.flash(),
    errors: null,
  });

}


invCont.addInventory = async function (req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let nav = await utilities.getNav()
  let classification = await invModel.getClassifications();
  let inventoryList = await utilities.getInv();
  try {
    const data = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    if (data) {
      req.flash(
        "notice",
        `Successfully added new inventory`
      )
      res.status(201).render("inventory/management", {
        title: 'Management',
        nav,
        flash: req.flash(),
        errors: null,
      });
    } else {
      req.flash("notice", "Failed to add inventory.")
      res.status(501).render("inventory/add-inventory", {
        title: "Inventory",
        nav,
        classification,
        inventoryList,
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,
        flash: req.flash(),
        errors: null,
      })
    }
  } catch (error) {
    console.error("addInventory error: ", error);
    req.flash("notice", 'Sorry, an error occured while adding inventory.')
    res.status(500).render("inventory/add-inventory", {
      title: "Error",
      nav,
      classification,
      inventoryList,
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,
      flash: req.flash(),
      errors: null,
    });
  }
};





/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
Edit
 * ************************** */
invCont.editInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByCarId(inv_id)
  const classification = await invModel.getClassifications();
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.status(201).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    flash: req.flash(),
    classification,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
};



invCont.updateInventory = async function (req, res, next) {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let nav = await utilities.getNav()
  let classification = await invModel.getClassifications();
    const updateResult = await invModel.updateInventory(
       inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,inv_id)

    if (updateResult){
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    }
    else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Failed to update inventory.")
      res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classification,
      inventoryList,
      inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,
      flash: req.flash(),
      errors: null,
      })
    }
};

/* ***************************
delete inventory
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByCarId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.status(201).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    flash: req.flash(),
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};


invCont.removeInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  let nav = await utilities.getNav()
    const removeResult = await invModel.removeInventory(inv_id)

    if (removeResult){
      req.flash("notice", `Successfully deleted inventory.`)
      res.redirect("/inv/")
    }
    else {
      req.flash("notice", "Sorry, the delete failed.")
      res.status(501).render("/inv/")
    }
};








module.exports = invCont
