import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("category");

  if (!categoryId) {
    return NextResponse.json({ message: "ایدی نامعتبر" }, { status: 404 });
  }
  await connectToDatabase();
  try {
    const relatedProduct = await Product.find({
      category: categoryId,
    })
      .limit(8)
      .select("name price imageUrl");

    if (!relatedProduct) {
      return NextResponse.json({ message: "محصول پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json(relatedProduct, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "خطا در دریافت محصول" },
      { status: 500 },
    );
  }
}
