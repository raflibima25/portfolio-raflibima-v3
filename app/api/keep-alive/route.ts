import { createClient } from "@/common/utils/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const supabase = createClient();
  try {
    // Lakukan query ringan ke tabel 'messages' untuk memastikan aktivitas (mencegah pause 7 hari)
    const { data, error } = await supabase
      .from("messages")
      .select("id")
      .limit(1);

    if (error) throw error;

    return NextResponse.json(
      { status: "success", message: "Supabase kept alive" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
};
