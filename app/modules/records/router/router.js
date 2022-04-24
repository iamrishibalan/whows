"use strict";
const express = require("express");
const router = express.Router();
const recorsController = require("../controller/records");
router.get('/AdminRecord' ,recorsController.AdminRecord);
router.get('/ViewWebinarDetail' , recorsController.ViewWebinarDetail);
router.get('/ViewWebinarDetail1' , recorsController.ViewWebinarDetail1);
router.get('/UsedTime' , recorsController.UsedTime);
router.get('/CollapseTime' , recorsController.CollapseTime);
router.get('/WSelectTime' , recorsController.WSelectTime);
router.get('/modalwelcome' , recorsController.modalwelcome);
// router.get('/rate1' , recorsController.rate1);
// router.get('/rate2' , recorsController.rate2);
// router.get('/rate3' , recorsController.rate3);
// router.get('/rate4' , recorsController.rate4);
// router.post('/getdetailsforfeedback' , recorsController.getdetailsforfeedback);

module.exports = router;