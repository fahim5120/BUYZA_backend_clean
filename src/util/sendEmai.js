const nodemailer = require("nodemailer");

exports.sendVerificationEmail = async (to, subject, body) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "muhdfahim786@gmail.com",
        pass: "dlhgrgklfcxljtxa", // app password
      },
    });

    const mailOptions = {
      from: "muhdfahim786@gmail.com",
      to: "muhdfahim786@gmail.com", // ✅ ALWAYS YOUR EMAIL
      subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ TEST OTP MAIL SENT TO muhdfahim786@gmail.com");
  } catch (err) {
    console.error("❌ MAIL ERROR:", err.message);
    throw err; // 🔥 VERY IMPORTANT
  }
};
