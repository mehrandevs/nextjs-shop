import connectToDatabase from "@/app/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Discount from "@/models/Discount";
import Cart from "@/models/Cart";

export async function POST(req) {
  await connectToDatabase();
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "برای اعمال کد تخفیف باید وارد شوید " },
        { status: 401 },
      );
    }

    const { code } = await req.json();

    if (!code || code.trim() === "") {
      return NextResponse.json(
        { message: "کد تخفیف را وارد کنید " },
        { status: 400 },
      );
    }

    const discount = await Discount.findOne({
      code: code.trim(),
      isActive: true,
    });

    if (!discount) {
      return NextResponse.json(
        { message: "کد تخفیف وارد شده معتبر نیست " },
        { status: 400 },
      );
    }

    if (new Date() > new Date(discount.expirationDate)) {
      return NextResponse.json(
        { message: "کد تخفیف وارد شده منقضی شده است " },
        { status: 400 },
      );
    }
    let cart = await Cart.findOne({ user: session.user.id }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { message: "سبد خرید خالی است " },
        { status: 400 },
      );
    }
    const totalPrice = cart?.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );

    const discountAmount = (totalPrice * discount.discountPercentage) / 100;
    cart.discountPrice = discountAmount;
    await cart.save();
    const updatedCart = await Cart.findOne({ user: session.user.id });
    return NextResponse.json(
      {
        discountPercentage: discount.discountPercentage,
        discountPrice: updatedCart.discountPrice,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "مشکلی در اعمال کد تخفیف پیش امده است " },
      { status: 500 },
    );
  }
}
