import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { words } = await request.json();
    
    if (!words || words.length < 3) {
      return NextResponse.json({ error: "Se necesitan 3 palabras" }, { status: 400 });
    }

    const prompt = `Cosmic spirit creature for mobile game, anime art style like Digimon, ethereal celestial being inspired by these concepts: ${words.join(", ")}. The creature should embody these traits visually. Cute but mysterious, body made of galaxy swirls and stardust, glowing friendly eyes, floating ethereal form, vibrant anime illustration with purple and cosmic colors, kawaii cosmic entity. White background, centered composition, game character concept art.`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["image", "text"],
            imageMimeType: "image/png",
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini error:", error);
      return NextResponse.json({ error: "Error generando criatura" }, { status: 500 });
    }

    const data = await response.json();
    
    // Extract image from response
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: { inlineData?: { data: string } }) => p.inlineData?.data);
    
    if (!imagePart?.inlineData?.data) {
      return NextResponse.json({ error: "No se pudo generar la imagen" }, { status: 500 });
    }

    const imageBase64 = imagePart.inlineData.data;
    
    return NextResponse.json({ 
      image: `data:image/png;base64,${imageBase64}`,
      words 
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
