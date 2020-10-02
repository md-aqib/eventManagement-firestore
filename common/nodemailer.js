const nodeMailer = require("nodemailer");

exports.sendMails = (email, subject) => {
  return new Promise(function (resolve, reject) {
    let transporter = nodeMailer.createTransport({
      service: "Gmail",
      auth: {
        user: "mdaqib0111@gmail.com", // generated ethereal user
        pass: "abc1234@", // generated ethereal password
      },
    });
    let message = {
      text: "",
      from: "Aqib <no-reply>",
      to: email,
      subject: subject,
      html: "",
    };
    console.log(message);
    transporter.sendMail(message, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
