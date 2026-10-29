import connectToDatabase from "@/app/lib/db";
import Comment from "@/models/Comment";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

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

    const toggleIsActive = await Comment.findByIdAndUpdate(
      id,
      { isActive: body.isActive },
      {
        returnDocument: "after",
      },
    );

    if (!toggleIsActive) {
      return NextResponse.json(
        { message: "نظر با این شناسه پیدا نشد." },
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
    await Comment.findByIdAndDelete(id);
    return NextResponse.json({ message: "با موفقیت حذف شد" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در حذف نظر" }, { status: 500 });
  }
}
