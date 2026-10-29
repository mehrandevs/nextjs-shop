import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "user name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "user phone is required"],
      trim: true,
      unique: true,
    },
    addresses: [
      {
        address: {
          type: String,
          required: [true, "address is required"],
          trim: true,
        },
        postalCode: {
          type: Number,
          required: [true, "postal code is required"],
        },
        receiverName: {
          type: String,
          required: [true, "receiver name is required"],
          trim: true,
        },
        receiverPhone: {
          type: String,
          required: [true, "receiver phone is required"],
          trim: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
