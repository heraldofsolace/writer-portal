import {
  deleteRequest,
  getSingleRequest,
} from "../../../../functions/requests";
import { withAxiom } from "next-axiom";
import { getCurrentWriter } from "../../../../functions/writers";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const GET = withAxiom(async (req, { params }) => {
  const user = await currentUser();
  const writer = await getCurrentWriter(user.emailAddresses[0].emailAddress);
  if (writer?.data?.status === "Potential Dev Writer") {
    req.log.error(
      `User ${user.emailAddresses[0].emailAddress} has not onboarded yet`,
      { user: user.emailAddresses[0].emailAddress },
    );
    return new NextResponse("Not allowed", { status: 401 });
  }
  const requestId = params.requestId;
  const result = await getSingleRequest(
    requestId,
    user.emailAddresses[0].emailAddress,
  );

  if (!result.error) {
    if (result.data.length === 0) {
      req.log.error(
        `User ${user.emailAddresses[0].emailAddress} does not have any request with ID=${requestId}`,
        { user: user.emailAddresses[0].emailAddress },
      );
      return new NextResponse("Not found", { status: 404 });
    }
    return NextResponse.json(result.data);
  }
  req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
  return new NextResponse(result.error, { status: 500 });
});

export const DELETE = withAxiom(async (req, { params }) => {
  const user = await currentUser();
  const writer = await getCurrentWriter(user.emailAddresses[0].emailAddress);
  if (writer?.data?.status === "Potential Dev Writer") {
    req.log.error(
      `User ${user.emailAddresses[0].emailAddress} has not onboarded yet`,
      { user: user.emailAddresses[0].emailAddress },
    );
    return new NextResponse("Not allowed", { status: 401 });
  }
  const requestId = params.requestId;
  const result = await getSingleRequest(
    requestId,
    user.emailAddresses[0].emailAddress,
  );

  if (!result.error) {
    if (result.data.length === 0) {
      req.log.error(
        `User ${user.emailAddresses[0].emailAddress} does not have any request with ID=${requestId}`,
        { user: user.emailAddresses[0].emailAddress },
      );
      return new NextResponse("Not found", { status: 404 });
    }
    req.log.info("Deleting request", {
      user: user.emailAddresses[0].emailAddress,
    });
    const deleteResult = await deleteRequest(requestId);
    req.log.info(deleteResult, {
      user: user.emailAddresses[0].emailAddress,
    });
    if (!deleteResult.error) return new NextResponse("Deleted request");
  }
  req.log.error(result.error, { user: user.emailAddresses[0].emailAddress });
  return new NextResponse(result.error, { status: 500 });
});
