import connectToDatabase from "@/app/lib/db";
import Comment from "@/models/Comment";
import Product from "@/models/Product";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const comments = await Comment.find().populate("product").populate("user");

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت نظرات " },
      { status: 500 },
    );
  }
}
