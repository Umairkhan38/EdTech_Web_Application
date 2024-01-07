const express = require("express")
const router = express.Router()
const { contactUsController } = require("../controllers/ContactUs")

router.post("/contactus", contactUsController)

module.exports = router
