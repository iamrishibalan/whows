"use strict";
const express = require("express");
const router = express.Router();
const myprofileController = require("../controller/myprofile");
router.post('/myprofile' , myprofileController.myprofile)
router.post('/getProfileDetail' , myprofileController.getProfileDetail)
router.post('/UpdateProfileDetail1' , myprofileController.UpdateProfileDetail1)
router.post('/UpdateProfileDetail2' , myprofileController.UpdateProfileDetail2)

module.exports = router;