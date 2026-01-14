const {
  getSellerProfile,
  createSeller,
  getAllSellers,
  updateSeller,
  deleteSeller,
  updateSellerStatus,
  getSellerByEmail,
} = require("../service/SellerService");
const Seller = require("../modal/Seller");
const VerificationCode = require("../modal/VerificationCode");
const { createJwt } = require("../util/jwtProvider");
const UserRoles = require("../domain/UserRole");
const { sendLoginOTP } = require("../service/AuthService");

exports.getSellerProfile = async (req, res) => {
  try {
    const profile = await req.seller;
    console.log("profile", profile);

    const jwt = req.headers.authorization.split(" ")[1];
    const seller = await getSellerProfile(jwt);
    res.status(200).json(seller);
  } catch (error) {
    res
      .status(error instanceof Error ? 404 : 500)
      .json({ message: error.message });
  }
};

exports.createSeller = async (req, res) => {
  try {
    const seller = await createSeller(req.body);
    res.status(200).json({ message: "seller created successfully" });
  } catch (error) {
    res
      .status(error instanceof Error ? 404 : 500)
      .json({ message: error.message });
  }
};

exports.getAllSellers = async (req, res) => {
  try {
    const status = req.query.status;
    const sellers = await getAllSellers(status);
    res.status(200).json(sellers);
  } catch (error) {
    res
      .status(error instanceof Error ? 404 : 500)
      .json({ message: error.message });
  }
};

exports.updateSeller = async (req, res) => {
  try {
    const existingSeller = await req.seller;
    const seller = await updateSeller(existingSeller, req.body);
    res.status(200).json(seller);
  } catch (err) {
    res.status(err instanceof Error ? 404 : 500).json({ message: err.message });
  }
};

exports.deleteSeller = async (req, res) => {
  try {
    await deleteSeller(req.params.id);
    res.status(204).json({ message: "seller deleted...." }); // No Content
  } catch (err) {
    res.status(err instanceof Error ? 404 : 500).json({ message: err.message });
  }
};

exports.updateSellerAccountStatus = async (req, res) => {
  try {
    const updatedSeller = await updateSellerStatus(
      req.params.id,
      req.params.status
    );
    res.status(200).json(updatedSeller);
  } catch (error) {
    res
      .status(error instanceof Error ? 404 : 500)
      .json({ message: error.message });
  }
};

// exports.verifyLoginOtp = async (req, res) => {
//   try {
//     const { otp, email } = req.body;

//     const seller = await getSellerByEmail(email);

//     const verificationCode = await VerificationCode.findOne({ email });

//     if (!verificationCode || verificationCode.otp !== otp) {
//       throw new Error("Invalid OTP");
//     }
//     const token = createJwt({ email });

//     const authResponse = {
//       message: "Login Success",
//       jwt: token,
//       role: UserRoles.SELLER,
//     };

//     return res.status(200).json(authResponse);
//   } catch (error) {
//     res
//       .status(error instanceof Error ? 400 : 500)
//       .json({ message: error.message });
//   }
// };

exports.verifyLoginOtp = async (req, res) => {
  try {
    let { otp, email } = req.body;

    if (email.startsWith("signin_")) {
      email = email.replace("signin_", "");
    }

    const seller = await Seller.findOne({
      email,
      role: "ROLE_SELLER",
    });

    if (!seller) {
      throw new Error("Seller not found");
    }

    const verificationCode = await VerificationCode.findOne({ email });

    console.log("DB OTP:", verificationCode?.otp);
    console.log("USER OTP:", otp);

    if (!verificationCode) {
      throw new Error("OTP expired");
    }

    if (String(verificationCode.otp) !== String(otp)) {
      throw new Error("Invalid OTP");
    }

    // 🔥 IMPORTANT FIX
    await VerificationCode.deleteOne({ email });

    const token = createJwt({ email });

    return res.status(200).json({
      message: "Login Success",
      jwt: token,
      role: "ROLE_SELLER",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


exports.sendLoginOtp = async (req, res) => {
  try {
    await sendLoginOTP(req.body.email);
    res.status(200).json({ message: "OTP sent to seller email" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
