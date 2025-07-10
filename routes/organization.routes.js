const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organization.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');
const upload=require('../middlewares/uploadBannerImages')
//upload test paper
router.post('/',authenticateUser,organizationController.addOrganization);

//get all quiz question  by chapter
router.get('/',authenticateUser,organizationController.getOrganizationDetail)

//upload banner images
router.post('/upload-banner',authenticateUser,upload.single("banner-image"),organizationController.uploadBannerImage)
//get banner images
router.get('/banner-images',authenticateUser,organizationController.getBannerImages)

//delete banner image
router.delete('/delete-banner-image/:image_id',authenticateUser,organizationController.deletebannerImage)

module.exports=router;