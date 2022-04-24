const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");
const mailOption = require('../../_mailer/mailOptions');
exports.register = async function (req, res, next) {
    var _output = new output();
    try {
        let datas = JSON.parse(req.query.Registerdata);
        let name = datas.Name;
        let email = datas.Email;
        let password = datas.Signinpassword;
        let cpass = datas.cpass;
        let checkemail;
        let currentDate = new Date();
        let datetime = currentDate.toISOString().slice(0, 10);
        if (name == '') { throw { message: "Name is empty" } }
        if (email == '') { throw { message: "Email is empty" } }
        if (password == '') { throw { message: "Password is empty" } }
        if (cpass == '') { throw { message: "Confirm password is empty" } }
        await db_library.execute("SELECT * FROM tblregister where reg_Email='" + email + "'", '', 0).then((value) => {
            checkemail = value;
            if (checkemail.length == 0) {
                var sql = "INSERT INTO tblregister (reg_Name, reg_Email,reg_Password,reg_Confirmpassword,reg_CreateDate,reg_UserType) VALUES ('" + name + "', '" + email + "','" + password + "','" + cpass + "','" + datetime + "','User')";
                db_library.execute(sql, '', 0).then(async (value) => {
                    let val = 1;
                }).catch(error => {
                    _output.data = "Create Fail";
                    _output.isSuccess = false;
                    _output.message = "Create Fail";
                });
                if (val = 1) {
                    _output.data = "Create Successfull";
                    _output.isSuccess = true;
                    _output.message = "Create Successfull";
                }
            }
            else {
                _output.data = "Email id is already Exist";
                _output.isSuccess = false;
                _output.message = "Create Fail";
            }
        })

    }
    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;
    }
    res.send(_output);
}
exports.SinIn = async function (req, res, next) {
    var _output = new output();
    var checkemail = {};
    try {
        let datas = JSON.parse(req.body.SignIndata);
        let Email = datas.Email;
        let pass = datas.Signinpassword;
        if (Email == '') { throw { message: "Email is empty" } }
        if (pass == '') { throw { message: "Password is empty" } }
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let Good = new Date();
        var hours = Good.getHours();
        var minutes = Good.getMinutes();
        var day = Good.getDate();
        var month = Good.getMonth() + 1;
        var year = Good.getFullYear();
        var dayName = days[Good.getDay()];
        var Fullyear = year + '/' + month + '/' + day;
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        var sqlq = "Update tblregister set reg_LastLoginDate='" + Fullyear + "',reg_LastLoginTime='" + strTime + "',reg_LastLoginDay='" + dayName + "' where reg_Email='" + Email + "'";
        await db_library.execute("SELECT * FROM tblregister where reg_Email='" + Email + "'and reg_Password='" + pass + "'", '', 0).then(async (value) => {
            checkemail = value;
            if (checkemail.length == 1) {
                let DatesVa = new Date();
                let AppUseDate = DatesVa.toISOString().slice(0, 10);
                let sqls;
                if (checkemail[0].reg_UserType == 'User') {
                    sqls = "SELECT COUNT(webinar_Id)AS datas FROM tblmywebinar";
                }
                else {
                    sqls = "SELECT COUNT(webinar_Id)AS datas FROM tblmywebinar";
                }
                await db_library.execute("INSERT INTO tblapplogusage (AppLog_RegUserId,AppLog_RegUserType,AppLog_UsageDate)VALUES('" + checkemail[0].reg_Id + "','" + checkemail[0].reg_UserType + "','" + AppUseDate + "')", '', 0).then((value) => {
                });
                await db_library.execute(sqls, '', 0).then((values) => {
                    checkemail[0].WebCount = values[0].datas;
                });
                _output.data = checkemail[0];
                _output.isSuccess = true;
                _output.message = "Login Success";
            }
            else {
                _output.data = checkemail;
                _output.isSuccess = false;
                _output.message = "Invalid User Name Or Password";
            }
        })
        if (checkemail.length == 1) {
            await db_library.execute(sqlq, '', 0).then((val) => {
                var time = val;
            })
        }
    }
    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;
    }
    res.send(_output);
}
exports.FirstTimeLogin = async function (req, res, next) {
    var _output = new output();
    try {
        let FirstLogin = req.body.FirstTimeLogin;
        let email = req.body.Email;
        if (FirstLogin == '') { throw { message: "Email is FirstLogin" } }
        await db_library.execute("update tblregister set reg_FirstLogin='" + FirstLogin + "' where reg_Email='" + email + "'", '', 0).then((value) => {
            _output.data = "success";
            _output.isSuccess = true;
            _output.message = "Update Success";
        })

    }
    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;
    }
    res.send(_output);
}
exports.AppUsage = async function (req, res, next) {
    var _output = new output();
    try {
        let UserId = req.body.UserId;
        let UserType = req.body.UserType;
        let DatesVa = new Date();
        let AppUseDate = DatesVa.toISOString().slice(0, 10);
        let sqls;
        if (UserType == 'User') {
            sqls = "SELECT COUNT(webinar_Id)AS datas FROM tblmywebinar WHERE webinar_RegUserId='" + UserId + "'";
        }
        else {
            sqls = "SELECT COUNT(webinar_Id)AS datas FROM tblmywebinar";
        }
        if (UserId == '') { throw { message: "UserId is required" } }

        await db_library.execute("INSERT INTO tblapplogusage (AppLog_RegUserId,AppLog_RegUserType,AppLog_UsageDate)VALUES('" + UserId + "','" + UserType + "','" + AppUseDate + "')", '', 0).then((value) => {
        });
        db_library.execute(sqls, '', 0).then((value) => {
            _output.data = value;
            _output.isSuccess = true;
            _output.message = 'success';
            res.send(_output);
        });

    }
    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;
        res.send(_output);
    }

}
exports.ForgotEmailOtp = async function (req, res, next) {
    var _output = new output();
    try {
        let Email = JSON.parse(req.query.Email);
        await db_library.execute("SELECT * FROM  tblregister  WHERE reg_Email='" + Email.email + "'", '', 0).then((value) => {
            if (value.length != 0) {
                let RondomNum = Math.floor(Math.random() * 90000) + 10000;
                let _mailOption = new mailOption();
                _mailOption.to = Email.email;
                _mailOption.subject = "WOW Otp";
                _mailOption.html = "Your OTP to Reset Your Password Access is " + RondomNum + "";
                var _mailer = require('../../_mailer/mailer');
                _mailer.sendMail(_mailOption);
                _output.data = value;
                _output.Otp = RondomNum;
                _output.isSuccess = true;
                _output.message = "Opt Send";
            }
            else {
                _output.data = value;
                _output.isSuccess = false;
                _output.message = "Invalid Email";
            }

        })

    }
    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;
    }
    res.send(_output);
}
exports.ForgotPassword = async function (req, res, next) {
    var _output = new output();
    try {
        let Email = JSON.parse(req.query.Email);
        let password = req.query.Pass;
        await db_library.execute("Update tblregister set reg_Password='" + password + "',reg_Confirmpassword='" + password + "'  WHERE reg_Email='" + Email + "'", '', 0).then((value) => {
            if (value.length != 0) {
                _output.data = value;
                _output.isSuccess = true;
                _output.message = "Reset Password";
            }
            else {
                _output.data = value;
                _output.isSuccess = false;
                _output.message = "Failed";
            }

        })

    }
    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;
    }
    res.send(_output);
}
exports.professionalDetail = async function (req, res, next) {
    var _output = new output();
    try {
        if (req.query.usertype == "User" || req.query.usertype == "Admin") {
            let sql = "SELECT DISTINCT reg_Profession,reg_Institution,reg_Department,reg_Purpose,reg_Place FROM tblregister WHERE reg_Profession IS NOT NULL and reg_UserType='" + req.query.usertype + "'";
            await db_library.execute(sql, '', 0).then((value) => {
                if (value.length != 0) {
                    _output.data = value;
                    _output.isSuccess = true;
                    _output.message = "Values";
                }
            })
        }
        else {
            let sql = "SELECT DISTINCT reg_Profession,reg_Institution,reg_Department,reg_Purpose,reg_Place FROM tblregister WHERE reg_Profession IS NOT NULL";
            await db_library.execute(sql, '', 0).then((value) => {
                if (value.length != 0) {
                    _output.data = value;
                    _output.isSuccess = true;
                    _output.message = "Values";
                }
            })
        }
    }

    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;
    }
    res.send(_output);
}
exports.filter = async function (req, res, next) {
    var _output = new output();
    try {

        if (req.query.UserType == "User" || req.query.UserType == "Admin") {
            let data = JSON.parse(req.query.filterdata);
            let profession = "";
            let institution = "";
            let department = "";
            let purpose = "";
            let place = "";
            if (data.profession != '' && data.profession != undefined) {
                data.profession.map(x => { profession += `'${x}'',` });
                profession = profession.endsWith(',') ? Array.from(profession).splice(0, profession.length - 1).join('') : profession;
                profession = "reg_profession IN ('" + profession + "') AND "
            }
            else {
                profession = "(' ' = ' ') AND ";
            }
            if (data.institution != '' && data.institution != undefined) {
                data.institution.map(x => { institution += `'${x}'',` });
                institution = institution.endsWith(',') ? Array.from(institution).splice(0, institution.length - 1).join('') : institution;
                institution = "reg_Institution IN ('" + institution + "') AND "
            }
            else {
                institution = "(' ' = ' ') AND ";
            }
            if (data.department != '' && data.department != undefined) {
                data.department.map(x => { department += `'${x}'',` });
                department = department.endsWith(',') ? Array.from(department).splice(0, department.length - 1).join('') : department;
                department = "reg_Department IN ('" + department + "') AND "
            }
            else {
                department = "(' ' = ' ') AND ";
            }
            if (data.purpose != '' && data.purpose != undefined) {
                data.purpose.map(x => { purpose += `'${x}'',` });
                purpose = purpose.endsWith(',') ? Array.from(purpose).splice(0, purpose.length - 1).join('') : purpose;
                purpose = "reg_Purpose IN ('" + purpose + "') AND "
            }
            else {
                purpose = "(' ' = ' ') AND ";
            }
            if (data.place != '' && data.place != undefined) {
                data.place.map(x => { place += `'${x}'',` });
                place = place.endsWith(',') ? Array.from(place).splice(0, place.length - 1).join('') : place;
                place = "reg_Place IN ('" + place + "')"
            }
            else {
                place = "(' ' = ' ') ";
            }
            let sql = " SELECT rs.reg_UserType AS UserType,rs.reg_Name AS UserName,(SELECT COUNT(1) FROM tblmywebinar AS lw WHERE rs.reg_Id=lw.webinar_RegUserId)AS counts  FROM tblregister AS rs WHERE " + profession + " " + institution + " " + department + " " + purpose + " " + place + "  AND reg_UserType='" + req.query.UserType + "'"
            sql = sql.replace(/'''/g, "'").replace(/''/g, "'");
            await db_library.execute(sql, '', 0).then((value) => {
                if (value.length != 0) {
                    _output.data = value;
                    _output.isSuccess = true;
                    _output.message = "Values";
                }
            })
        }
        else {
            let data = JSON.parse(req.query.filterdata);
            let profession = "";
            let institution = "";
            let department = "";
            let purpose = "";
            let place = "";
            if (data.profession != '' && data.profession != undefined) {
                data.profession.map(x => { profession += `'${x}'',` });
                profession = profession.endsWith(',') ? Array.from(profession).splice(0, profession.length - 1).join('') : profession;
                profession = "reg_profession IN ('" + profession + "') AND "
            }
            else {
                profession = "(' ' = ' ') AND ";
            }
            if (data.institution != '' && data.institution != undefined) {
                data.institution.map(x => { institution += `'${x}'',` });
                institution = institution.endsWith(',') ? Array.from(institution).splice(0, institution.length - 1).join('') : institution;
                institution = "reg_Institution IN ('" + institution + "') AND "
            }
            else {
                institution = "(' ' = ' ') AND ";
            }
            if (data.department != '' && data.department != undefined) {
                data.department.map(x => { department += `'${x}'',` });
                department = department.endsWith(',') ? Array.from(department).splice(0, department.length - 1).join('') : department;
                department = "reg_Department IN ('" + department + "') AND "
            }
            else {
                department = "(' ' = ' ') AND ";
            }
            if (data.purpose != '' && data.purpose != undefined) {
                data.purpose.map(x => { purpose += `'${x}'',` });
                purpose = purpose.endsWith(',') ? Array.from(purpose).splice(0, purpose.length - 1).join('') : purpose;
                purpose = "reg_Purpose IN ('" + purpose + "') AND "
            }
            else {
                purpose = "(' ' = ' ') AND ";
            }
            if (data.place != '' && data.place != undefined) {
                data.place.map(x => { place += `'${x}'',` });
                place = place.endsWith(',') ? Array.from(place).splice(0, place.length - 1).join('') : place;
                place = "reg_Place IN ('" + place + "') "
            }
            else {
                place = "(' ' = ' ') ";
            }
            let sql = " SELECT rs.reg_UserType AS UserType,rs.reg_Name AS UserName,(SELECT COUNT(1) FROM tblmywebinar AS lw WHERE rs.reg_Id=lw.webinar_RegUserId)AS counts  FROM tblregister AS rs WHERE " + profession + " " + institution + " " + department + " " + purpose + " " + place + ""
            sql = sql.replace(/'''/g, "'").replace(/''/g, "'");
            await db_library.execute(sql, '', 0).then((value) => {
                if (value.length != 0) {
                    _output.data = value;
                    _output.isSuccess = true;
                    _output.message = "Values";
                }
            })
        }

    }
    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;
    }
    res.send(_output);
}

