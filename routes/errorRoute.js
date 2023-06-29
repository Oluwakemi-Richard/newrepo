const express = require('express');
const router = express.Router();
const utilities = require("../utilities")
const errorController = require("../controllers/errorController")

// router.get('/error', (req, res, next) => {
//   const error = new Error('Oops, there is an error');
//   error.status = 500;
//   next(error);
// });
router.get("/error", utilities.handleErrors(errorController.buildErrorPage));

module.exports = router;
