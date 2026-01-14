const jwt = require("jsonwebtoken");
const secretKey =process.env.JWT_SECRET
  

exports.createJwt = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: "24h" });
};

exports.getEmailFromJwt = (token) => {
  try {
    const decodedToken = jwt.verify(token, secretKey);
    return decodedToken.email;
  } catch (error) {
    throw new Error("Invalid token");
  }
};


exports.verifyJwt=(token)=>{
    try {
         return jwt.verify(token,secretKey);
    } catch (error) {
          throw new Error('Invalid token');
    }
}
