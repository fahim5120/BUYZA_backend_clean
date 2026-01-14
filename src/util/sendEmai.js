const nodemailer = require('nodemailer');

exports.sendVerificationEmail=async(to,subject,body)=>{
      const transporter=nodemailer.createTransport({
        service:"gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS 
        }
      })

 const mailOptions = {
        from: process.env.EMAIL_USER,
        to :  [
             process.env.EMAIL_USER, // 👈  my mail
          to                       // 👈 function argument (user mail)
  ],
        subject,
        html:body
    }

     await transporter.sendMail(mailOptions);

}


//phjo ckml datr fkt