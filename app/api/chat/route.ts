import { createClient } from "@/common/utils/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("messages")
      .select()
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Map DB columns → component format
    const mapped = (data || []).map((row: any) => ({
      id: row.id,
      name: row.user_name,
      email: row.user_email,
      image: row.user_image,
      message: row.content,
      is_show: true,
      is_reply: !!row.replied_to,
      reply_to: row.replied_to ?? "",
      created_at: row.created_at,
    }));

    return NextResponse.json(mapped, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  const supabase = createClient();
  try {
    const body = await req.json();

    // Map component format → DB columns
    const dbData = {
      id: body.id,
      user_id: body.email ?? "anonymous",
      user_name: body.name,
      user_email: body.email,
      user_image: body.image,
      content: body.message,
      created_at: body.created_at,
    };

    const { error } = await supabase.from("messages").insert([dbData]);
    if (error) throw error;

    return NextResponse.json("Data saved successfully", { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
};