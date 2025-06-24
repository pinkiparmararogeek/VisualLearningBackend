const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organization.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');

//upload test paper
router.post('/',authenticateUser,organizationController.addOrganization);

//get all quiz question  by chapter
router.get('/',authenticateUser,organizationController.getOrganizationDetail)





module.exports=router;