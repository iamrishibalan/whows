const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");

exports.AdminRecord = async function (req, res, next) {
    var _output = new output();
    try {
        let datas = req.query.LoginType;
        if (datas == '') { throw { message: "Admin type is empty" } }
        if (datas == 'Admin') {
            await db_library.execute("SELECT rs.reg_UserType AS UserType,rs.reg_Name AS UserName,(SELECT COUNT(1) FROM tblmywebinar AS lw WHERE rs.reg_Id=lw.webinar_RegUserId)AS counts,rs.reg_Id as UserId,rs.reg_UserType as UserType FROM tblregister AS rs", '', 0).then((value) => {
                if (value.length != 0) {
                    _output.data = value;
                    _output.isSuccess = true;
                    _output.message = "success";
                }
            })
        }
        else {
            _output.data = "fail";
            _output.isSuccess = false;
            _output.message = "fail";
        }

    }
    catch (error) {
        _output.data = error;
        _output.isSuccess = false;
        _output.message = "Create Fail";
    }
    res.send(_output);
}
exports.ViewWebinarDetail = async function (req, res, next) {
    var _output = new output();
    try {
        await db_library.execute("SELECT *,(SELECT COUNT(1) FROM tblmywebinar AS lw WHERE reg_Id=lw.webinar_RegUserId)AS counts FROM tblregister INNER JOIN tblmywebinar ON reg_Id=webinar_RegUserId where reg_Id='" + req.query.UserId + "'", '', 0).then((value) => {
            if (value.length != 0) {
                _output.data = value;
                _output.isSuccess = true;
                _output.message = "success";
            }
        });
        await db_library.execute("SELECT * FROM tblregister where reg_Id='" + req.query.UserId + "'", '', 0).then((val) => {
            if (val.length != 0) {
                _output.data1 = val;
                _output.isSuccess = true;
                _output.message = "success";
            }
        })

    }
    catch (error) {
        _output.data = error;
        _output.isSuccess = false;
        _output.message = "Create Fail";
    }
    res.send(_output);
}
exports.ViewWebinarDetail1 = async function (req, res, next) {
    var _output = new output();
    try {
        await db_library.execute("SELECT *,(SELECT COUNT(1) FROM tblmywebinar AS lw WHERE reg_Id=lw.webinar_RegUserId AND lw.Webinar_PlanRate IS NOT NULL)AS counts FROM tblregister INNER JOIN tblmywebinar ON reg_Id=webinar_RegUserId where reg_Id='" + req.query.UserId + "' AND Webinar_PlanRate IS NOT NULL ", '', 0).then((value) => {
            if (value.length != 0) {
                _output.data = value;
                _output.isSuccess = true;
                _output.message = "success";
            }
            else {
                _output.data = 'No FeedBack';
                _output.isSuccess = true;
                _output.message = "success";
            }
        });
        await db_library.execute("SELECT * FROM tblregister where reg_Id='" + req.query.UserId + "'", '', 0).then((val) => {
            if (val.length != 0) {
                _output.data1 = val;
                _output.isSuccess = true;
                _output.message = "success";
            }
        })

    }
    catch (error) {
        _output.data = error;
        _output.isSuccess = false;
        _output.message = "Create Fail";
    }
    res.send(_output);
}


exports.UsedTime = async function (req, res, next) {
    var _output = new output();
    try {
        await db_library.execute(" SELECT IFNULL(UsedTime,0)AS UsedTime FROM tblmywebinar WHERE webinar_Id ='" + req.query.WebinarId + "'",'',0).then((value)=>{
            if (value.length != 0) {
                _output.data = value;
                _output.isSuccess = true;
                _output.message = "success";
            }
        });
        await db_library.execute("UPDATE tblmywebinar SET UsedTime=IFNULL(UsedTime, 0)+1 WHERE webinar_Id='" + req.query.WebinarId + "'", '', 0).then((val) => {
            if (val.length != 0) {
                _output.data1 = val;
                _output.isSuccess = true;
                _output.message = "success";
            }
        })

    }
    catch (error) {
        _output.data = error;
        _output.isSuccess = false;
        _output.message = "Create Fail";
    }
    res.send(_output);

}

exports.CollapseTime = async function (req, res, next) {
    var _output = new output();
    try {
        await db_library.execute(" SELECT IFNULL(CollapsHelp,0)AS CollapsHelp FROM tblmywebinar WHERE webinar_Id ='" + req.query.WebinarId + "'",'',0).then((value)=>{
            if (value.length != 0) {
                _output.data = value;
                _output.isSuccess = true;
                _output.message = "success";
            }
        });
        await db_library.execute("UPDATE tblmywebinar SET CollapsHelp=IFNULL(CollapsHelp, 0)+1 WHERE webinar_Id='" + req.query.WebinarId + "'", '', 0).then((val) => {
            if (val.length != 0) {
                _output.data1 = val;
                _output.isSuccess = true;
                _output.message = "success";
            }
        })

    }
    catch (error) {
        _output.data = error;
        _output.isSuccess = false;
        _output.message = "Create Fail";
    }
    res.send(_output);

}

