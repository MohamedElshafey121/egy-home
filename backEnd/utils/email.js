const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD
  //   }
  // });
  
  // var transporter = nodemailer.createTransport( {
  //   host: "smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "77bacffc0063c9",
  //     pass: "5fe9150255ddf8"
  //   }
  // } );
  
const transporter = nodemailer.createTransport( {
    service: 'gmail',
    auth: {
        user: "mgmohamed11@gmail.com",
        pass:"MoGaMaL@01010981072"
    }
})

  // 2) Define the email options
  const mailOptions = {
    from: 'mgmohamdsbjded11@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail( mailOptions );
  transporter.close();
};

module.exports = sendEmail;
