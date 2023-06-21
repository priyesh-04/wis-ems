const nodemailer = require('nodemailer');
const fs = require('fs');
const Handelbars = require('handlebars');
const path = require('path');

const EmailSend = (payload) => {
  try {
    const source = fs.readFileSync(
      path.join('./email-templates/', payload.template),
      'utf-8'
    );
    var template = Handelbars.compile(source);

    var options = (locals) => {
      return {
        from: process.env.EMAIL_ID,
        to: payload.email,
        subject: payload.subject,
        html: template(locals),
      };
    };

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    transport.sendMail(options(payload), (error, info) => {
      if (error) {
        console.log(error);
        return false;
      }
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { EmailSend };
