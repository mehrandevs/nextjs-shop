import connectToDatabase from "@/app/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { NextResponse } from "next/server";
export async function POST(request) {
  await connectToDatabase();
  try {
    const { name, phone, code } = await request.json();

    if (!name || !phone || !code) {
      return NextResponse.json(
        { message: "تمامی فیلد ها الزامی می باشد" },
        { status: 400 },
      );
    }

    const otp = await Otp.findOne({ phone, code });
    if (!otp) {
      return NextResponse.json(
        { message: "کد وارد شده صحیح نمی باشد" },
        { status: 400 },
      );
    }
    if (otp.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "کد منقضی شده است" },
        { status: 400 },
      );
    }
    await User.create({
      name,
      phone,
      isActive: true,
      isAdmin: false,
    });
    return NextResponse.json(
      { message: "ثبت نام با موفقیت انجام شد " },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در ساخت کاربر " },
      { status: 500 },
    );
  }
}
