const sgMail = require('@sendgrid/mail');

const sendgridAPIKey = process.env.SENDGRID_API_KEY;
const fromEmail = "vinodevmail@gmail.com";

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: fromEmail,
        subject: `Welcome to My Task app!`,
        text: `${name} thank you for joining to My Task app, let me know how you get along with the app.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: fromEmail,
        subject: "Sorry to see you go",
        text: `Goodbye ${name}, hope to see you again sometime.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}