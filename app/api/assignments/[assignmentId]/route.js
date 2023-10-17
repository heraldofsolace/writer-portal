import { withAxiom } from "next-axiom";
import { currentUser } from "@clerk/nextjs";
import { getCurrentWriter } from "../../../../functions/writers";
import { getSingleAssignment } from "../../../../functions/assignments";
import { NextResponse } from "next/server";

export const GET = withAxiom(async (req, { params }) => {
  const user = await currentUser();
  const writer = await getCurrentWriter(user.emailAddresses[0].emailAddress);

  const assignmentId = params.assignmentId;
  const result = await getSingleAssignment(
    assignmentId,
    user.emailAddresses[0].emailAddress,
  );

  if (!result.error) {
    if (!result.data) {
      req.log.error(
        `${user.emailAddresses[0].emailAddress} does not have an assignment with ID=${assignmentId}`,
        { user: user.emailAddresses[0].emailAddress },
      );
      return new NextResponse("Not found", { status: 404 });
    }
    if (writer?.data?.status === "Potential Dev Writer") {
      if (result.data.outreach_id) {
        req.log.info(
          `User ${user.emailAddresses[0].emailAddress} has not onboarded yet but this is an outreach`,
          { user: user.emailAddresses[0].emailAddress },
        );
        return NextResponse.json(result.data);
      }
      req.log.error(
        `User ${user.emailAddresses[0].emailAddress} has not onboarded yet`,
        { user: user.emailAddresses[0].emailAddress },
      );
      return new NextResponse("Not allowed", { status: 401 });
    }
    return NextResponse.json(result.data);
  }
  req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
  return new NextResponse(result.error, { status: 500 });
});
