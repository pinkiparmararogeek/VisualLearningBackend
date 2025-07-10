const express = require("express");
const router = express.Router();
const favouriteController = require("../controllers/favourite.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');

//API for mark favourite any content
router.post('/',authenticateUser,favouriteController.markFavourite)


//API for remove as a favourite video
router.post('/remove-favourite',authenticateUser,favouriteController.removeFavourite)

//get allfavourite video list by user id
router.get('/favourite-video/:user_id',authenticateUser,favouriteController.getFavouriteVideosByUserId)



module.exports=router;