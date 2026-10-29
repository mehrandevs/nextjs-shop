import connectToDatabase from "@/app/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile } from "fs/promises";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).populate("category");

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت  محصول ها" },
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
    const data = await request.formData();
    const file = data.get("image");
    if (!file) {
      return NextResponse.json(
        { message: "اپلود تصویر الزامی می باشد  " },
        { status: 400 },
      );
    }
    const name = data.get("name");
    const description = data.get("description");
    const price = data.get("price");
    const stock = data.get("stock");
    const category = data.get("category");

    if (!name || !description || isNaN(price) || isNaN(stock) || !category) {
      return NextResponse.json(
        { message: "تمامی فیلد ها اجباری میباشد " },
        { status: 400 },
      );
    }
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { message: "نام محصول الزامی می باشد " },
        { status: 400 },
      );
    }
    if (name.length < 3 || name.length > 30) {
      return NextResponse.json(
        { message: "نام محصول باید بین ۳ تا ۳۰ باشد" },
        { status: 400 },
      );
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      return NextResponse.json(
        { message: "توضیحات محصول الزامی می باشد " },
        { status: 400 },
      );
    }
    if (description.length < 3 || description.length > 500) {
      return NextResponse.json(
        { message: "توضیحات محصول باید بین ۳ تا ۲۰۰ باشد" },
        { status: 400 },
      );
    }

    if (price <= 0 || stock < 0) {
      return NextResponse.json(
        { message: "قیمت یا موحودی باید بیش از عدد ۱ باشد" },
        { status: 400 },
      );
    }
    const extension = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploader = join(process.cwd(), "public/uploads");

    const filepath = join(uploader, fileName);

    await writeFile(filepath, buffer);

    await connectToDatabase();

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      imageUrl: `/uploads/${fileName}`,
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "خطا در ساخت دسته‌بندی" },
      { status: 500 },
    );
  }
}
