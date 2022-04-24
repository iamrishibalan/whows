const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");

exports.createWebinar = async function (req, res, next) {
    var _output = new output();
    try {
        let datas = JSON.parse(req.body.newWebinar);
        let webinarTitle = datas.webinarTitle;
        let Date = datas.Date.split('T')[0];
        let Name = datas.Name;
        let Email = datas.Email;
        let Designation = datas.Designation;
        let Igpsc = datas.Igpsc;
        let IT = datas.IT;
        let UserId = datas.UserId;
        let WebinarCount;
        var status = 'Inprogress';
        var percent = 0;
        var webinarType = '';
        let RondomNum = Math.floor(Math.random() * 90000) + 10000;
        if (webinarTitle == '') { throw { message: "webinarTitle is empty" } }
        if (Date == '') { throw { message: "Date is empty" } }
        if (Name == '') { throw { message: "Name is empty" } }
        if (Email == '') { throw { message: "Email is empty" } }
        if (Designation == '') { throw { message: "Designation is empty" } }
        if (Igpsc == '') { throw { message: "Igpsc is empty" } }
        if (IT == '') { throw { message: "IT is empty" } }
        if (UserId == '') { throw { message: "UserId is empty" } }
        let checkUser = 1;
        if (checkUser == 1) {
            let checsql = "SELECT IFNULL(COUNT(webinar_Email),0) as result FROM tblmywebinar where webinar_Email='" + Email + "'";
            let WebType = "SELECT IFNULL(COUNT(reg_Email),0) AS result FROM tblregister WHERE reg_Email='" + Email + "'";
            await db_library.execute(WebType, '', 0).then((val) => {
                let x = val[0].result;
                if (x == 0) {
                    webinarType = 'GuestUser';
                }
                else {
                    webinarType = 'RegisterUser';
                }
                WebinarCount = val;
            })
            await db_library.execute(checsql, '', 0).then((datas) => {
                WebinarCount = datas;
            })
            var sql = "INSERT INTO tblmywebinar (webinar_Title, webinar_Date,webinar_Name,webinar_Email,webinar_Designation,webinar_Igpsc,webinar_IT,webinar_RegUserId,webinar_RandomNum,webinar_Type,webinar_Status,webinar_Percent) VALUES ('" + webinarTitle + "', '" + Date + "','" + Name + "','" + Email + "','" + Designation + "','" + Igpsc + "','" + IT + "','" + UserId + "','" + RondomNum + "','" + webinarType + "','" + status + "','" + percent + "')";
            await db_library.execute(sql, '', 0).then(async (value) => {
            });
            await db_library.execute("SELECT * FROM tblmywebinar where webinar_RandomNum='" + RondomNum + "'", '', 0).then(async (value) => {
                _output.data = value;
                _output.webcount = WebinarCount;
                _output.UserType = 'UserLogin';
                _output.isSuccess = true;
                _output.message = "Create Successfull";
            })
        }

    }
    catch (error) {
        _output.data = "Create Fail";
        _output.isSuccess = false;
        _output.message = "Create Fail";
    }
    res.send(_output);
}
exports.getAllWebinar = async function (req, res, next) {
    var _output = new output();
    try {
        let date = new Date();
        let day = date.getDate();
        let monts = date.getMonth() + 1;
        let year = date.getFullYear();
        let FromDate = year + '-' + monts + '-' + '01';
        let ToDate = year + '-' + monts + '-' + day;
        await db_library.execute("SELECT *,(SELECT COUNT(webinar_Status)FROM tblmywebinar WHERE webinar_RegUserId='" + req.query.UserId + "' AND webinar_Status !='Inprogress') AS Completed,(SELECT COUNT(webinar_Status)FROM tblmywebinar WHERE webinar_RegUserId='" + req.query.UserId + "' AND webinar_Status ='Inprogress') AS Inprogess,(SELECT COUNT(webinar_Download)FROM tblmywebinar WHERE webinar_RegUserId='" + req.query.UserId + "' AND webinar_Download !=NULL) AS download,(SELECT COUNT(webinar_Share)FROM tblmywebinar WHERE webinar_RegUserId='" + req.query.UserId + "' AND webinar_Share !=NULL) AS shared FROM tblmywebinar WHERE webinar_RegUserId='" + req.query.UserId + "'", '', 0).then((value) => {
            _output.data = value;
            _output.isSuccess = true;
            _output.message = "success";
        });
        await db_library.execute("SELECT COUNT(AppLog_RegUserId)AS result FROM tblapplogusage WHERE AppLog_RegUserId='" + req.query.UserId + "' AND CONVERT(AppLog_UsageDate,DATE) >=CONVERT('" + FromDate + "',DATE) AND CONVERT(AppLog_UsageDate,DATE) <=CONVERT('" + ToDate + "',DATE)", '', 0).then((values) => {
            _output.data1 = values;
            _output.isSuccess = true;
            _output.message = "success";
        });

        await db_library.execute("SELECT IFNULL(download_Count,0) as downcount,IFNULL(shared_Count,0) as sharecount FROM tblregister WHERE reg_Id='" + req.query.UserId + "'", '', 0).then((val) => {
            _output.data2 = val;
            _output.isSuccess = true;
            _output.message = "success";
        });
    }
    catch (error) {
        _output.data = "get Record Fail";
        _output.isSuccess = false;
        _output.message = "get Record Fail";
    }
    res.send(_output);
}

