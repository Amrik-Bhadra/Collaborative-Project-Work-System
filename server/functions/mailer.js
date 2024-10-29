const nodemailer = require('nodemailer');
require('dotenv').config();
const senderEmail = process.env.SENDER;
const senderPass = process.env.EMAIL_PASS;

function sendRoomCodeAndPassword(emailIDs, roomCode, password, title) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                // user: 'amk.bhk@gmail.com',
                user: senderEmail,
                pass: senderPass
                // pass: 'usqt mwhe uqed kuyl'
            }
        });

        const mailOptions = {
            // from: 'amk.bhk@gmail.com',
            from:  senderEmail,
            to: emailIDs,
            subject: 'Project Room Code and Password',
            text: `
            Join my project room!
            title: ${title},
            Room Code: ${roomCode},
            Password: ${password}
            `
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                reject('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                resolve({ success: true });
            }
        });
    });
}

module.exports = { sendRoomCodeAndPassword };
