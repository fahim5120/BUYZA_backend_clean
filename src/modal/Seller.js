const { default: mongoose } = require("mongoose");
const UserRoles = require("../domain/UserRole");
const AccountStatus = require("../domain/AccountStatus");

const sellerSchema = new mongoose.Schema(
  {
    sellerName: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    businessDetails: {
      businessName: {
        type: String,
      },
      businessEmail: {
        type: String,
      },
      businessMobile: {
        type: String,
      },
      businessAddress: {
        type: String,
      },
    },
    bankDetails: {
      //cash withdraw chyyan
      accountNumber: {
        type: String,
      },
      accountHolderName: {
        type: String,
      },
      ifscCode: {
        type: String,
      },
    },
    pickupAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    GSTIN: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [UserRoles.SELLER], // Use the USER_ROLE enum
      default: UserRoles.SELLER,
    },
    accountStatus: {
      type: String,
      enum: [
        AccountStatus.PENDING_VERIFICATION,
        AccountStatus.ACTIVE,
        AccountStatus.SUSPENDED,
        AccountStatus.DEACTIVATED,
        AccountStatus.BANNED,
        AccountStatus.CLOSED,
      ],
      default: AccountStatus.PENDING_VERIFICATION,
    },
  },
  { timestamps: true }
);

const Seller=mongoose.model("Seller",sellerSchema)
module.exports=Seller
