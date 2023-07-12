const utilities = require('../utilities');
const Account = require('../models/account-model');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Deliver login view
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/login', {
    title: 'Login',
    nav,
    flash: req.flash(),
    errors: null,
  });
}


async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    console.log("Hashed Password:", hashedPassword)
    const regResult = await Account.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        flash: req.flash(),
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        flash: req.flash(),
        errors: null,
      })
    }
  } catch (error) {
    console.log("Hashing Error:", error)
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      flash: req.flash(),
      errors: null,
    })
  }
}

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    flash: req.flash(),
    errors: null,
  })
}
async function register(req, res, next) {
  res.redirect('/account/login');
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await Account.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }



async function buildAccManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    flash: req.flash(),
    errors: null,
  })
}

/* ****************************************
 *  build account update view
 * ************************************ */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id } = req.params;
  const data = await Account.getAccountById(account_id);
  res.render("account/update", {
    title: "Modify Account Details",
    nav,
    flash: req.flash(),
    errors: null,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
    account_id: data.account_id,
  })
}

 async function accountUpdate (req, res, next) {
  const{account_firstname,
    account_lastname,
    account_email,
    account_id,} = req.body
  let nav = await utilities.getNav()
  const updateResult = await Account.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  );
  if (updateResult){
    const updatedName = updateResult.account_firstname + " " + updateResult.account_lastname

    const accountData = await Account.getAccountById(account_id)
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

    req.flash("notice",`${updatedName}'s account was successfully updated.`)

    res.redirect("/account")
  }
  else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/update/", {
      title: "Modify Account Details",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    });
  }
};

async function changePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  }catch (error) {
    req.flash("notice", "Sorry, there was an error changing your password.");
    res.status(500).render("account/update", {
      title: "Modify Account Details",
      nav,
      errors: null,
      account_id,
    });
  }
  const updateResult = await Account.changePassword(hashedPassword, account_id)
  if (updateResult){
    const updatedName = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice",`${updatedName}'s password was successfully updated.`)
    res.redirect("/account")

  }
  else {
    req.flash("notice", "Sorry, the password update failed.");
    res.status(501).render("account/update", {
      title: "Modify Account Details",
      nav,

      flash: req.flash(),

      errors: null,
      account_id,
    });
  }
}

async function register(req, res, next) {
  res.redirect('/account/login');
}


/* ****************************************
 *  Process logout
 * ************************************ */
async function accountLogout(req, res) {
  let nav = await utilities.getNav()
   req.flash("notice", "you're logged out.")
   res.clearCookie("jwt");
   return res.redirect("/")
}






/* ***************************
delete account
 * ************************** */
async function deleteAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id);
  console.log(account_id)
  let nav = await utilities.getNav();
  const accountData = await Account.getAccountById(account_id)
  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
  res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
  const itemName = `${accountData.account_firstname} ${accountData.account_lastname}`;
  res.status(201).render("account/delete-confirm", {
      title: "Delete " + itemName+"'s account",
      nav,
      flash: req.flash(),
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
  });
};




async function removeAccount(req, res, next) {
  const account_id = parseInt(req.body.account_id);

  let nav = await utilities.getNav()
    const removeResult = await Account.removeAccount(account_id)
    if (removeResult){
      req.flash("notice", `The account was successfully Deleted.`)
      res.redirect("/")
    }
    else {
      req.flash("notice", "Sorry, the delete failed.")
      res.status(501).render("/account/")
    }
};






module.exports = {
  buildLogin,
  buildRegister,
  register,
  registerAccount,
  accountLogin,
  buildAccManagement,
  buildAccountUpdate,
  accountUpdate,
  changePassword,
  accountLogout,
  deleteAccount,
  removeAccount,
};
