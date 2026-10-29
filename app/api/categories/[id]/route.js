import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request, { params }) {
  await connectToDatabase();
  const { id } = await params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { message: "دسته بندی پیدا نشد" },
        { status: 400 },
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت دسته‌بندی" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
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
    const { id } = await params;

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

    const category = await Category.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: error?.message || "خطا در ویرایش دسته‌بندی" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "شما وارد نشده‌اید" }, { status: 401 });
  }
  if (!session.user.isAdmin) {
    return NextResponse.json({ message: "دسترسی ندارید" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return NextResponse.json(
        {
          message: `این دسته‌بندی قابل حذف نیست، چون ${productsCount} محصول به آن وابسته است. ابتدا محصولات را حذف یا به دسته‌بندی دیگری منتقل کنید.`,
        },
        { status: 400 },
      );
    }

    await Category.findByIdAndDelete(id);
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "خطا در حذف دسته‌بندی" },
      { status: 500 },
    );
  }
}
