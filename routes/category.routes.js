const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');


//API for get category List
router.get('/',authenticateUser,categoryController.getCategoryList)

//API for add new category
router.post("/",authenticateUser,categoryController.addCategory)


//delete category
router.delete("/:id",authenticateUser, categoryController.deleteCategory);



module.exports=router;