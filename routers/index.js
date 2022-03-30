const express = require('express')
const router = express.Router()

const animalsRouter = require("./AnimalsRouter.js")
const classRouter = require('./ClassRouter.js')
const familysRouter = require('./FamilysRouter.js')
const kingdomsRouter = require('./KingdomsRouter.js')
const ordersRouter = require('./OrdersRouter.js')
const phylumsRouter = require('./PhylumsRouter.js')
const coordinatesRouter = require('./CoordinatesRouter.js')
const rolesRouter = require('./RolesRouter.js')
const usersRouter = require('./UsersRouter.js')

router.use('/animals',animalsRouter)
router.use('/class',classRouter)
router.use('/familys',familysRouter)
router.use('/kingdoms',kingdomsRouter)
router.use('/orders',ordersRouter)
router.use('/phylums',phylumsRouter)
router.use('/coordinates',coordinatesRouter)
router.use('/roles',rolesRouter)
router.use('/users',usersRouter)

module.exports  = router