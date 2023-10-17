import {
  getSingleAssignment,
  accept,
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
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
  if (!writer.data || !assignment.data) {
    req.log.error("Writer or assignment not found", {
      user: user.emailAddresses[0].emailAddress,
    });
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (writer.data.status === "Potential Dev Writer") {
    req.log.error(
      `User ${user.emailAddresses[0].emailAddress} has not onboarded yet`,
      { user: user.emailAddresses[0].emailAddress },
    );
    return NextResponse.json({ error: "Not allowed" }, { status: 401 });
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

  if (assignment.data.status !== assignmentStatuses.assigning) {
    req.log.error("Assignment not in assigning", {
      user: user.emailAddresses[0].emailAddress,
    });
    return NextResponse.json(
      { error: "This article is not in the assigning stage" },
      { status: 403 },
    );
  }
  try {
    // Update writer submitted date
    await accept(assignmentId);
    req.log.info("Successfully accepted", {
      user: user.emailAddresses[0].emailAddress,
    });
    return NextResponse.json({ assignmentId });
  } catch (e) {
    // Handle any errors
    req.log.error(e, { user: user.emailAddresses[0].emailAddress });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
});
