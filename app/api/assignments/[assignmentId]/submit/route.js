import {
  getSingleAssignment,
  submit,
} from "../../../../../functions/assignments";
import { getCurrentWriter } from "../../../../../functions/writers";
import { assignmentStatuses } from "../../../../../constants/assignment-statuses";
import { withAxiom } from "next-axiom";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = withAxiom(async (req, { params }) => {
  const assignmentId = params.assignmentId;
  const user = await currentUser();

  const assignment = await getSingleAssignment(assignmentId);
  const writer = await getCurrentWriter(user.emailAddresses[0].emailAddress);

  if (writer.error || assignment.error) {
    req.log.error("Error in writer or assignment", {
      user: user.emailAddresses[0].emailAddress,
      error: writer.error ? writer : assignment,
    });
    return new NextResponse("Server error", { status: 500 });
  }
  if (!writer.data || !assignment.data) {
    req.log.error("Writer or assignment not found", {
      user: user.emailAddresses[0].emailAddress,
    });
    return new NextResponse("Not found", { status: 404 });
  }

  if (assignment.data.writer[0] !== writer.data.id) {
    req.log.error("Writer doesn't have permission to accept assignment", {
      user: user.emailAddresses[0].emailAddress,
    });
    return NextResponse.json(
      { error: "This assignment is not assigned to you" },
      { status: 403 },
    );
  }

  if (assignment.data.status !== assignmentStatuses.writing) {
    req.log.error("Assignment not in assigning", {
      user: user.emailAddresses[0].emailAddress,
    });
    return NextResponse.json(
      { error: "This article is not in the writing stage" },
      { status: 403 },
    );
  }

  try {
    // Update writer submitted date
    await submit(assignmentId);
    req.log.info("Successfully submitted", {
      user: user.emailAddresses[0].emailAddress,
    });
    return NextResponse.json({ assignmentId });
  } catch (e) {
    // Handle any errors
    req.log.error(e, { user: user.emailAddresses[0].emailAddress });
    return new NextResponse("Server error", { status: 500 });
  }
});
