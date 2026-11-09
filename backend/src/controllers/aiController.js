import { generatePropertyDescription } from "../ai/propertyDescription.js";

const writeDescription = async (req, res) => {
  const { propertyName, propertyType, roomType, maximumGuest } = req.body;
  if (!propertyName || !propertyType || !roomType || !Number(maximumGuest)) {
    return res.status(400).json({
      status: "fail",
      message: "Add the property name, type, room type, and guest limit first.",
    });
  }

  try {
    const description = await generatePropertyDescription(req.body);
    return res.status(200).json({ status: "success", data: { description } });
  } catch (error) {
    console.error("Property description generation failed", error);
    return res.status(error.code === "AI_PROVIDER_NOT_CONFIGURED" ? 503 : 502).json({
      status: "fail",
      message: error.code === "AI_PROVIDER_NOT_CONFIGURED"
        ? "AI description is not configured. Please contact the service owner."
        : "Unable to generate a description right now. Please try again.",
    });
  }
};

export { writeDescription };