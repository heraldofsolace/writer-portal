import { accept, getSingleOutreach } from "../../../../../functions/outreaches";
import { withAxiom } from "next-axiom";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { assignmentStatuses } from "../../../../../constants/assignment-statuses";

export const POST = withAxiom(async (req, { params }) => {
  const outreachId = params.outreachId;
  const user = await currentUser();
  const result = await getSingleOutreach(
    outreachId,
    user.emailAddresses[0].emailAddress,
  );

  if (!result.error) {
    if (!result.data) {
      req.log.error(
        `User ${user.emailAddresses[0].emailAddress} does not have any outreach with ID ${outreachId}`,
        { user: user.emailAddresses[0].emailAddress },
      );
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (result.data.assignment_status !== assignmentStatuses.assigning) {
      req.log.error(`Assignment is not in assigning stage`, {
        user: user.emailAddresses[0].emailAddress,
      });
      return NextResponse.json({ error: "Not in assigning" }, { status: 403 });
    }
    const _ = await accept(
      outreachId,
      result.data.assignment_id,
      result.data.writer_id,
      result.data.writer_rate,
    );
    return NextResponse.json({ outreachId: _.id });
  }
  req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
  return NextResponse.json({ error: "Server error" }, { status: 500 });
});