exports.DeleteWebinar = async function (req, res, next) {
    var _output = new output();
    try {
        if (req.body.WebinarId == '') { throw { message: "UserId is empty" } }
        if (req.body.Webinartype == '') { throw { message: "UserType is empty" } }
        await db_library.execute("delete from tblmywebinar where webinar_Id='" + req.body.WebinarId + "' ", '', 0).then((value) => {
            _output.data = "delete Success";
            _output.isSuccess = true;
            _output.message = "success";
        })

    }
    catch (error) {
        _output.data = "Delete Fail";
        _output.isSuccess = false;
        _output.message = "get Record Fail";
    }
    res.send(_output);
}
exports.getSingleWebinarDetail = async function (req, res, next) {
    var _output = new output();
    try {
        if (req.body.WebinarId == '') { throw { message: "UserId is empty" } }
        if (req.body.Webinartype == '') { throw { message: "UserType is empty" } }
        await db_library.execute("select * from tblmywebinar where webinar_Id='" + req.body.WebinarId + "' ", '', 0).then((value) => {
            _output.data = value;
            _output.isSuccess = true;
            _output.message = "success";
        });
        await db_library.execute("select * from tblwebinarstatus where web_WebinarId='" + req.body.WebinarId + "' ", '', 0).then((value) => {
            if (value.length != 0) {
                _output.data1 = value;
                _output.isSuccess = true;
                _output.message = "success";
            }
            else {
                _output.data1 = 'No Record';
                _output.isSuccess = true;
                _output.message = "success";
            }

        });

    }
    catch (error) {
        _output.data = "No record";
        _output.isSuccess = false;
        _output.message = "get Record Fail";
    }
    res.send(_output);
}

