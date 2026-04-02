import { getGitlabData } from "@/services/gitlab";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await getGitlabData();

    if (response.status === 200) {
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json(
        { error: "Failed to fetch GitLab data" },
        { status: response.status },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
