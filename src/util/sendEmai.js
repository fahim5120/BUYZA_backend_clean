const nodemailer = require("nodemailer");

exports.sendVerificationEmail = async (to, subject, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",        // ✅ ADD
      port: 465,                     // ✅ ADD
      secure: true,                  // ✅ ADD
      auth: {
        user: "muhdfahim786@gmail.com",
        pass: "dlhgrgklfcxljtxa",     // app password
      },
      connectionTimeout: 20000,      // ✅ ADD (20s)
    });

    const mailOptions = {
      from: "Buyza <muhdfahim786@gmail.com>",
      to: "muhdfahim786@gmail.com",  // ✅ ALWAYS YOUR EMAIL
      subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ TEST OTP MAIL SENT TO muhdfahim786@gmail.com");
  } catch (err) {
    console.error("❌ MAIL ERROR:", err.message);
    throw err; // 🔥 VERY IMPORTANT (nee already correct cheythu 👍)
  }
};