exports.getAllWebinarTime = async function (req, res, next) {
    var _output = new output();
    try{
        if (req.body.UserId == '') { throw { message: "UserId is empty" } }
        await db_library.execute("SELECT * FROM tblwebinarstatus WHERE web_RegId='" + req.body.UserId + "' ", '', 0).then((value) => {
            _output.data = value;
            _output.isSuccess = true;
            _output.message = "success";
        });
    }  
    catch(error){
        _output.data = "No record";
        _output.isSuccess = false;
        _output.message = "get Record Fail";
    }
    res.send(_output);
}
exports.WebinarStatus = async function (req, res, next) {
    var _output = new output();
    try {
        let CheckOunt;
        if (req.body.WebinarId != undefined && req.body.UserId != undefined) {
            let insert = "insert into tblwebinarstatus(web_data,web_WebinarId,web_RegId)values('" + req.body.wheelData + "','" + req.body.WebinarId + "','" + req.body.UserId + "')"
            let check = "select count(web_WebinarId)as Ccount from tblwebinarstatus where web_WebinarId='" + req.body.WebinarId + "'";
            let update = "update tblwebinarstatus set web_data='" + req.body.wheelData + "' where web_WebinarId='" + req.body.WebinarId + "'";
            let select = "select * from tblwebinarstatus where web_WebinarId='" + req.body.WebinarId + "'";
            await db_library.execute(check, '', 0).then((value) => {
                CheckOunt = value;
            });
            if (CheckOunt[0].Ccount == 0) {
                await db_library.execute(insert, '', 0).then((value) => {
                });
                await db_library.execute(select, '', 0).then((value) => {
                    _output.data = value;
                    _output.isSuccess = true;
                    _output.message = "success";
                })
            }
            else {
                await db_library.execute(update, '', 0).then((value) => {
                });
                await db_library.execute(select, '', 0).then((value) => {
                    _output.data = value;
                    _output.isSuccess = true;
                    _output.message = "success";
                })
            }
        }
        else {

        }

    }
    catch (error) {
        error
        _output.data = "No record";
        _output.isSuccess = false;
        _output.message = "get Record Fail";
    }
    res.send(_output);
}
exports.webinarCompletedStatus = async function (req, res, next) {
    var _output = new output();
    try {
        var status = 'Inprogress';
        if (req.body.Percent == '') { throw { message: "Percent is empty" } }
        if (req.body.Percent > 90) {
            status = 'Completed';
        }
        await db_library.execute("Update tblmywebinar set webinar_Status='" + status + "',webinar_Percent='" + req.body.Percent + "' where webinar_Id='" + req.body.webId + "' ", '', 0).then((value) => {
            _output.data = "Update Success";
            _output.isSuccess = true;
            _output.message = "success";
        })

    }
    catch (error) {
        _output.data = "Update Fail";
        _output.isSuccess = false;
        _output.message = "Fail";
    }
    res.send(_output);
}
exports.SendFeedback = async function (req, res, next) {
    var _output = new output();
    try {
        //console.log(req.body);
        let currentDate = new Date();
        let datetime = currentDate.toISOString().slice(0, 10);
        //if (req.body.planningRatting == '') { throw { message: "planningRatting is empty" } }
        // if (req.body.preparingRatting == '') { throw { message: "preparingRatting is empty" } }
        // if (req.body.performingRatting == '') { throw { message: "performingRatting is empty" } }
        // if (req.body.reviewRatting == '') { throw { message: "reviewRatting is empty" } }
        // if (req.body.RattingComments == '') { throw { message: "RattingComments is empty" } }
        // if (req.body.WebinarID == '') { throw { message: "WebinarID is empty" } }
        let sql = "Update tblmywebinar set Webinar_PlanRate='" + req.body.planningRatting + "',Webinar_PreparRate='" + req.body.preparingRatting + "',Webinar_PerforRate='" + req.body.performingRatting + "',Webinar_ReviewRate='" + req.body.reviewRatting + "',Webinar_RateCmd='" + req.body.RattingComments + "',Webinar_RateDate='" + datetime + "',Webinar_TotalRate='" + req.body.OverAllRating + "',Webinar_Totalusefull='" + req.body.TotalUseFullStar + "' where webinar_Id='" + req.body.WebinarID + "' ";
        await db_library.execute(sql, '', 0).then((value) => {
            _output.data = "Update Success";
            _output.isSuccess = true;
            _output.message = "success";
        })

    }
    catch (error) {
        _output.data = error;
        _output.isSuccess = false;
        _output.message = "Fail";
    }
    res.send(_output);
}