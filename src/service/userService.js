const User = require('../modal/User');
const jwtProvider = require('../util/jwtProvider');



   

    exports.findUserProfileByJwt=async(jwt)=> {
        const email = jwtProvider.getEmailFromJwt(jwt)
        
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error(`User does not exist with email ${email}`);
        }
        return user;
    }



     exports.findUserByEmail=async(email) =>{
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error(`User does not exist with email ${email}`);
        }
        return user;
    }

  



