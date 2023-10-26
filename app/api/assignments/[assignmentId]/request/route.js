import { createRequest } from "../../../../../functions/requests";
import { getSingleAssignment } from "../../../../../functions/assignments";
import { assignmentStatuses } from "../../../../../constants/assignment-statuses";
import { getCurrentWriter } from "../../../../../functions/writers";
import { withAxiom } from "next-axiom";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = withAxiom(async (req, { params }) => {
  const assignmentId = params.assignmentId;
  const user = await currentUser();
  const assignmentData = await getSingleAssignment(assignmentId);
  const writerData = await getCurrentWriter(
    user.emailAddresses[0].emailAddress,
  );

  if (assignmentData.error || writerData.error) {
    req.log.error("Error in writer or assignment", {
      user: user.emailAddresses[0].emailAddress,
      error: writerData.error ? writerData : assignmentData,
    });
    return new NextResponse("Server error", { status: 500 });
  }

  if (!assignmentData.data || !writerData.data) {
    req.log.error("Writer or assignment not found", {
      user: user.emailAddresses[0].emailAddress,
    });
    return new NextResponse("Not found", { status: 404 });
  }

  if (writerData.data.status === "Potential Dev Writer") {
    req.log.error(
      `User ${user.emailAddresses[0].emailAddress} has not onboarded yet`,
      { user: user.emailAddresses[0].emailAddress },
    );
    return new NextResponse("Not allowed", { status: 401 });
  }

  if (assignmentData.data.status !== assignmentStatuses.assigning) {
    req.log.error("Assignment not in assigning", {
      user: user.emailAddresses[0].emailAddress,
    });
    return new NextResponse("Forbidden", { status: 403 });
  }

  const result = await createRequest(assignmentId, writerData.data.id);

  if (!result.error) {
    req.log.info("Successfully requested", {
      user: user.emailAddresses[0].emailAddress,
    });
    return NextResponse.json({ requestId: result.data[0].id });
  }
  req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
  return new NextResponse("Server error", { status: 500 });
});
