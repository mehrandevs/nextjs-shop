import connectToDatabase from "@/app/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find();

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت کاربران " },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "شما وارد نشده‌اید" },
        { status: 401 },
      );
    }
    if (!session.user.isAdmin) {
      return NextResponse.json({ message: "دسترسی ندارید" }, { status: 403 });
    }
    await connectToDatabase();
    const { name, phone, isAdmin } = await request.json();

    if (!name || name.trim().length < 3 || name.trim().length > 30) {
      return NextResponse.json(
        { message: "نام و نام خانوادگی باید بین۳ تا ۳۰. کاراکتر باشد" },
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
    await User.create({
      name,
      phone,
      isAdmin,
    });
    return NextResponse.json(
      { message: "کاربر جدید با موفقیت ثبت شد " },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت کاربران " },
      { status: 500 },
    );
  }
}
