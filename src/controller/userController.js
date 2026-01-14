const Address = require("../modal/Address");
const User = require("../modal/User");



exports.handleErrors = (err, res) => {
    if (err instanceof Error) {
        return res.status(404).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
};


// exports.getUserProfileByJwt = async (req, res) => {
//     try {
        
//         const user = await req.user;
//         return res.status(200).json(user);
//     } catch (err) {
//         handleErrors(err, res);
//     }
// };

exports.getUserProfileByJwt = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("addressess"); // 🔥 THIS IS THE KEY

    return res.status(200).json(user);
  } catch (err) {
    handleErrors(err, res);
  }
};

exports.addUserAddress = async (req, res) => {
  try {
    const user = await req.user; // from authMiddleware
    const addressData = req.body;

    // 1️⃣ create address
    const newAddress = await Address.create(addressData);

    // 2️⃣ push address into user
    user.addressess.push(newAddress._id);
    await user.save();

    // 3️⃣ populate addresses (VERY IMPORTANT)
    const updatedUser = await User.findById(user._id)
      .populate("addressess");

    // 4️⃣ send FULL USER back
    return res.status(200).json(updatedUser);

  } catch (error) {
    return res.status(500).json({
      message: "Failed to add address",
      error: error.message,
    });
  }
};







