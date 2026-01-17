const nodemailer = require('nodemailer');

exports.sendVerificationEmail=async(to,subject,body)=>{
      const transporter=nodemailer.createTransport({
        service:"gmail",
        auth: {
            user: "muhdfahim786@gmail.com",
            // pass: process.env.EMAIL_PASS
               pass: dlhgrgklfcxljtxa
        }
      })

 const mailOptions = {
        from: "muhdfahim786@gmail.com",
        to : "muhdfahim786@gmail.com",
        subject,
        html:body
    }

     await transporter.sendMail(mailOptions);

}


//phjo ckml datr fkt
