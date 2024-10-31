const express = require('express')
const auth = require("./auth");
const user = require("./user");
const admin = require("./admin");
const recipe = require("./recipe");
const market = require("./market");

const router = express.Router()
router.use('/auth', auth)
router.use('/user', user)
router.use('/admin', admin)
router.use('/recipe', recipe)
router.use('/market', market)

module.exports = router
