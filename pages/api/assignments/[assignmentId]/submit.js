import { submit } from "../../../../functions/assignments";

const submitAssignment = async (req, res) => {
  const { assignmentId } = req.query;

  try {
    // Update writer submitted date
    await submit(assignmentId);

    res.statusCode = 204;
    res.end();
  } catch (e) {
    // Handle any errors
    console.log(e);
    res.statusCode = 500;
    res.end("Server error. Something went wrong.");
  }
};

export default submitAssignment;
