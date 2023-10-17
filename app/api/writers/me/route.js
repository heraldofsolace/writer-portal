import { getCurrentWriter } from "../../../../functions/writers";
import { withAxiom } from "next-axiom";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const GET = withAxiom(async (req) => {
  const user = await currentUser();
  const result = await getCurrentWriter(user.emailAddresses[0].emailAddress);

  if (!result.error) {
    if (!result.data) {
      req.log.error(
        `User ${user.emailAddresses[0].emailAddress} does not exist`,
        { user: user.emailAddresses[0].emailAddress },
      );
      return new NextResponse("Not found", { status: 404 });
    }
    return NextResponse.json(result.data);
  }
  req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
  return new NextResponse("Server error", { status: 500 });
});
