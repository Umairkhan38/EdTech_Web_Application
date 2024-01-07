const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")
const User = require('../models/User');


exports.contactUsController = async (req, res) => {
  const { email, firstName, lastName, message, phoneNo, countryCode } = req.body
  console.log(req.body)

  try {

    const adminUser = await User.findOne({accountType:"Admin"});
    // console.log("admin is ",adminUser)

    const emailRes = await mailSender(
      adminUser.email,
      "Your Data send successfully",
      contactUsEmail(adminUser.email, firstName, lastName, message, phoneNo, countryCode) )
      
    console.log("Email Res ", emailRes)
    return res.json({
      success: true,
      message: "Email send successfully",
    })
  } catch (error) {
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}

