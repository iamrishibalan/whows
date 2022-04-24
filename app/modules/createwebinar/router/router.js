"use strict";
const express = require("express");
const router = express.Router();
const createWebinarController = require("../controller/newwebinar");
router.post('/createWebinar' ,createWebinarController.createWebinar);
router.get('/getAllWebinar' , createWebinarController.getAllWebinar);
router.post('/DeleteWebinar' ,createWebinarController.DeleteWebinar);
router.post('/getSingleWebinarDetail' , createWebinarController.getSingleWebinarDetail);
router.post('/WebinarStatus', createWebinarController.WebinarStatus);
router.post('/webinarCompletedStatus', createWebinarController.webinarCompletedStatus);
router.post('/SendFeedback', createWebinarController.SendFeedback);
router.post('/getAllWebinarTime', createWebinarController.getAllWebinarTime);

module.exports = router;