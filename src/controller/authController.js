const UserRoles = require("../domain/UserRole");
const { sendLoginOTP, createUser, signin } = require("../service/AuthService");

exports.sentLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    await sendLoginOTP(email);

    return res.status(200).json({
      message: "otp sent successfully",
    });
  } catch (error) {
    console.error("OTP ERROR:", error.message);

    return res.status(400).json({
      message: error.message || "Failed to send OTP",
    });
  }
};


    exports.createUser=async(req, res)=> {
        try {
          
         const jwt=   await createUser(req.body)
         const authResponse={
            jwt,
            message:"User created successfully ",
            role:UserRoles.CUSTOMER
         }

            return res.status(200).json(authResponse);
        } catch (error) {
           res.status(error instanceof Error ?400:500)
           .json({message:error.message})
        }
    }

        exports.signin=async(req, res)=> {
        try {
          
         const authResponse=   await signin(req.body)
     
         console.log(authResponse);
         

            return res.status(200).json(authResponse);
        } catch (error) {
           res.status(error instanceof Error ?400:500)
           .json({message:error.message})
        }
    }

     


