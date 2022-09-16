import { requireAuth, users } from "@clerk/nextjs/api";
import {
  getSingleRequest,
  deleteRequest,
} from "../../../../functions/requests";

export default requireAuth(async (req, res) => {
  if (!["GET", "DELETE"].includes(req.method))
    return res.status(400).send("Method not allowed");
  const { userId } = req.auth;
  const user = await users.getUser(userId);
  const { requestId } = req.query;
  const result = await getSingleRequest(
    requestId,
    user.emailAddresses[0].emailAddress
  );

  if (!result.error) {
    if (!result.data) return res.status(404).send("Not found");
    if (req.method === "GET") return res.status(200).send(result.data);
    else if (req.method === "DELETE") {
      const deleteResult = await deleteRequest(requestId);
      if (!deleteResult.error) return res.status(200).send("Deleted request");
    }
  }
  return res.status(500).send(result.error);
});
