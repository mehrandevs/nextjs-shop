import connectToDatabase from "@/app/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { join } from "path";
import { unlink, writeFile } from "fs/promises";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request, { params }) {
  await connectToDatabase();
  const { id } = await params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "محصول پیدا نشد" }, { status: 400 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت محصول" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
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
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه محصول معتبر نیست" },
        { status: 400 },
      );
    }

    const data = await request.formData();

    await connectToDatabase();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "محصول معتبر نیست" },
        { status: 404 },
      );
    }

    const name = data.get("name");
    const description = data.get("description");
    const price = Number(data.get("price"));
    const stock = Number(data.get("stock"));
    const category = data.get("category");
    const file = data.get("image");

    if (!name || !description || isNaN(price) || isNaN(stock) || !category) {
      return NextResponse.json(
        { message: "تمامی فیلدها اجباری هستند." },
        { status: 400 },
      );
    }

    if (name.trim().length < 3 || name.trim().length > 30) {
      return NextResponse.json(
        { message: "نام محصول باید بین ۳ تا ۳۰ کاراکتر باشد." },
        { status: 400 },
      );
    }

    if (description.trim().length < 3 || description.trim().length > 200) {
      return NextResponse.json(
        { message: "توضیحات محصول باید بین ۳ تا ۲۰۰ کاراکتر باشد." },
        { status: 400 },
      );
    }

    if (price <= 0 || stock < 0) {
      return NextResponse.json(
        { message: "قیمت باید بیشتر از صفر و موجودی نباید منفی باشد." },
        { status: 400 },
      );
    }

    let imageUrl = product.imageUrl;

    if (file instanceof File && file.size > 0) {
      const extension = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${extension}`;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), "public", "uploads");
      const filePath = join(uploadDir, fileName);

      if (product.imageUrl) {
        const oldFilePath = join(process.cwd(), "public", product.imageUrl);

        await unlink(oldFilePath).catch(() => {});
      }

      await writeFile(filePath, buffer);

      imageUrl = `/uploads/${fileName}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description.trim(),
        price,
        stock,
        category,
        imageUrl,
      },
      { new: true },
    );

    return NextResponse.json(
      {
        success: true,
        message: "ویرایش محصول با موفقیت انجام شد.",
        product: updatedProduct,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ویرایش محصول.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
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
    const { id } = await params;

    await connectToDatabase();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه محصول معتبر نیست" },
        { status: 400 },
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "محصول معتبر نیست" },
        { status: 404 },
      );
    }
    const filePath = join(process.cwd(), "public", product.imageUrl);

    await unlink(filePath).catch(() => {
      console.log("خطا در حذف تصویر");
    });

    await Product.findByIdAndDelete(id);
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "خطا در حذف محصول" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
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
    const body = await request.json();
    if (typeof body.stock !== "number") {
      return NextResponse.json(
        { message: "مقدار موجودی نامعتبر است." },
        { status: 400 },
      );
    }

    const updatedProductStock = await Product.findByIdAndUpdate(id, {
      stock: body.stock,
    });

    if (!updatedProductStock) {
      return NextResponse.json(
        { message: "محصولی با این شناسه پیدا نشد." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "ویرایش موجودی محصول با موفقیت انجام شد.",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در ویرایش موجودی " },
      { status: 500 },
    );
  }
}
