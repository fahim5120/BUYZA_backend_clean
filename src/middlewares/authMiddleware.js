const { getSellerByEmail } = require("../service/sellerService");
const { findUserByEmail } = require("../service/userService");
const { getEmailFromJwt } = require("../util/jwtProvider");


exports.authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ message: "Invalid token, authorization failed." });
    }

    const token = authHeader.split(' ')[1]
     if (!token) {
      return res.status(401).json({ message: "Invalid token, authorization failed." });
       }
        let email=getEmailFromJwt(token);
        const user= await findUserByEmail(email)
        req.user=user


        next()
  } catch (error) {
      res.status(500)
      .json({ message: error.message });
  }
};
