import { getAvailableAssignments } from "../../../../functions/assignments";
import { withAxiom } from "next-axiom";
import { getCurrentWriter } from "../../../../functions/writers";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const GET = withAxiom(async (req) => {
  const user = await currentUser();
  const writer = await getCurrentWriter(user.emailAddresses[0].emailAddress);
  if (writer?.data?.status === "Potential Dev Writer") {
    req.log.error(
      `User ${user.emailAddresses[0].emailAddress} has not onboarded yet`,
      { user: user.emailAddresses[0].emailAddress },
    );
    return new NextResponse("Not allowed", { status: 401 });
  }
  const result = await getAvailableAssignments(
    user.emailAddresses[0].emailAddress,
  );

  if (!result.error) {
    if (!result.data) {
      req.log.error(
        `User ${user.emailAddresses[0].emailAddress} has no available assignments`,
        { user: user.emailAddresses[0].emailAddress },
      );
      return new NextResponse("Not found", { status: 404 });
    }
    return NextResponse.json(result.data);
  }
  req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
  return new NextResponse(result.error, { status: 500 });
});
