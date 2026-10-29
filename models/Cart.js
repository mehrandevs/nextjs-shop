import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
      },
    ],

    shippingAddress: {
      address: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      receiverName: { type: String, trim: true },
      receiverPhone: { type: String, trim: true },
    },
    shippingCost: { type: Number, default: 150000 },

    discountPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
