import { requireAuth, users } from "@clerk/nextjs/api";
import { getRequests } from "../../../functions/requests";

export default requireAuth(async (req, res) => {
  const { type } = req.query;
  if (!["all", "past", "pending"].includes(type)) {
    return res
      .status(400)
      .send("'type' must be one of 'all', 'pending', 'past'");
  }

  if (req.method !== "GET") return res.status(400).send("Method not allowed");
  const { userId } = req.auth;
  const user = await users.getUser(userId);
  const result = await getRequests(type, user.emailAddresses[0].emailAddress);

  if (!result.error) {
    if (!result.data) return res.status(404).send("Not found");
    return res.status(200).send(result.data);
  }
  return res.status(500).send("Server error");
});
