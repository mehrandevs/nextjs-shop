import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectToDatabase();
    const category = await Category.find({});

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت دسته‌بندی‌ها" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
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
    const body = await request.json();

    if (
      !body.name ||
      typeof body.name !== "string" ||
      body.name.trim() === ""
    ) {
      return NextResponse.json(
        { message: "نام دسته بتدی الزامی می باشد " },
        { status: 400 },
      );
    }
    if (body.name.length < 3 || body.name.length > 30) {
      return NextResponse.json(
        { message: "نام دسته بندی باید بین ۳ تا ۳۰ باشد" },
        { status: 400 },
      );
    }

    const category = await Category.create(body);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "خطا در ساخت دسته‌بندی" },
      { status: 500 },
    );
  }
}
