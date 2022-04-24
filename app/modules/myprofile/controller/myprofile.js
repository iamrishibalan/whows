const output = require("../../_models/output");
const db_library = require("../../_helpers/db_library");

exports.myprofile = async function (req, res, next) {
    var _output = new output();
    try {
        let datas = JSON.parse(req.body.Profiledata);
        let Profession = datas.Profession;
        let Institution = datas.Institution;
        let Department = datas.Department;
        let Purpose = datas.Purpose;
        let Place = datas.Place;
        let UserId = datas.UserId;
        if (Profession == '') { throw { message: "Profession is empty" } }
        if (Institution == '') { throw { message: "Institution is empty" } }
        if (Department == '') { throw { message: "Department is empty" } }
        if (Purpose == '') { throw { message: "Purpose is empty" } }
        if (Place == '') { throw { message: "Place is empty" } }
        if (UserId == '') { throw { message: "UserId is empty" } }
        var sql = "UPDATE tblregister SET reg_Profession='" + Profession + "',reg_Institution='" + Institution + "',reg_Department='" + Department + "',reg_Purpose='" + Purpose + "',reg_Place='" + Place + "',reg_FirstLogin='1' WHERE reg_Id='" + UserId + "';";
        await db_library.execute(sql, '', 0).then((value) => {
        })
        let selectquery = "select * from tblregister where reg_Id='" + UserId + "'";
        await db_library.execute(selectquery, '', 0).then((val) => {
            if (val.length != 0) {
                _output.data = val;
                _output.isSuccess = true;
                _output.message = "Updated Success";
            }
            else {
                _output.data = val;
                _output.isSuccess = true;
                _output.message = "No record";
            }
        });

    }
    catch (error) {
        _output.data = error.message;
        _output.isSuccess = false;
        _output.message = error.message;
    }
    res.send(_output);
}

exports.getProfileDetail = async function (req, res, next) {
    var _output = new output();
    try {
        let Id = JSON.parse(req.body.Id);
        if (Id == '') { throw { message: "UserId is empty" } }
        if (Id != '' && Id != undefined) {
            await db_library.execute("select * from tblregister where reg_Id='" + Id + "' ", '', 0).then((value) => {
                _output.data = value;
                _output.isSuccess = true;
                _output.message = "success";
            })
        }
        else {
            _output.data = "No record";
            _output.isSuccess = false;
            _output.message = "get Record Fail";
        }
    }
    catch (error) {
        _output.data = "No record";
        _output.isSuccess = false;
        _output.message = "get Record Fail";
    }
    res.send(_output);
}
exports.UpdateProfileDetail1 = async function (req, res, next) {
    var _output = new output();
    try {
        let data = JSON.parse(req.body.datas);
        let ckeck = 0;
        let count=0;
        if (data.reg_Email == '') { throw { message: "Email is empty" } }
        if (data.reg_Password == '') { throw { message: "Password is empty" } }
        if (data.reg_Confirmpassword == '') { throw { message: "Confirmpassword is empty" } }
        if (data.reg_Id == '') { throw { message: "Id is empty" } }
        if (data.reg_Id != '' && data.reg_Id != undefined) {
            // await db_library.execute("SELECT COUNT(reg_Email)AS counts FROM tblregister WHERE reg_Email='" + data.reg_Email + "' ", '', 0).then((data) => {
            //     count = data;
            // })
            if (count == 0) {
                await db_library.execute("Update tblregister set reg_Email='" + data.reg_Email + "',reg_Password='" + data.reg_Password + "',reg_Confirmpassword='" + data.reg_Confirmpassword + "' where reg_Id='" + data.reg_Id + "' ", '', 0).then((value1) => {
                    ckeck = 1;
                });
                if (ckeck == 1) {
                    await db_library.execute("select * from tblregister where reg_Id='" + data.reg_Id + "' ", '', 0).then((value) => {
                        _output.data = value;
                        _output.isSuccess = true;
                        _output.message = "success";
                    })
                }
                else {
                    _output.data = 'fail';
                    _output.isSuccess = false;
                    _output.message = "fail";
                }
            }
            else {
                _output.data = 'Email Already Exixt';
                _output.isSuccess = false;
                _output.message = "fail";
            }

        }
        else {
            _output.data = "No record";
            _output.isSuccess = false;
            _output.message = "get Record Fail";
        }
    }
    catch (error) {
        _output.data = "No record";
        _output.isSuccess = false;
        _output.message = "get Record Fail";
    }
    res.send(_output);
}
exports.UpdateProfileDetail2 = async function (req, res, next) {
    var _output = new output();
    try {
        let data = JSON.parse(req.body.datas);
        let ckeck = 0;
        if (data.reg_Profession == '') { throw { message: "Profession is empty" } }
        if (data.reg_Institution == '') { throw { message: "Institution is empty" } }
        if (data.reg_Department == '') { throw { message: "Department is empty" } }
        if (data.reg_Purpose == '') { throw { message: "Purpose is empty" } }
        if (data.reg_Place == '') { throw { message: "Place is empty" } }
        if (data.reg_Id == '') { throw { message: "Id is empty" } }
        if (data.reg_Id != '' && data.reg_Id != undefined) {

            await db_library.execute("Update tblregister set reg_Profession='" + data.reg_Profession + "',reg_Institution='" + data.reg_Institution + "',reg_Department='" + data.reg_Department + "',reg_Purpose='" + data.reg_Purpose + "',reg_Place='" + data.reg_Place + "' where reg_Id='" + data.reg_Id + "' ", '', 0).then((value1) => {
                ckeck = 1;
            });
            if (ckeck == 1) {
                await db_library.execute("select * from tblregister where reg_Id='" + data.reg_Id + "' ", '', 0).then((value) => {
                    _output.data = value;
                    _output.isSuccess = true;
                    _output.message = "success";
                })
            }
            else {
                _output.data = 'fail';
                _output.isSuccess = false;
                _output.message = "fail";
            }

        }
        else {
            _output.data = "No record";
            _output.isSuccess = false;
            _output.message = "get Record Fail";
        }
    }
    catch (error) {
        _output.data = "No record";
        _output.isSuccess = false;
        _output.message = "get Record Fail";
    }
    res.send(_output);
}