exports.getPdfDetails = async function (req, res, next) {
    var _output = new output();
    try {
        let reg_id = req.body.Userid;
        let web_id = req.body.Webinarid;
        await db_library.execute("SELECT web_data FROM tblwebinarstatus WHERE web_RegId=" + reg_id + " AND web_WebinarId=" + web_id + "", '', 0).then((value) => {
            if (value.length != 0) {
                _output.data = value;
                _output.isSuccess = true;
                _output.message = "Successfully";
            }
            else {
                _output.data = 'Empty';
                _output.isSuccess = true;
                _output.message = "Norecord";
            }
        })
        await db_library.execute("SELECT (SELECT  COUNT(webinar_Status) FROM tblmywebinar WHERE webinar_Status='Inprogress' AND webinar_RegUserId='"+ reg_id +"')AS inprogress,(SELECT  COUNT(webinar_Status) FROM tblmywebinar WHERE webinar_Status='Completed' AND webinar_RegUserId='"+ reg_id +"')AS completed FROM tblmywebinar WHERE webinar_RegUserId='"+ reg_id +"' LIMIT 1", '', 0).then((val) => {
            if (val.length != 0) {
                _output.data1 = val;
                _output.isSuccess = true;
                _output.message = "Successfully";
            }
        })
        await db_library.execute("UPDATE tblregister SET download_Count=IFNULL(download_Count, 0)+1 WHERE reg_Id='"+ reg_id +"'", '', 0).then((vals) => {
        })
    }
    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;

    }
    res.send(_output);
}
exports.getPdfshareDetails = async function (req, res, next) {
    var _output = new output();
    try {
        let reg_id = req.body.Userid;
        let web_id = req.body.Webinarid;
        await db_library.execute("SELECT web_data FROM tblwebinarstatus WHERE web_RegId=" + reg_id + " AND web_WebinarId=" + web_id + "", '', 0).then((value) => {
            if (value.length != 0) {
                _output.data = value;
                _output.isSuccess = true;
                _output.message = "Successfully";
            }
            else {
                _output.data = 'Empty';
                _output.isSuccess = true;
                _output.message = "Norecord";
            }
        })
        await db_library.execute("SELECT (SELECT  COUNT(webinar_Status) FROM tblmywebinar WHERE webinar_Status='Inprogress' AND webinar_RegUserId='"+ reg_id +"')AS inprogress,(SELECT  COUNT(webinar_Status) FROM tblmywebinar WHERE webinar_Status='Completed' AND webinar_RegUserId='"+ reg_id +"')AS completed FROM tblmywebinar WHERE webinar_RegUserId='"+ reg_id +"' LIMIT 1", '', 0).then((val) => {
            if (val.length != 0) {
                _output.data1 = val;
                _output.isSuccess = true;
                _output.message = "Successfully";
            }
        })
        await db_library.execute("UPDATE tblregister SET shared_Count=IFNULL(shared_Count, 0)+1 WHERE reg_Id='"+ reg_id +"'", '', 0).then((vals) => {
        })
    }
    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;

    }
    res.send(_output);
}

