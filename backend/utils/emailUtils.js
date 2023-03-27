const mailer = require('../config/mailer');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const sendVerificationEmail = async (to,nom) => {

    const token = jwt.sign({
        email:to,
        type:'VERIFY'
    },process.env.JWT_SECRET,{
        expiresIn: '1h'
    });

    return mailer.sendMail({
        from: process.env.NM_GMAIL,
        to:to,
        subject: 'activer votre compte',
        html: `
            <h3>bonjour ${nom}</h3>
            <p>activez votre compte en cliquant sur le lien ci-dessous</p><br/>
            <p>le lien expire au bout d'une heure</p><br/>
            <a
                href=http://localhost:8080/v1/auth/verify?token=${token}
                style="padding=1rem;background-color=green;"
            >
                activer
            </a>
        `
    }, (err,info) => {
        if(err) {
            console.log(err);
        }
    });
}

const sendResetPasswordEmail = async (to) => {

    const token = jwt.sign({
        email:to,
        type:'RESET'
    },process.env.JWT_SECRET,{
        expiresIn: '1h'
    });

    return mailer.sendMail({
        from: process.env.NM_GMAIL,
        to:to,
        subject: 'reinitialiser votre mot de passe',
        html: `
            <p>vous pouvez reinitialiser votre mot de passe en cliquant sur le lien ci-dessous</p><br/>
            <p>le lien expire au bout d'une heure</p><br/>
            <a
                href=http://localhost:8080/v1/auth/recover?token=${token}
            >
                reinitialiser
            </a>
        `
    }, (err,info) => {
        if(err) {
            console.log(err);
        }
    });
}


module.exports = {
    sendVerificationEmail,
    sendResetPasswordEmail
};