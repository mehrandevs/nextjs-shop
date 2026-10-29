import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
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
    totalPrice: { type: Number, required: true },

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
    finalPrice: { type: Number, required: true },

    status: {
      type: String,
      required: true,
      default: "در انتظار",
      enum: ["در انتظار", "در حال پردازش", "تکمیل شده", "لغو شده"],
    },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
