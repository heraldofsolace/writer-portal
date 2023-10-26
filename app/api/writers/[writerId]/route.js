import { getWriter } from "../../../../functions/writers";
import { withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const GET = withAxiom(async (req, { params }) => {
  const writerId = params.writerId;
  const result = await getWriter(writerId);

  if (!result.error) {
    if (!result.data) {
      req.log.error(`No writer found with ID=${writerId}`);
      return new NextResponse("Not found", { status: 404 });
    }
    return NextResponse.json(result.data);
  }
  req.log.error(result.error);
  return new NextResponse("Server error", { status: 500 });
});
