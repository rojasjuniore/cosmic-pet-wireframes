import { NextRequest, NextResponse } from "next/server";

// Simple SVG creatures
const CREATURES = [
  // Purple
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3CradialGradient id='g' cx='30%25' cy='30%25'%3E%3Cstop offset='0%25' stop-color='%23c4b5fd'/%3E%3Cstop offset='100%25' stop-color='%238b5cf6'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='100' cy='100' r='70' fill='url(%23g)'/%3E%3Ccircle cx='100' cy='80' r='35' fill='url(%23g)'/%3E%3Cellipse cx='85' cy='75' rx='8' ry='10' fill='white'/%3E%3Cellipse cx='115' cy='75' rx='8' ry='10' fill='white'/%3E%3Ccircle cx='87' cy='77' r='4' fill='%231e1b4b'/%3E%3Ccircle cx='117' cy='77' r='4' fill='%231e1b4b'/%3E%3Cpath d='M 90 95 Q 100 102 110 95' stroke='%231e1b4b' stroke-width='2' fill='none'/%3E%3C/svg%3E`,
  // Blue
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3CradialGradient id='g' cx='30%25' cy='30%25'%3E%3Cstop offset='0%25' stop-color='%2393c5fd'/%3E%3Cstop offset='100%25' stop-color='%233b82f6'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='100' cy='100' r='70' fill='url(%23g)'/%3E%3Ccircle cx='100' cy='80' r='35' fill='url(%23g)'/%3E%3Cellipse cx='85' cy='75' rx='8' ry='10' fill='white'/%3E%3Cellipse cx='115' cy='75' rx='8' ry='10' fill='white'/%3E%3Ccircle cx='87' cy='77' r='4' fill='%231e3a5f'/%3E%3Ccircle cx='117' cy='77' r='4' fill='%231e3a5f'/%3E%3Cpath d='M 90 95 Q 100 102 110 95' stroke='%231e3a5f' stroke-width='2' fill='none'/%3E%3C/svg%3E`,
  // Pink
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3CradialGradient id='g' cx='30%25' cy='30%25'%3E%3Cstop offset='0%25' stop-color='%23f9a8d4'/%3E%3Cstop offset='100%25' stop-color='%23ec4899'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='100' cy='100' r='70' fill='url(%23g)'/%3E%3Ccircle cx='100' cy='80' r='35' fill='url(%23g)'/%3E%3Cellipse cx='85' cy='75' rx='8' ry='10' fill='white'/%3E%3Cellipse cx='115' cy='75' rx='8' ry='10' fill='white'/%3E%3Ccircle cx='87' cy='77' r='4' fill='%23831843'/%3E%3Ccircle cx='117' cy='77' r='4' fill='%23831843'/%3E%3Cpath d='M 90 95 Q 100 102 110 95' stroke='%23831843' stroke-width='2' fill='none'/%3E%3C/svg%3E`,
  // Green
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3CradialGradient id='g' cx='30%25' cy='30%25'%3E%3Cstop offset='0%25' stop-color='%2386efac'/%3E%3Cstop offset='100%25' stop-color='%2322c55e'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='100' cy='100' r='70' fill='url(%23g)'/%3E%3Ccircle cx='100' cy='80' r='35' fill='url(%23g)'/%3E%3Cellipse cx='85' cy='75' rx='8' ry='10' fill='white'/%3E%3Cellipse cx='115' cy='75' rx='8' ry='10' fill='white'/%3E%3Ccircle cx='87' cy='77' r='4' fill='%2314532d'/%3E%3Ccircle cx='117' cy='77' r='4' fill='%2314532d'/%3E%3Cpath d='M 90 95 Q 100 102 110 95' stroke='%2314532d' stroke-width='2' fill='none'/%3E%3C/svg%3E`,
  // Orange
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3CradialGradient id='g' cx='30%25' cy='30%25'%3E%3Cstop offset='0%25' stop-color='%23fdba74'/%3E%3Cstop offset='100%25' stop-color='%23f97316'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='100' cy='100' r='70' fill='url(%23g)'/%3E%3Ccircle cx='100' cy='80' r='35' fill='url(%23g)'/%3E%3Cellipse cx='85' cy='75' rx='8' ry='10' fill='white'/%3E%3Cellipse cx='115' cy='75' rx='8' ry='10' fill='white'/%3E%3Ccircle cx='87' cy='77' r='4' fill='%237c2d12'/%3E%3Ccircle cx='117' cy='77' r='4' fill='%237c2d12'/%3E%3Cpath d='M 90 95 Q 100 102 110 95' stroke='%237c2d12' stroke-width='2' fill='none'/%3E%3C/svg%3E`,
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const words = body.words;
    
    if (!words || !Array.isArray(words) || words.length < 3) {
      return NextResponse.json({ error: "Se necesitan 3 palabras" }, { status: 400 });
    }

    // Simple hash based on words
    const str = words.join("").toLowerCase();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
    }
    const index = Math.abs(hash) % CREATURES.length;
    
    return NextResponse.json({ 
      image: CREATURES[index],
      words,
      variant: index + 1
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
