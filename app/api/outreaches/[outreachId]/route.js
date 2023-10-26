import { getSingleOutreach } from "../../../../functions/outreaches";
import { withAxiom } from "next-axiom";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const GET = withAxiom(async (req, { params }) => {
  const outreachId = params.outreachId;
  const user = await currentUser();
  const result = await getSingleOutreach(
    outreachId,
    user.emailAddresses[0].emailAddress,
  );

  if (!result.error) {
    if (!result.data || result.data.length === 0) {
      req.log.error(
        `User ${user.emailAddresses[0].emailAddress} does not have any outreach with ID ${outreachId}`,
        { user: user.emailAddresses[0].emailAddress },
      );
      return new NextResponse("Not found", { status: 404 });
    }
    return NextResponse.json(result.data);
  }
  req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
  return new NextResponse("Server error", { status: 500 });
});
