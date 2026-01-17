const Seller = require("../modal/Seller");


const { sendVerificationEmail } = require("../util/sendEmai");

const { generateOTP } = require("../util/generateOtp");
const User = require("../modal/User");
const bcrypt = require("bcrypt");
const Cart = require("../modal/cart");
const { createJwt } = require("../util/jwtProvider");
const verificationCode = require("../modal/VerificationCode");
const { findUserByEmail } = require("./userService");


// exports.sendLoginOTP = async (email) => {
//   const SIGNING_PREFIX = "signin_";
//   if (email.startsWith(SIGNING_PREFIX)) {
//     const email = email.substring(SIGNING_PREFIX.length);
//     const seller = await getSellerByEmail(email);
//     const user=await findUserByEmail(email)
//     if (!seller && !user ) throw new Error("User not found");
//   }

//   const existingVerificationCode = await verificationCode.findOne({ email });
//   if (existingVerificationCode) {
//     await verificationCode.deleteOne({ email });
//   }

//   const otp = generateOTP();
//   const VerificationCode = new verificationCode({ otp, email });
//   await VerificationCode.save();

//   //send email to user
//   const subject = "Buyza Login/Signup OTP";
//   const body = `Your login OTP is - ${otp} please enter it to complete process`;
//   await sendVerificationEmail(email, subject, body);
// };
exports.sendLoginOTP = async (email, mode = "login") => {
  const SIGNING_PREFIX = "signin_";
  let actualEmail = email;

  // 🔹 SELLER LOGIN
  if (email.startsWith(SIGNING_PREFIX)) {
    actualEmail = email.substring(SIGNING_PREFIX.length);

    if (mode === "login") {
      const seller = await Seller.findOne({ email: actualEmail });
      if (!seller) throw new Error("Seller not found");
    }
  }

  // 🔹 USER LOGIN
  else if (mode === "login") {
    const user = await User.findOne({ email: actualEmail });
    if (!user) throw new Error("User not found");
  }

  // 🔹 SIGNUP → NO CHECK (important)
  // mode === "signup" → skip user existence check

  // 🔹 REMOVE OLD OTP
  await verificationCode.deleteOne({ email: actualEmail });

  // 🔹 GENERATE OTP
  const otp = generateOTP();

  console.log("✅ OTP GENERATED:", otp);
  console.log("📧 LOGIN EMAIL (DB):", actualEmail);
  console.log("📨 OTP SENT TO: muhdfahim786@gmail.com");

  // 🔹 SAVE OTP
  await verificationCode.create({
    otp,
    email: actualEmail,
  });

  // 🔹 SEND MAIL (DEV MODE)
  try {
    await sendVerificationEmail(
      "muhdfahim786@gmail.com",
      "Buyza OTP",
      `OTP for ${actualEmail} is ${otp}`
    );
  } catch (err) {
    console.error("❌ MAIL ERROR:", err.message);
  }
};







exports.createUser = async (req) => {
  const { email, fullName,otp } = req;


  let user = await User.findOne({ email });

  if (user) {
    throw new Error("User already exists with email");
  }

  const VerificationCode=await verificationCode.findOne({email})
 if (!VerificationCode || VerificationCode.otp !== otp) {
            throw new Error("Invalid OTP...");
        }

  user = new User({
    email,
    fullName,
   
  });
  await user.save();
  const cart = new Cart({ user:user._id});
  await cart.save()

  return createJwt({email})
};

// exports.signin=async(req) =>{
//         const { email, otp } = req;

//         const user = await User.findOne({ email });

//         console.log("user : ",user)

//         if (!user) {
//             throw new Error("User not found with email");
//         }

//         const VerificationCode = await verificationCode.findOne({ email });

//         if (!VerificationCode || VerificationCode.otp !== otp) {
//             throw new Error("Invalid OTP");
//         }

 

       

//         return {
//             message: "Login Success",
//             jwt: createJwt({email}),
//             role: user.role
//         };
//     }
exports.signin = async (req) => {
  const { email, otp } = req;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found with email");
  }

  const VerificationCode = await verificationCode.findOne({ email });

  if (!VerificationCode || VerificationCode.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  // ✅ OTP DELETE AFTER SUCCESS
  await verificationCode.deleteOne({ email });

  return {
    message: "Login Success",
    jwt: createJwt({ email }),
    role: user.role,
  };
};



