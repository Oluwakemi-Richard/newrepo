const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const logValidate = {};
const accountModel = require("../models/account-model")


/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."),
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."),
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),

      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /*  **********************************
 *  Update Account Data Validation Rules
 * ********************************* */
  validate.updateAccountRules = () => {
    return [
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."),
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."),
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const emailExists = await accountModel.checkExistingEmailUpdate(account_email, req.body.account_id)
        console.log(account_email, req.body.account_id)

        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
    ]
  }

/*  **********************************
 *  Change Password Validation Rules
 * ********************************* */
  validate.changePasswordRules = () => {
    return [
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }
  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        flash: req.flash(),
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

  /* ******************************
 * Check data and return errors or continue to update data
 * ***************************** */
  validate.checkUpdatedData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id} = req.body
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/update", {
        errors,
        title: "Edit Account",
        nav,
        flash: req.flash(),
        account_firstname,
        account_lastname,
        account_email,
        account_id,
      })
      return
    }
    next()
  }



logValidate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    body("account_password").trim().notEmpty().withMessage("Password is required."),
  ];
};

logValidate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = []
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      flash: req.flash(),
      account_email,
    });
    return;
  }
  next();
};

module.exports = {
  logValidate,
  validate,
};


