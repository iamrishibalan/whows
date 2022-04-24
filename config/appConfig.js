"use strict";
const prefix = '';
module.exports = {
    EXPIRES: 86400,
    JWT_SECRET_KEY: 'OhmyTennis',
    PREFIX: prefix,
    MailTemplate: {
        "Register": 1,
        "ForgotPassword": 2,
        "CoachAcceoptance": 3,
        "BookingSuccess": 4,
        "PasswordReset": 5,
        "BookingCancel": 6,
        "PaymentSuccess":7,
        "Reschedule":8,
        "UserCancel":9
    },
    AUTH_URL: [
        prefix + '/adminAuthenticate',
        prefix + '/forgotPassword',
        prefix + '/'
    ],
    CROS_OPTIONS: {
        origin: ["http://localhost:4200","http://localhost:58259"],
        allowedHeaders: [
            "Content-Type",
            "Access-Control-Allow-Origin",
            "Authorization",
            "ud",
            "X-Requested-With",
            "Access-Control-Allow-Credentials",
            "Access-Control-Max-Age",
            "Access-Control"
        ],
        EXPOSEDHEADERS: ["Authorization"],
        ALLOWEDMETHODS: ["GET,POST"],
        credentials: true,
    },
    isDefault: true
};