"use strict";


let apiUrl = 'https://webinarserver.s2ftech.in/';

const express = require("express");
const router = express.Router();
const db_library = require("../../_helpers/db_library");
const fs = require('fs');
const output = require("../../_models/output");
const registerController = require("../controller/register");
router.get('/register', registerController.register)
router.post('/SinIn', registerController.SinIn)
router.post('/FirstTimeLogin', registerController.FirstTimeLogin)
router.get('/ForgotEmailOtp', registerController.ForgotEmailOtp)
router.get('/ForgotPassword', registerController.ForgotPassword)
router.get('/professionalDetail', registerController.professionalDetail)
router.get('/filter', registerController.filter)
router.post('/getPdfDetails', registerController.getPdfDetails)
router.post('/getPdfshareDetails', registerController.getPdfshareDetails)
router.post('/getsharedetails', registerController.getsharedetails)
router.post('/getdetails', registerController.getdetails)
router.post('/AppUsage', registerController.AppUsage)

router.post('/PdfOption', async (req, res) => {
    var _output = new output();
    try {
        // pdf downloader and view
        let data = JSON.parse(req.body.downloadpdf);
        let InvoiceNo = Math.floor(Math.random() * 90000) + 10000;;
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(data);
        await page.pdf({
            path: __dirname + '/pdffilepath/' + InvoiceNo + '.pdf',
            format: 'A4',
            printBackground: true
        });
        _output.data = InvoiceNo;
        _output.isSuccess = true;
        _output.message = 'success'
        await browser.close();
        //end

    }
    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;
    }
    res.send(_output);
});
router.get('/getPdffilePath/:pdfname', (req, res) => {
    let pdfname = req.params.pdfname;
    var filePath = "/pdffilepath/" + pdfname;
    let pdf = fs.readFileSync(__dirname + filePath)
    res.writeHead(200, { 'Content-Type': 'application/pdf' })
    res.end(pdf, 'binary')
});
router.post('/BulkPdfdownload', async (req, res) => {
    var _output = new output();
    try {
        let rightCount = 0;
        let wrongCount = 0;
        await db_library.execute("SELECT (SELECT reg_Place FROM tblregister WHERE reg_Id='" + req.body.UserId + "')as place,(SELECT reg_Purpose FROM tblregister WHERE reg_Id='" + req.body.UserId + "')as purpose, webinar_Title AS Title,webinar_Name AS NAME,webinar_Date AS Dates,webinar_Designation AS Designation,webinar_Igpsc AS Igpsc,webinar_IT AS Id ,IFNULL(web_data,'Nodata')AS datas FROM tblmywebinar LEFT JOIN tblwebinarstatus ON web_WebinarId =webinar_Id WHERE webinar_RegUserId='" + req.body.UserId + "'", '', 0).then(async (value) => {
            let Records = value;
            if (Records.length != 0) {
                // console.log(Records.length);
                var t = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
                var dir = __dirname + '/BulkPdf/' + t;
                fs.mkdirSync(dir, 0o744);

                for (let i = 0; i < Records.length; i++) {
                    if (Records[i].datas == 'Nodata') {
                        Records[i].datas = require('../WheelData/wheelData.json').Wheeldata;
                       
                    }
                    else {
                        let allDate = new Date(Records[i].Dates);
                        let day = allDate.getDate();
                        let mon = allDate.getMonth() + 1;
                        let year = allDate.getFullYear();
                        Records[i].Dates = day + '-' + mon + '-' + year;
                        Records[i].datas = JSON.parse(Records[i].datas);
                        rightCount = 0;
                        wrongCount = 0;
                        let Plandecide = Records[i].datas[0].Planning[0].Decidingonthetopic;
                        let Planassign = Records[i].datas[0].Planning[0].AssigningRoles;
                        let Planrecruit = Records[i].datas[0].Planning[0].Recruitingthespeakers;
                        let Planplatform = Records[i].datas[0].Planning[0].Decidingontheplatform;
                        let PrepareEquipementsss = Records[i].datas[0].Preparing[0].Preparetheequipments;
                        let PrepareSetupss = Records[i].datas[0].Preparing[0].SetupRegistration;
                        let PrepareMarketss = Records[i].datas[0].Preparing[0].Marketing;
                        let PrepareDryrunss = Records[i].datas[0].Preparing[0].DryRun;
                        let PerformingConnetss = Records[i].datas[0].Performing[0].Checkontheconnections;
                        let Performingrecordss = Records[i].datas[0].Performing[0].Recordthewebinar;
                        let Performingsocialss = Records[i].datas[0].Performing[0].Promoteonsocialmedia;
                        let Performingguestss = Records[i].datas[0].Performing[0].Gatherspeakerandcallinguests;
                        let Reviewingsendingss = Records[i].datas[0].Reviewing[0].Sendingfeedback;
                        let Reviewingcollectss = Records[i].datas[0].Reviewing[0].Collectingthematerialsandsharing;
                        let Reviewingfeedbackss = Records[i].datas[0].Reviewing[0].Evaluatethefeedback;
                        let Reviewingplannextss = Records[i].datas[0].Reviewing[0].Planfornextwebinar;

                        for (let i = 0; i < Plandecide.length; i++) {
                            if (Plandecide[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < Planassign.length; i++) {
                            if (Planassign[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < Planrecruit.length; i++) {
                            if (Planrecruit[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < Planplatform.length; i++) {
                            if (Planplatform[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < PrepareEquipementsss.length; i++) {
                            if (PrepareEquipementsss[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < PrepareSetupss.length; i++) {
                            if (PrepareSetupss[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < PrepareMarketss.length; i++) {
                            if (PrepareMarketss[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < PrepareDryrunss.length; i++) {
                            if (PrepareDryrunss[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < PerformingConnetss.length; i++) {
                            if (PerformingConnetss[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < Performingrecordss.length; i++) {
                            if (Performingrecordss[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < Performingsocialss.length; i++) {
                            if (Performingsocialss[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < Performingguestss.length; i++) {
                            if (Performingguestss[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < Reviewingsendingss.length; i++) {
                            if (Reviewingsendingss[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < Reviewingcollectss.length; i++) {
                            if (Reviewingcollectss[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < Reviewingfeedbackss.length; i++) {
                            if (Reviewingfeedbackss[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                        for (let i = 0; i < Reviewingplannextss.length; i++) {
                            if (Reviewingplannextss[i].Action == true) {
                                rightCount = rightCount + 1;
                            }
                            else {
                                wrongCount = wrongCount + 1;
                            }
                        }
                    }
                    let x = wrongCount;
                    let y = rightCount;
                    let Html = `<div id="demo">
                    <style>
                        .fa-check-square-o {
                            color: green !important;
                        }
                
                        .fa-times {
                            color: red !important;
                        }
                    </style>
                  <br>
                    <div>
                        <img src="${apiUrl}getImages/img1.jpg" style="width: 100%; height: 170%;" />
                    </div>
                    <br>
                    <br>
                    <div>
                        <h2></h2>
                    </div>
                    <h1 style="color: #003089;"> ${Records[i].Title}</h1>
                    <div style="display: grid;grid-template-columns: auto auto;">
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <td style=" font-size: 30px;">
                                    Presenter : <b>${Records[i].NAME}</b>
                                </td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <td style=" font-size: 20px;">
                                    Created On : <b>${Records[i].Dates}</b>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div style="display: grid;grid-template-columns: auto auto;">
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <td><img src="${apiUrl}getImages/svg7.jpg" style="width: 15px;">
                                    ${Records[i].Designation}</td>
                            </tr>
                            <tr>
                                <td><img src="${apiUrl}getImages/svg14.jpg" style="width: 15px;">
                                    ${Records[i].Id}</td>
                            </tr>
                            <tr>
                                <td><img src="${apiUrl}getImages/svg15.jpg" style="width: 15px;">
                                    ${Records[i].Igpsc}</td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <td><img src="${apiUrl}getImages/svg17.jpg" style="width: 15px;"> ${Records[i].purpose}</td>
                            </tr>
                            <tr>
                                <td><img src="${apiUrl}getImages/svg16.jpg" style="width: 15px;">
                                    ${Records[i].place}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="display: grid;grid-template-columns: auto auto auto;">
                        <table style="width:100%;text-align: center;">
                            <tr>
                                <td style="color: rgb(247, 108, 131); font-size: 50px;">
                                    69
                                </td>
                            </tr>
                            <tr>
                                <td style=" font-size: 30px;">
                                    Total Action
                                </td>
                            </tr>

                        </table>
                        <table style="width:100%;text-align: center;" *ngFor="let status of webinarStatusCount">
                            <tr>
                                <td style="color: green; font-size: 50px;">
                                   ${rightCount}
                                </td>
                            </tr>
                            <tr>
                                <td style=" font-size: 30px;">
                                    Completed
                                </td>
                            </tr>

                        </table>
                        <table style="width:100%;text-align: center;" *ngFor="let status of webinarStatusCount" >
                            <tr>
                                <td style="color: red; font-size: 50px;">
                                    ${wrongCount}
                                </td>
                            </tr>
                            <tr>
                                <td style=" font-size: 30px;">
                                    In Progress
                                </td>
                            </tr>

                        </table>

                    </div>
                    <br>
                    <div>
                        <h2 style="text-align: center;">Over All Performance of Macro Wheel</h2>
                        <h5> </h5>
                    </div>
                    <div>
                        <img src="${apiUrl}getImages/img2.jpg" style="height: 100%;width: 100%;" />
                    </div>
                    <br>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                    <br>
                    <br>
                    <br>
                    <div style="display: grid;grid-template-columns: auto auto;">
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">01.DECIDE ON THE TOPIC-${Records[i].datas[0].Planning[1].Decidingonthetopic}%</th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Decidingonthetopic[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Set
                                    goals and Objectives</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Decidingonthetopic[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>
                                    Determine your Target Audience</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Decidingonthetopic[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>
                                    Make the list of topics</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Decidingonthetopic[3].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>
                                    fix the topic</td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">09.CHECK ON CONNECTION-${Records[i].datas[0].Performing[1].Checkontheconnections}%
                                </th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Checkontheconnections[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Check
                                    the internetspeed</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Checkontheconnections[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Check
                                    the equipment's</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Checkontheconnections[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>log
                                    into platform 15-30mins prior</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Checkontheconnections[3].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Perform
                                    Audio and video check</td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">02.ASSIGNING ROLES-${Records[i].datas[0].Planning[1].AssigningRoles}%</th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].AssigningRoles[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Organizer
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].AssigningRoles[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Presenter
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].AssigningRoles[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Assistant
                                </td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">10.RECORD THE WEBINAR-${Records[i].datas[0].Performing[1].Recordthewebinar}%</th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Recordthewebinar[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Use
                                    a build in screen Recorder<br>
                                    Download</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Recordthewebinar[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Set
                                    up screen recording</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Recordthewebinar[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Record
                                    webinar</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Recordthewebinar[3].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Edit
                                    and save</td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">03.RECRUIT THE SPEAKER-${Records[i].datas[0].Planning[1].Recruitingthespeakers}%
                                </th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Recruitingthespeakers[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Experience
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Recruitingthespeakers[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Expertise
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Recruitingthespeakers[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Time
                                    Management</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Recruitingthespeakers[3].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Availability
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Recruitingthespeakers[4].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>
                                    Expertise</td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">11.PROMOTE ON SOCIAL
                                    MEDIA-${Records[i].datas[0].Performing[1].Promoteonsocialmedia}%</th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Promoteonsocialmedia[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Test
                                    Equipment's & Connectivity</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Promoteonsocialmedia[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Live
                                    stream on Social media<br>
                                    (Youtube/Facebook/Linkedin)</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Promoteonsocialmedia[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Gain
                                    reach and better targeting</td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">04.DECIDE ON THE PLATFORM-${Records[i].datas[0].Planning[1].Decidingontheplatform}%
                                </th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Decidingontheplatform[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Ease
                                    of use</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Decidingontheplatform[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Audience
                                    size</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Decidingontheplatform[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Budget
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Decidingontheplatform[3].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Recording
                                    option</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Decidingontheplatform[4].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Engagement
                                    tools</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Decidingontheplatform[5].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Mobile
                                    utilization</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Decidingontheplatform[6].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Multi-stream
                                    capabilities</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Planning[0].Decidingontheplatform[7].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Video
                                    & Audio quality</td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">12.GATHER SPEAKERS & CALL IN
                                    GUESTS-${Records[i].datas[0].Performing[1].Gatherspeakerandcallinguests}%</th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Gatherspeakerandcallinguests[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Start
                                    the program at the right time</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Gatherspeakerandcallinguests[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Welcome
                                    the speakers</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Gatherspeakerandcallinguests[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Stick
                                    to time</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Performing[0].Gatherspeakerandcallinguests[3].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>End
                                    the programme with a <br>formal Voteof thanks</td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">05.PREPARE THE EQUIPMENT'S-${Records[i].datas[0].Preparing[1].Preparetheequipments}%
                                </th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].Preparetheequipments[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Computer/Tablets
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].Preparetheequipments[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Stable
                                    internet connection</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].Preparetheequipments[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Microphone
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].Preparetheequipments[3].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Webcam
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].Preparetheequipments[4].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Lighting
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].Preparetheequipments[5].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Earpiece
                                </td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">13.SEND THE FEEDBACK-${Records[i].datas[0].Reviewing[1].Sendingfeedback}%</th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Reviewing[0].Sendingfeedback[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Keep
                                    scale question and <br>multiple
                                    choice questions</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Reviewing[0].Sendingfeedback[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>
                                    Keep the language aimple and direct</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Reviewing[0].Sendingfeedback[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Link
                                    the cirtificate of partition
                                    with feedback</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Reviewing[0].Sendingfeedback[3].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Send
                                    the feedback link within 2 hours
                                    of Webinar ends</td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">06.SET UP REGISTRATION-${Records[i].datas[0].Preparing[1].SetupRegistration}%</th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].SetupRegistration[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Registration
                                    tool</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].SetupRegistration[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Registration
                                    fee</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].SetupRegistration[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Clear
                                    concise forms</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].SetupRegistration[3].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Contact
                                    details of host</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].SetupRegistration[4].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Follow-up
                                </td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">14.COLLECTING MATERIALS
                                    -${Records[i].datas[0].Reviewing[1].Collectingthematerialsandsharing}%</th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Reviewing[0].Collectingthematerialsandsharing[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Request
                                    and collect Webinar materials
                                    from speakers</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Reviewing[0].Collectingthematerialsandsharing[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>
                                    Send the certificate of Appreciation
                                    to resource poerson</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Reviewing[0].Collectingthematerialsandsharing[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Share
                                    the materials to participants
                                    through email</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Reviewing[0].Collectingthematerialsandsharing[3].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Share
                                    the materials within 3 days of
                                    completing Webinar</td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">07.MARKETING-${Records[i].datas[0].Preparing[1].Marketing}%</th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].Marketing[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Promotional
                                    materials</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].Marketing[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Promoting
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].Marketing[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Follow-up
                                </td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">15.EVALUATE THE FEEDBACK-${Records[i].datas[0].Reviewing[1].Evaluatethefeedback}%
                                </th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Reviewing[0].Evaluatethefeedback[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Review
                                    each of the feedback point</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Reviewing[0].Evaluatethefeedback[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>
                                    Discuss on the feedback with team</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Reviewing[0].Evaluatethefeedback[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Act
                                    on the feedback</td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">08.DRY RUN-${Records[i].datas[0].Preparing[1].DryRun}%</th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].DryRun[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Introduction
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].DryRun[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Test
                                    the equipment's</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].DryRun[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Agenda
                                    review</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].DryRun[3].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Presentation
                                    check</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].DryRun[4].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Timing
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Preparing[0].DryRun[5].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Review
                                    the recording</td>
                            </tr>
                        </table>
                        <table style="width:100%;text-align: left;">
                            <tr>
                                <th style="font-size:14px;">16.PLAN FOR NEXT WEBINAR-${Records[i].datas[0].Reviewing[1].Planfornextwebinar}%
                                </th>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Reviewing[0].Planfornextwebinar[0].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Review
                                    the strength and weakness</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Reviewing[0].Planfornextwebinar[1].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Give
                                    adequate space</td>
                            </tr>
                            <tr>
                                <td style="font-size:14px;"><i
                                        class="${(Records[i].datas[0].Reviewing[0].Planfornextwebinar[2].Action == true) ? 'green fa fa-check-square-o' : 'red fa fa-times'}"></i>Start
                                    discussing with team members</td>
                            </tr>
                        </table>
                    </div>
                </div>`;

                    let InvoiceNo = Math.floor(Math.random() * 90000) + 10000;;
                    const puppeteer = require('puppeteer');
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.setContent(Html);
                    await page.pdf({
                        path: __dirname + '/BulkPdf/' + t + '/' + InvoiceNo + '.pdf',
                        format: 'A4',
                        printBackground: true
                    });
                    await browser.close();
                }
                var zipFolder = require('zip-folder');
                var path = __dirname + '/archive.zip';
                var zippath = __dirname + '/BulkPdf/' + t;
                zipFolder(zippath, path, function (err) {
                    if (err) {
                        _output.data = path;
                        _output.isSuccess = false;
                        _output.message = "Success";
                        res.send(_output);
                    } else {
                        _output.data = path;
                        _output.isSuccess = true;
                        _output.message = "Success";
                        res.send(_output);
                    }
                });

            }
            else {
                _output.data = "NoRecord";
                _output.isSuccess = true;
                _output.message = "NoRecord";
                res.send(_output);
            }
        });
        //end
    }
    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;
        res.send(_output);
    }

});
router.get('/gettripPdffilePaths/:pdfname', (req, res) => {
    let pdfname = req.params.pdfname;
    let pdf = fs.readFileSync(__dirname + `\\` + pdfname)
    res.writeHead(200, { 'Content-Type': 'application/zip' })
    res.end(pdf, 'binary')
});
router.get('/getImages/:imagename', (req, res) => {
    let imagename = req.params.imagename;
    let imagepath = "/assets/" + imagename;
    let image = fs.readFileSync(__dirname + imagepath)
    res.writeHead(200, { 'Content-Type': 'image/jpeg' })
    res.end(image, 'binary')
})
module.exports = router;