import connectToDatabase from "@/app/lib/db";
import Discount from "@/models/Discount";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectToDatabase();
    const discounts = await Discount.find();
    const now = new Date();

    const updatedDiscounts = await Promise.all(
      discounts.map(async (discount) => {
        if (discount.expirationDate < now && discount.isActive) {
          discount.isActive = false;
          await discount.save();
        }

        return discount;
      }),
    );

    return NextResponse.json(updatedDiscounts);
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت کد های تخفیف " },
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

    const discountData = {
      code,
      discountPercentage,
      expirationDate,
    };

    if (isActive) {
      discountData.isActive = isActive;
    }

    const discounts = await Discount.create(discountData);

    return NextResponse.json(discounts, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در ساخت دسته‌بندی" },
      { status: 500 },
    );
  }
}
