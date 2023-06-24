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
  //   grid,
  })
}

module.exports = invCont