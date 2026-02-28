import { NextRequest, NextResponse } from "next/server";

// Pre-generated creature images as fallback (base64 SVG)
const CREATURE_TEMPLATES = [
  // Purple cosmic creature
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><radialGradient id="g1" cx="30%" cy="30%"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="100%" stop-color="#8b5cf6"/></radialGradient><filter id="glow"><feGaussianBlur stdDeviation="3"/></filter></defs><circle cx="100" cy="100" r="80" fill="url(#g1)" filter="url(#glow)"/><ellipse cx="100" cy="110" rx="50" ry="40" fill="url(#g1)"/><circle cx="100" cy="70" r="40" fill="url(#g1)"/><ellipse cx="80" cy="65" rx="10" ry="12" fill="white"/><ellipse cx="120" cy="65" rx="10" ry="12" fill="white"/><circle cx="82" cy="67" r="5" fill="#1e1b4b"/><circle cx="122" cy="67" r="5" fill="#1e1b4b"/><circle cx="84" cy="64" r="2" fill="white"/><circle cx="124" cy="64" r="2" fill="white"/><path d="M 85 85 Q 100 95 115 85" stroke="#1e1b4b" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="60" cy="40" r="3" fill="#fcd34d"/><circle cx="140" cy="50" r="2" fill="#fcd34d"/><circle cx="50" cy="120" r="2" fill="#fcd34d"/></svg>`,
  
  // Blue cosmic creature
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><radialGradient id="g2" cx="30%" cy="30%"><stop offset="0%" stop-color="#93c5fd"/><stop offset="100%" stop-color="#3b82f6"/></radialGradient><filter id="glow2"><feGaussianBlur stdDeviation="3"/></filter></defs><circle cx="100" cy="100" r="80" fill="url(#g2)" filter="url(#glow2)"/><ellipse cx="100" cy="110" rx="50" ry="40" fill="url(#g2)"/><circle cx="100" cy="70" r="40" fill="url(#g2)"/><ellipse cx="80" cy="65" rx="10" ry="12" fill="white"/><ellipse cx="120" cy="65" rx="10" ry="12" fill="white"/><circle cx="82" cy="67" r="5" fill="#1e3a5f"/><circle cx="122" cy="67" r="5" fill="#1e3a5f"/><circle cx="84" cy="64" r="2" fill="white"/><circle cx="124" cy="64" r="2" fill="white"/><path d="M 85 85 Q 100 95 115 85" stroke="#1e3a5f" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="65" cy="40" rx="6" ry="12" fill="#60a5fa" transform="rotate(-15 65 40)"/><ellipse cx="135" cy="40" rx="6" ry="12" fill="#60a5fa" transform="rotate(15 135 40)"/></svg>`,
  
  // Pink cosmic creature
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><radialGradient id="g3" cx="30%" cy="30%"><stop offset="0%" stop-color="#f9a8d4"/><stop offset="100%" stop-color="#ec4899"/></radialGradient><filter id="glow3"><feGaussianBlur stdDeviation="3"/></filter></defs><circle cx="100" cy="100" r="80" fill="url(#g3)" filter="url(#glow3)"/><ellipse cx="100" cy="110" rx="50" ry="40" fill="url(#g3)"/><circle cx="100" cy="70" r="40" fill="url(#g3)"/><ellipse cx="80" cy="65" rx="10" ry="12" fill="white"/><ellipse cx="120" cy="65" rx="10" ry="12" fill="white"/><circle cx="82" cy="67" r="5" fill="#831843"/><circle cx="122" cy="67" r="5" fill="#831843"/><circle cx="84" cy="64" r="2" fill="white"/><circle cx="124" cy="64" r="2" fill="white"/><path d="M 85 85 Q 100 95 115 85" stroke="#831843" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M 100 25 L 95 10 L 100 20 L 105 10 L 100 25" fill="#fcd34d"/></svg>`,
  
  // Green cosmic creature
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><radialGradient id="g4" cx="30%" cy="30%"><stop offset="0%" stop-color="#86efac"/><stop offset="100%" stop-color="#22c55e"/></radialGradient><filter id="glow4"><feGaussianBlur stdDeviation="3"/></filter></defs><circle cx="100" cy="100" r="80" fill="url(#g4)" filter="url(#glow4)"/><ellipse cx="100" cy="110" rx="50" ry="40" fill="url(#g4)"/><circle cx="100" cy="70" r="40" fill="url(#g4)"/><ellipse cx="80" cy="65" rx="10" ry="12" fill="white"/><ellipse cx="120" cy="65" rx="10" ry="12" fill="white"/><circle cx="82" cy="67" r="5" fill="#14532d"/><circle cx="122" cy="67" r="5" fill="#14532d"/><circle cx="84" cy="64" r="2" fill="white"/><circle cx="124" cy="64" r="2" fill="white"/><path d="M 85 85 Q 100 95 115 85" stroke="#14532d" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="55" cy="55" r="4" fill="#fcd34d"/><circle cx="145" cy="55" r="3" fill="#fcd34d"/></svg>`,
  
  // Orange cosmic creature
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><radialGradient id="g5" cx="30%" cy="30%"><stop offset="0%" stop-color="#fdba74"/><stop offset="100%" stop-color="#f97316"/></radialGradient><filter id="glow5"><feGaussianBlur stdDeviation="3"/></filter></defs><circle cx="100" cy="100" r="80" fill="url(#g5)" filter="url(#glow5)"/><ellipse cx="100" cy="110" rx="50" ry="40" fill="url(#g5)"/><circle cx="100" cy="70" r="40" fill="url(#g5)"/><ellipse cx="80" cy="65" rx="10" ry="12" fill="white"/><ellipse cx="120" cy="65" rx="10" ry="12" fill="white"/><circle cx="82" cy="67" r="5" fill="#7c2d12"/><circle cx="122" cy="67" r="5" fill="#7c2d12"/><circle cx="84" cy="64" r="2" fill="white"/><circle cx="124" cy="64" r="2" fill="white"/><path d="M 85 85 Q 100 95 115 85" stroke="#7c2d12" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="35" rx="8" ry="15" fill="#fb923c" transform="rotate(-20 60 35)"/><ellipse cx="140" cy="35" rx="8" ry="15" fill="#fb923c" transform="rotate(20 140 35)"/></svg>`,
];

function hashWords(words: string[]): number {
  const str = words.join("").toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export async function POST(request: NextRequest) {
  try {
    const { words } = await request.json();
    
    if (!words || words.length < 3) {
      return NextResponse.json({ error: "Se necesitan 3 palabras" }, { status: 400 });
    }

    // Select creature based on words hash
    const hash = hashWords(words);
    const creatureIndex = hash % CREATURE_TEMPLATES.length;
    const svgContent = CREATURE_TEMPLATES[creatureIndex];
    
    // Convert SVG to base64 data URL
    const base64 = Buffer.from(svgContent).toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${base64}`;
    
    return NextResponse.json({ 
      image: dataUrl,
      words,
      variant: creatureIndex + 1
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ 
      error: "Error interno",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
