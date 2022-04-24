'use strict'
exports.sendMail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        const nodemailer = require('nodemailer');
        const smtpTransport = require('nodemailer-smtp-transport');
        nodemailer.createTestAccount(() => {
            let transporter;
                transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: "ohmytenniso@gmail.com",
                        pass: "P@$$w0rd23"
                        // user: "support@staybazar.com",
                        // pass: "Stay@2122"
                    },
                    tls: {
                        ciphers: 'SSLv3'
                    }
                });
           
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                // console.log('test',error);
                // console.log('test1',info)

                if (error) {
                    reject(error);
                }
                else {
                    resolve(info);
                }
            });
        })
    })
};