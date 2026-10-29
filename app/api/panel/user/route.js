import connectToDatabase from "@/app/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "لطفا ابتدا وارد حساب شوید" },
        { status: 401 },
      );
    }
    const user = await User.findOne({ _id: session.user.id });
    if (!user) {
      return NextResponse.json({ error: "کاربری پیدا نشد" }, { status: 400 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
