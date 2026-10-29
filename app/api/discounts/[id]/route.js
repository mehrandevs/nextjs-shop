import connectToDatabase from "@/app/lib/db";
import Discount from "@/models/Discount";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request, { params }) {
  await connectToDatabase();
  const { id } = await params;

  try {
    const discount = await Discount.findById(id);
    if (!discount) {
      return NextResponse.json(
        { message: "کد تخفیف پیدا نشد" },
        { status: 400 },
      );
    }

    return NextResponse.json(discount, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت کد تخفیف" },
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
    await connectToDatabase();
    const { id } = await params;

    const { code, discountPercentage, expirationDate, isActive } =
      await request.json();

    if (!code || typeof code !== "string" || code.trim() === "") {
      return NextResponse.json(
        { message: "کد تخفیف الزامی می باشد " },
        { status: 400 },
      );
    }
    if (code.length < 3 || code.length > 20) {
      return NextResponse.json(
        { message: "نام دسته بندی باید بین ۳ تا ۲۰ باشد" },
        { status: 400 },
      );
    }
    if (!/^[A-Za-z0-9]+$/.test(code.trim())) {
      return NextResponse.json(
        { message: "کد تخفیف فقط می‌تواند شامل حروف انگلیسی و اعداد باشد" },
        { status: 400 },
      );
    }

    if (!discountPercentage || typeof discountPercentage !== "number") {
      return NextResponse.json(
        { message: "درصد تخفیف الزامی می باشد " },
        { status: 400 },
      );
    }
    if (discountPercentage < 1 || discountPercentage > 100) {
      return NextResponse.json(
        { message: "درصد تخفیف باید بین ۱ تا ۱۰۰ باشد" },
        { status: 400 },
      );
    }
    if (!expirationDate) {
      return NextResponse.json(
        { message: "تاریخ انقضا الزامی می‌باشد" },
        { status: 400 },
      );
    }
    if (isActive) {
      if (typeof isActive !== "boolean") {
        return NextResponse.json(
          { message: "مقدار باید بولین باشد" },
          { status: 400 },
        );
      }
    }
    const discounts = await Discount.findByIdAndUpdate(
      id,
      { code, discountPercentage, expirationDate, isActive },
      { new: true },
    );

    return NextResponse.json(discounts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "خطا در ویرایش دسته‌بندی" },
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
    await Discount.findByIdAndDelete(id);
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در حذف کدتخفیف" },
      { status: 500 },
    );
  }
}
