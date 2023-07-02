const utilities = require("../utilities/")
const errCont = {}

errCont.buildErrorPage = async function(req, res){
    const nav = await utilities.getNav()
    res.render("errors/error", {
      title: "500",
      nav,
      message: "Sorry, an error has occurred",
  })
  }


module.exports = errCont