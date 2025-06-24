const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');

const multerErrorHandler = require("../middlewares/multerErrorHandler");

//API for get category List
router.get('/',authenticateUser,categoryController.getCategoryList)

router.post(
  "/",authenticateUser,
    multerErrorHandler,         
  categoryController.addCategory
);


//delete category
router.delete("/:id",authenticateUser, categoryController.deleteCategory);



module.exports=router;