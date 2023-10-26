import { currentUser } from "@clerk/nextjs";
import { getAssignments } from "../../../functions/assignments";
import { withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const GET = withAxiom(async (req) => {
  const type = req.nextUrl.searchParams.get("type");
  const user = await currentUser();
  const result = await getAssignments(
    type,
    user.emailAddresses[0].emailAddress,
  );

  if (!result.error) {
    if (!result.data || result.data.length === 0) {
      req.log.error(
        `User ${user.emailAddresses[0].emailAddress} does not have any assignments of type ${type}`,
        { user: user.emailAddresses[0].emailAddress },
      );
    }
    return NextResponse.json(result.data);
  }
  req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
  return NextResponse.json(result.error, { status: 500 });
});
