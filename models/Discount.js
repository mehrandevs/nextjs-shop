import mongoose from "mongoose";

const DiscountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      trim: true,
      min: 1,
      max: 100,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Discount ||
  mongoose.model("Discount", DiscountSchema);
