import { accept } from "../../../../functions/assignments";

const acceptAssignment = async (req, res) => {
  const { assignmentId } = req.query;

  try {
    // Update writer confirmed date
    await accept(assignmentId);

    res.statusCode = 204;
    res.end();
  } catch (e) {
    // Handle any errors
    console.log(e);
    res.statusCode = 500;
    res.end("Server error. Something went wrong.");
  }
};
export default acceptAssignment;
