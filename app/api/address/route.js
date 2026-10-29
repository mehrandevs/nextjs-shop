import connectToDatabase from "@/app/lib/db";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/route";

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "شما وارد نشده اید" }, { status: 401 });
    }

    const user = await User.findById(session.user.id).select("addresses");

    if (!user) {
      return NextResponse.json({ message: "کاربر پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({
      addresses: user.addresses ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت آدرس‌ها" },
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

    const body = await req.json();

    const address = body.address?.trim();
    const receiverName = body.receiverName?.trim();
    const receiverPhone = body.receiverPhone?.trim();
    const postalCode = Number(body.postalCode);

    // اعتبارسنجی سمت سرور
    if (!address || address.length < 10) {
      return NextResponse.json(
        { message: "آدرس باید حداقل ۱۰ کاراکتر باشد" },
        { status: 400 },
      );
    }
    if (!/^\d{10}$/.test(String(body.postalCode))) {
      return NextResponse.json(
        { message: "کد پستی باید ۱۰ رقم باشد" },
        { status: 400 },
      );
    }
    if (!receiverName) {
      return NextResponse.json(
        { message: "نام گیرنده را وارد کنید" },
        { status: 400 },
      );
    }
    if (!/^09\d{9}$/.test(receiverPhone || "")) {
      return NextResponse.json(
        { message: "شماره موبایل معتبر نیست" },
        { status: 400 },
      );
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        $push: {
          addresses: { address, postalCode, receiverName, receiverPhone },
        },
      },
      { new: true, runValidators: true },
    ).select("addresses");

    if (!user) {
      return NextResponse.json({ message: "کاربر پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "آدرس با موفقیت ثبت شد",
        addresses: user.addresses,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ message: "خطا در ثبت آدرس" }, { status: 500 });
  }
}
