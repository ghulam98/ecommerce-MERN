const nodemailer = require("nodemailer")
/**
 * we can send mail in several way for eg https://ethereal.email/, gmail etc
 * here will see steps for send mail with gmail.
 *  1- make new mail and Go to https://myaccount.google.com/security
    2- Enable 2FA
    3- Create App Password for Email
    4- Copy that password (16 characters) into the pass parameter in Nodemailer auth.
 */
exports.sendEmail = async (option)=>{
 
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASS
        }
    })

    const mailOptions = {
        from:process.env.SMTP_MAIL,
        to:option.email,
        subject:option.subject,
        text:option.message,
    }

    await transporter.sendMail(mailOptions);

}