exports.getsharedetails = async function (req, res, next) {
    var _output = new output();
    try {
        let reg_id = req.body.Userid;
        let web_id = req.body.Webinarid;
        await db_library.execute("SELECT web_data FROM tblwebinarstatus WHERE web_RegId=" + reg_id + " AND web_WebinarId=" + web_id + "", '', 0).then((value) => {
            if (value.length != 0) {
                _output.data = value;
                _output.isSuccess = true;
                _output.message = "Successfully";
            }
            else {
                _output.data = 'Empty';
                _output.isSuccess = true;
                _output.message = "Norecord";
            }
        })
        await db_library.execute("SELECT (SELECT  COUNT(webinar_Status) FROM tblmywebinar WHERE webinar_Status='Inprogress' AND webinar_RegUserId='"+ reg_id +"')AS inprogress,(SELECT  COUNT(webinar_Status) FROM tblmywebinar WHERE webinar_Status='Completed' AND webinar_RegUserId='"+ reg_id +"')AS completed FROM tblmywebinar WHERE webinar_RegUserId='"+ reg_id +"' LIMIT 1", '', 0).then((val) => {
            if (val.length != 0) {
                _output.data1 = val;
                _output.isSuccess = true;
                _output.message = "Successfully";
            }
        })
        await db_library.execute("UPDATE tblregister SET shared_Count=IFNULL(shared_Count, 0)+1 WHERE reg_Id='"+ reg_id +"'", '', 0).then((vals) => {
        })
    }
    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;

    }
    res.send(_output);
}

