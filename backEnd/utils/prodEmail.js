const nodemailer = require("nodemailer");

module.exports = class Email {
  //   constructor(user, url ) {
  constructor(user) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    // this.url = url;
    this.from = `Egy Home <egy.home.sup@gmail.com>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "egy.home.sup@gmail.com",
        pass: "ilovemylife8370244",
      },
    });
    /** Stop following ones */
    // if (process.env.NODE_ENV === "production") {
    //   // Sendgrid
    //   return nodemailer.createTransport({
    //     service: "SendGrid",
    //     auth: {
    //       user: process.env.SENDGRID_USERNAME,
    //       pass: process.env.SENDGRID_PASSWORD,
    //     },
    //   });
    // }
  }

  // Send the actual email
  async send(subject, message) {
    // 1) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: `Hi ${this.firstName} 
       ${message}`,
    };

    // 2) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("مرحباً بك فى إيجى هوم!", "نحن سعداء بانضمامك إلينا");
  }

  async sendPasswordReset() {
    await this.send(
      "EgyHome password reset ",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};
