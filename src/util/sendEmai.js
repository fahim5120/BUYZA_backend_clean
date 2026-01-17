const { Resend } = require("resend");

const resend = new Resend('re_PD7oXqaA_KQvNGCZLvcJwZpW993zh6LJr');

exports.sendVerificationEmail = async (to, subject, body) => {
  try {
    await resend.emails.send({
      from: "Buyza <onboarding@resend.dev>",
      to: "muhdfahim786@gmail.com",
      subject,
      html: `<p>${body}</p>`,
    });

    console.log("✅ OTP MAIL SENT USING RESEND");
  } catch (error) {
    console.error("❌ RESEND MAIL ERROR:", error.message);
    throw error;
  }
};