exports.WSelectTime = async function (req, res, next) {
    var _output = new output();
    try {
        await db_library.execute(" SELECT IFNULL(selectHelp,0)AS selectHelp FROM tblmywebinar WHERE webinar_Id ='" + req.query.WebinarId + "'",'',0).then((value)=>{
            if (value.length != 0) {
                _output.data = value;
                _output.isSuccess = true;
                _output.message = "success";
            }
        });
        await db_library.execute("UPDATE tblmywebinar SET selectHelp=IFNULL(selectHelp, 0)+1 WHERE webinar_Id='" + req.query.WebinarId + "'", '', 0).then((val) => {
            if (val.length != 0) {
                _output.data1 = val;
                _output.isSuccess = true;
                _output.message = "success";
            }
        })

    }
    catch (error) {
        _output.data = error;
        _output.isSuccess = false;
        _output.message = "Create Fail";
    }
    res.send(_output);

}


exports.modalwelcome = async function (req, res, next) {
    var _output = new output();
    try {
        await db_library.execute("SELECT * FROM tblregister",'',0).then((value)=>{
            if (value.length != 0) {
                _output.data = value;
                _output.isSuccess = true;
                _output.message = "success";
            }
        });
       

    }
    catch (error) {
        _output.data = error;
        _output.isSuccess = false;
        _output.message = "Create Fail";
    }
    res.send(_output);
}

// exports.rate1 = async function (req, res, next) {
//     var _output = new output();
//     try {
//         let sql = "UPDATE tblmywebinar SET planrate='" + req.query.data1 + "'  WHERE webinar_Id = '" + req.query.web_id + "'";
//         await db_library.execute(sql,'',0).then((value)=>{
//             if (value.length != 0) {
//                 _output.data = value;
//                 _output.isSuccess = true;
//                 _output.message = "success";
//             }
//         });
       

//     }
//     catch (error) {
//         _output.data = error;
//         _output.isSuccess = false;
//         _output.message = "Create Fail";
//     }
//     res.send(_output);
// }
// exports.rate2 = async function (req, res, next) {
//     var _output = new output();
//     try {
//         let sql = "UPDATE tblmywebinar SET preparerate= '" + req.query.data1 + "' WHERE webinar_Id = '" + req.query.web_id + "'";
//         await db_library.execute(sql,'',0).then((value)=>{
//             if (value.length != 0) {
//                 _output.data = value;
//                 _output.isSuccess = true;
//                 _output.message = "success";
//             }
//         });
       

//     }
//     catch (error) {
//         _output.data = error;
//         _output.isSuccess = false;
//         _output.message = "Create Fail";
//     }
//     res.send(_output);
// }
// exports.rate3 = async function (req, res, next) {
//     var _output = new output();
//     try {
//         let sql = "UPDATE tblmywebinar SET performrate= '" + req.query.data1 + "' WHERE webinar_Id = '" + req.query.web_id + "'";
//         await db_library.execute(sql,'',0).then((value)=>{
//             if (value.length != 0) {
//                 _output.data = value;
//                 _output.isSuccess = true;
//                 _output.message = "success";
//             }
//         });
       

//     }
//     catch (error) {
//         _output.data = error;
//         _output.isSuccess = false;
//         _output.message = "Create Fail";
//     }
//     res.send(_output);
// }
// exports.rate4 = async function (req, res, next) {
//     var _output = new output();
//     try {
//         let sql = "UPDATE tblmywebinar SET reviewrate='" + req.query.data1 + "' WHERE webinar_Id = '" + req.query.web_id + "'";
//         await db_library.execute(sql,'',0).then((value)=>{
//             if (value.length != 0) {
//                 _output.data = value;
//                 _output.isSuccess = true;
//                 _output.message = "success";
//             }
//         });
       

//     }
//     catch (error) {
//         _output.data = error;
//         _output.isSuccess = false;
//         _output.message = "Create Fail";
//     }
//     res.send(_output);
// }
// exports.getdetailsforfeedback = async function (req, res, next) {
//     var _output = new output();
//     try {
//         let sql = "SELECT * FROM tblmywebinar WHERE webinar_Email = '" + req.body.emailid + "'";
//         await db_library.execute(sql,'',0).then((value)=>{
//             if (value.length != 0) {
//                 _output.data = value;
//                 _output.isSuccess = true;
//                 _output.message = "success";
//             }
//         });
       

//     }
//     catch (error) {
//         _output.data = error;
//         _output.isSuccess = false;
//         _output.message = "Create Fail";
//     }
//     res.send(_output);
// }