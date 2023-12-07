const nodemailer = require("nodemailer");
const { emailSender, emailPass } = require("../config/vars");

exports.sendEmail = async (recipient: string, code: string) => {
  let transporter = nodemailer.createTransport({
    host: "send.one.com",
    port: 465,
    auth: {
      user: "m.benromdhane@arsela.co",
      pass: "m.benromdhane1",
    },
    tls: { rejectUnauthorized: false },
  });
  let mailOptions = {
    from: "m.benromdhane@arsela.co",
    to: recipient,
    subject: "welcome",
    text: `code ${code}`,
  };
  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
