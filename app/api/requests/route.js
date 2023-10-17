import { getRequests } from "../../../functions/requests";
import { withAxiom } from "next-axiom";
import { getCurrentWriter } from "../../../functions/writers";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const GET = withAxiom(async (req) => {
  const type = req.nextUrl.searchParams.get("type");
  if (!["all", "past", "pending"].includes(type)) {
    return new NextResponse("'type' must be one of 'all', 'pending', 'past'", {
      status: 400,
    });
  }

  const user = await currentUser();
  const writer = await getCurrentWriter(user.emailAddresses[0].emailAddress);
  if (writer?.data?.status === "Potential Dev Writer") {
    req.log.error(
      `User ${user.emailAddresses[0].emailAddress} has not onboarded yet`,
      { user: user.emailAddresses[0].emailAddress },
    );
    return new NextResponse("Not allowed", { status: 401 });
  }
  const result = await getRequests(type, user.emailAddresses[0].emailAddress);

  if (!result.error) {
    if (!result.data || result.data.length === 0) {
      req.log.error(
        `User ${user.emailAddresses[0].emailAddress} does not have any request of type ${type}`,
        { user: user.emailAddresses[0].emailAddress },
      );
    }
    return NextResponse.json(result.data);
  }
  req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
  return new NextResponse("Server error", { status: 500 });
});
