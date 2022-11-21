const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail = (name, email) => {
    sgMail.send({
        to: email,
        from: "apjp569@gmail.com",
        subject: "Thanks for joining us!",
        text: `Welcome to the app ${name} , Let me know how you get along with the app.`
    })
}

const sendCancelationMail  = (name, email) => {
    sgMail.send({
        to: email,
        from: "apjp569@gmail.com",
        subject: "Sorry to see you go!",
        text: `Goodbye ${name}, I hope to see you back sometime soon.`
    })
}

module.exports = {sendWelcomeMail , sendCancelationMail}
