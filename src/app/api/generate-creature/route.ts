import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { words } = await request.json();
    
    if (!words || words.length < 3) {
      return NextResponse.json({ error: "Se necesitan 3 palabras" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.error("No API key found");
      return NextResponse.json({ error: "API key no configurada" }, { status: 500 });
    }

    const prompt = `Create a cute cosmic spirit creature for a mobile game in anime art style like Digimon. The creature should be inspired by and embody these three concepts: ${words.join(", ")}. 

Style requirements:
- Ethereal celestial being made of galaxy swirls and stardust
- Glowing friendly eyes, mysterious yet approachable
- Floating ethereal form with cosmic energy
- Vibrant anime illustration with purple, blue and cosmic colors
- Kawaii cosmic entity style
- Clean white or transparent background
- Centered composition, game character concept art
- High quality, detailed anime illustration`;

    // Call Gemini API with imagen model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Generate an image: ${prompt}` }]
          }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return NextResponse.json({ 
        error: `Error de API: ${response.status}`,
        details: errorText
      }, { status: 500 });
    }

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data).slice(0, 500));
    
    // Extract image from response
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData?.data);
    
    if (!imagePart?.inlineData?.data) {
      console.error("No image in response:", JSON.stringify(data).slice(0, 1000));
      return NextResponse.json({ 
        error: "No se pudo generar la imagen",
        response: data
      }, { status: 500 });
    }

    const mimeType = imagePart.inlineData.mimeType || "image/png";
    const imageBase64 = imagePart.inlineData.data;
    
    return NextResponse.json({ 
      image: `data:${mimeType};base64,${imageBase64}`,
      words 
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ 
      error: "Error interno",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
