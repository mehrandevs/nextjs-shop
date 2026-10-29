import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectToDatabase();
  const { id } = await params;

  try {
    if (!id) {
      return NextResponse.json({ message: "ایدی نامعتبر" }, { status: 404 });
    }
    const product = await Product.findById(id).populate("category");

    if (!product) {
      return NextResponse.json({ message: "محصول پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "خطا در دریافت محصول" },
      { status: 500 },
    );
  }
}
