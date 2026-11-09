import getGroqClient from "./aiClient.js";

const systemPrompt = `Write a natural, professional vacation-rental description using only the supplied facts. Do not invent amenities, views, distances, or nearby attractions. Use three or four complete sentences, mention the location naturally, and return only the description.`;

const formatAmenities = (amenities = []) =>
  amenities.map((amenity) => amenity.name || amenity).filter(Boolean).join(", ") || "Not provided";

const generatePropertyDescription = async (property) => {
  const address = property.address || {};
  const propertyInfo = [
    `Name: ${property.propertyName}`,
    `Property type: ${property.propertyType || "Not provided"}`,
    `Room type: ${property.roomType || "Not provided"}`,
    `Maximum guests: ${property.maximumGuest || "Not provided"}`,
    `Amenities: ${formatAmenities(property.amenities)}`,
    `Location: ${[address.area, address.city, address.state].filter(Boolean).join(", ") || "Not provided"}`,
    `Price per night: ${property.price || "Not provided"}`,
    `Host information: ${property.extraInfo || "Not provided"}`,
  ].join("\n");

  const completion = await getGroqClient().chat.completions.create({
    model: "openai/gpt-oss-120b",
    max_tokens: 500,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: propertyInfo },
    ],
  });

  const description = completion.choices[0]?.message?.content?.trim();
  if (!description) {
    throw new Error("The AI provider returned an empty description");
  }
  return description;
};

export { generatePropertyDescription };