exports.getdetails = async function (req, res, next) {
    var _output = new output();
    try {
        let reg_id = req.body.Userid;
        let web_id = req.body.Webinarid;
        await db_library.execute("SELECT web_data FROM tblwebinarstatus WHERE web_WebinarId=" + web_id + "", '', 0).then((value) => {
            if (value.length != 0) {
                _output.data = value;
                _output.isSuccess = true;
                _output.message = "Successfully";
            }
            else {
                _output.data = 'Empty';
                _output.isSuccess = true;
                _output.message = "Norecord";
            }
        })
        await db_library.execute("SELECT (SELECT  COUNT(webinar_Status) FROM tblmywebinar WHERE webinar_Status='Inprogress' AND webinar_RegUserId='"+ reg_id +"')AS inprogress,(SELECT  COUNT(webinar_Status) FROM tblmywebinar WHERE webinar_Status='Completed' AND webinar_RegUserId='"+ reg_id +"')AS completed FROM tblmywebinar WHERE webinar_RegUserId='"+ reg_id +"' LIMIT 1", '', 0).then((val) => {
            if (val.length != 0) {
                _output.data1 = val;
                _output.isSuccess = true;
                _output.message = "Successfully";
            }
        })
        await db_library.execute("UPDATE tblregister SET download_Count=IFNULL(download_Count, 0)+1 WHERE reg_Id='"+ reg_id +"'", '', 0).then((vals) => {
        })

    }
    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;

    }
    res.send(_output);
}