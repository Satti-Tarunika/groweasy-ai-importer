const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const mapHeaders = async (req, res) => {
  try {
    const headers = req.body.headers;

    const prompt = `
You are a CSV column mapper.

Map these CSV headers to GrowEasy CRM fields.

Allowed fields:
- Name
- Email
- Phone
- City

Headers:
${headers.join(", ")}

Return ONLY a JSON object.

Example:
{
  "Full Name":"Name",
  "Email Address":"Email",
  "Mobile Number":"Phone",
  "Location":"City"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text.trim();

    // Remove markdown if Gemini returns ```json
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const mapping = JSON.parse(text);

    res.json({
      success: true,
      mapping,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { mapHeaders };