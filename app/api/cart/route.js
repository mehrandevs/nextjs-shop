import connectToDatabase from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "شما وارد نشده اید" }, { status: 401 });
    }

    let cart = await Cart.findOne({ user: session.user.id }).populate(
      "items.product",
    );

    if (!cart) {
      cart = new Cart({ user: session.user.id, items: [] });
      await cart.save();
    }

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: "خطای در سبد خرید رخ داده است " + error },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "شما وارد نشده اید" }, { status: 401 });
    }
    const { productId, quantity } = await req.json();

    if (!productId || isNaN(quantity) || quantity === 0) {
      return NextResponse.json(
        { error: "اطلاعات ورودی ناقض  است" },
        { status: 404 },
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "محصول مورد نظر یافت نشد " },
        { status: 404 },
      );
    }

    let cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      cart = new Cart({ user: session.user.id, items: [] });
    }

    const existingItem = cart.items.find((item) => {
      return item.product.toString() === productId;
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity <= 0) {
        cart.items = cart.items.filter((item) => {
          return item.product.toString() !== productId;
        });
      } else {
        existingItem.quantity = newQuantity;
      }
    } else {
      if (quantity > 0) {
        cart.items.push({ product: productId, quantity });
      } else {
        return NextResponse.json(
          { error: "تعداد محصول باید بیشتر از 0 باشد" },
          { status: 404 },
        );
      }
    }
    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: "خطای در سبد خرید رخ داده است " + error },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "شما وارد نشده اید" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "اطلاعات ورودی ناقص است" },
        { status: 400 },
      );
    }

    let cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      return NextResponse.json(
        { error: "سبد خرید شما خالی است" },
        { status: 404 },
      );
    }

    cart.items = cart.items.filter((item) => {
      return item.product.toString() !== productId;
    });

    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: "خطایی در حذف محصول از سبد خرید رخ داده است" },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "شما وارد نشده اید" }, { status: 401 });
    }
    const { addressId } = await req.json();
    if (!addressId) {
      return NextResponse.json(
        { error: "آدرسی انتخاب نشده است" },
        { status: 400 },
      );
    }
    const user = await User.findById(session.user.id);
    const address = user?.addresses.find((a) => a._id.toString() === addressId);
    if (!address) {
      return NextResponse.json({ error: "آدرس یافت نشد" }, { status: 404 });
    }

    let cart = await Cart.findOne({ user: session.user.id });
    cart.shippingAddress = {
      address: address.address,
      postalCode: address.postalCode,
      receiverName: address.receiverName,
      receiverPhone: address.receiverPhone,
    };

    await cart.save();

    return NextResponse.json(
      { message: "آدرس با موفقیت ثبت شد " },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "خطایی ثبت ادرس" }, { status: 500 });
  }
}
