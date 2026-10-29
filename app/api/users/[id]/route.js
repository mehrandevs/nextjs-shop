import connectToDatabase from "@/app/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const users = await User.findById(id);

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت کاربر " },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "شما وارد نشده‌اید" }, { status: 401 });
  }
  if (!session.user.isAdmin) {
    return NextResponse.json({ message: "دسترسی ندارید" }, { status: 403 });
  }
  await connectToDatabase();
  const { id } = await params;
  try {
    const body = await request.json();

    const toggleIsAdmin = await User.findByIdAndUpdate(
      id,
      { isAdmin: body.isAdmin },
      {
        returnDocument: "after",
      },
    );

    if (!toggleIsAdmin) {
      return NextResponse.json(
        { message: "کاربر با این شناسه پیدا نشد." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: " با موفقیت انجام شد.",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در ویرایش نظر " },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "شما وارد نشده‌اید" }, { status: 401 });
  }
  if (!session.user.isAdmin) {
    return NextResponse.json({ message: "دسترسی ندارید" }, { status: 403 });
  }
  await connectToDatabase();
  const { id } = await params;
  try {
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "با موفقیت حذف شد" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در حذف نظر" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
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
    await User.findByIdAndUpdate(
      id,
      { name, phone, isAdmin },
      {
        returnDocument: "after",
      },
    );
    return NextResponse.json(
      { message: "کاربر  با موفقیت ویرایش شد " },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در ویراش کاربر " },
      { status: 500 },
    );
  }
}
