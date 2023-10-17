import { getOutreaches } from "../../../functions/outreaches";
import { withAxiom } from "next-axiom";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";

export const GET = withAxiom(async (req) => {
  const type = req.nextUrl.searchParams.get("type");
  if (!["all", "past", "pending"].includes(type)) {
    return new NextResponse("'type' must be one of 'all', 'pending', 'past'", {
      status: 400,
    });
  }

  const user = await currentUser();
  const result = await getOutreaches(type, user.emailAddresses[0].emailAddress);

  if (!result.error) {
    if (!result.data || result.data.length === 0) {
      req.log.error(
        `User ${user.emailAddresses[0].emailAddress} does not have any outreach`,
        { user: user.emailAddresses[0].emailAddress },
      );
    }
    return NextResponse.json(result.data);
  }
  req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
  return new NextResponse("Server error", { status: 500 });
});
