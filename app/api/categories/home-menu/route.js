import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  try {
    const Categories = await Category.find({})
      .sort({ views: -1 })
      .limit(4)
      .select("name ");
    return NextResponse.json(Categories);
  } catch (error) {
    return NextResponse.json(
      { message: "مشکلی در دریافت دسته بندی رخ داده است " },
      { status: 500 },
    );
  }
}
