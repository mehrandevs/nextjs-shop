import connectToDatabase from "@/app/lib/db";
import { sendSms } from "@/app/lib/melipayamak";
import Otp from "@/models/Otp";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";
export async function POST(request) {
  await connectToDatabase();
  try {
    const { name, phone, type } = await request.json();

    if (!type || !["register", "login"].includes(type)) {
      return NextResponse.json(
        { message: "نوع درخواست معتبر نیست " },
        { status: 400 },
      );
    }

    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return NextResponse.json(
        { message: "شماره تلفن وارد شده صحیح نیست" },
        { status: 400 },
      );
    }

    if (type === "register") {
      if (!name || name.trim().length < 3 || name.trim().length > 30) {
        return NextResponse.json(
          { message: "نام و نام خانوادگی باید بین۳ تا ۳۰. کاراکتر باشد" },
          { status: 400 },
        );
      }

      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return NextResponse.json(
          { message: "کاربر با این شماره قبلا ثبت نام کرده است " },
          { status: 400 },
        );
      }
    } else if (type === "login") {
      const user = await User.findOne({ phone });
      if (!user) {
        return NextResponse.json(
          { message: "کاربر با این شماره  ثبت نام نکرده است " },
          { status: 400 },
        );
      }
    }

    const otpCode = crypto.randomInt(100000, 999999).toString();

    // await sendSms(phone, `کد تایید شما ${otpCode}`);
    //ارسال کد

    const otp = await Otp.create({
      phone,
      code: otpCode,
      kind: type === "register" ? 1 : 2,
      expiresAt: new Date(Date.now() + 1 * 60 * 1000),
    });
    return NextResponse.json(
      {
        message: "کد تایید برای شما ارسال شد ",
        expiresAt: otp.expiresAt,
        otpCode,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: "خطا در ساخت Otp" }, { status: 500 });
  }
}
