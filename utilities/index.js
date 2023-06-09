const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.getInv = async function (req, res, next) {
    let data = await invModel.getInventory();
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
      list += "<li>"
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
      list += "</li>"
    })
    list += "</ul>"
    return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display" class="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
      + 'details"><img src="' + vehicle.inv_thumbnail
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View '
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.carDetail = async function(vehicle){
  let grid = ''
  if(vehicle){
    grid += '<div id="detailspage">'
    grid += '<div class="leftcontent">'
    grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id
    + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
    + 'details"><img src="' + vehicle.inv_thumbnail
    +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
    +' for this application"></a>'
    grid += '</div>'
    grid += '<div class="rightcontent">'
    grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model+ ' Details'+ '</h2>'
    grid += '<p>' + '<b>Description: </b>' + vehicle.inv_description + '</p>'
    grid += '<div class="cardetails">'
    grid += '<p>' + '<b>Year: </b>' + vehicle.inv_year + '</p>'
    grid += '<p>' +'<b>Color: </b>' + vehicle.inv_color + '</p>'
    grid += '<p>' +'<b>Mileage: </b>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles)+ '</p>'
    grid += '<span>'+'<b>Price: </b>' + '$'
    + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
    grid += '</div>'
    grid += '</div>'
    grid += '</div>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = true
        next()
      }
    )
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 Util.checkAuthorizarion = (req, res, next) => {
  const accountType = res.locals.accountData.account_type
  if(accountType !== "Admin" && accountType !== "Employee"){
    req.flash("notice","Not authorized! Log in as Admin or Employee to view this page.")
    return res.redirect("/account/login")
  } else {
    next()
  }
 }

module.exports = Util