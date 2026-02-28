"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons as simple SVG components
const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const StatsIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const GamesIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EvoIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// Creature SVG
const Creature = ({ stage }: { stage: "baby" | "teen" | "final" | "corrupt" }) => {
  const colors = {
    baby: { primary: "#a78bfa", secondary: "#c4b5fd", glow: "#8b5cf6" },
    teen: { primary: "#8b5cf6", secondary: "#a78bfa", glow: "#7c3aed" },
    final: { primary: "#7c3aed", secondary: "#8b5cf6", glow: "#6d28d9" },
    corrupt: { primary: "#1e1b4b", secondary: "#4c1d95", glow: "#dc2626" },
  };
  
  const c = colors[stage];
  
  return (
    <div className="relative float-animation pulse-glow">
      <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-2xl">
        {/* Outer glow */}
        <defs>
          <radialGradient id="creatureGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c.glow} stopOpacity="0.6" />
            <stop offset="100%" stopColor={c.glow} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bodyGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor={c.secondary} />
            <stop offset="100%" stopColor={c.primary} />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Glow circle */}
        <circle cx="100" cy="100" r="90" fill="url(#creatureGlow)" />
        
        {/* Main body */}
        <ellipse cx="100" cy="110" rx="60" ry="50" fill="url(#bodyGradient)" filter="url(#glow)" />
        
        {/* Head */}
        <circle cx="100" cy="70" r="45" fill="url(#bodyGradient)" filter="url(#glow)" />
        
        {/* Eyes */}
        <ellipse cx="80" cy="65" rx="12" ry="14" fill="white" />
        <ellipse cx="120" cy="65" rx="12" ry="14" fill="white" />
        <circle cx="82" cy="67" r="6" fill={stage === "corrupt" ? "#dc2626" : "#1e1b4b"} />
        <circle cx="122" cy="67" r="6" fill={stage === "corrupt" ? "#dc2626" : "#1e1b4b"} />
        <circle cx="84" cy="64" r="2" fill="white" />
        <circle cx="124" cy="64" r="2" fill="white" />
        
        {/* Mouth */}
        <path 
          d={stage === "corrupt" ? "M 85 90 Q 100 85 115 90" : "M 85 85 Q 100 95 115 85"} 
          stroke={stage === "corrupt" ? "#dc2626" : "#1e1b4b"} 
          strokeWidth="3" 
          fill="none" 
          strokeLinecap="round"
        />
        
        {/* Cosmic sparkles */}
        <circle cx="60" cy="40" r="2" fill="#fcd34d" className="animate-pulse" />
        <circle cx="140" cy="50" r="1.5" fill="#fcd34d" className="animate-pulse" />
        <circle cx="50" cy="120" r="1" fill="#fcd34d" className="animate-pulse" />
        <circle cx="150" cy="130" r="2" fill="#fcd34d" className="animate-pulse" />
        
        {/* Ears/horns based on stage */}
        {stage !== "baby" && (
          <>
            <ellipse cx="60" cy="35" rx="8" ry="15" fill={c.primary} transform="rotate(-20 60 35)" />
            <ellipse cx="140" cy="35" rx="8" ry="15" fill={c.primary} transform="rotate(20 140 35)" />
          </>
        )}
        
        {stage === "final" && (
          <path d="M 100 20 L 95 5 L 100 15 L 105 5 L 100 20" fill="#fcd34d" filter="url(#glow)" />
        )}
        
        {stage === "corrupt" && (
          <>
            <path d="M 70 30 L 55 10" stroke="#dc2626" strokeWidth="3" />
            <path d="M 130 30 L 145 10" stroke="#dc2626" strokeWidth="3" />
          </>
        )}
      </svg>
    </div>
  );
};

// Screen Components
const HomeScreen = ({ stage, stats }: { stage: "baby" | "teen" | "final" | "corrupt"; stats: typeof defaultStats }) => (
  <div className="flex flex-col h-full safe-area-top safe-area-bottom">
    {/* Header */}
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Nebulito</h1>
          <p className="text-sm text-purple-300">Nivel 7 • Bebé Cósmico</p>
        </div>
        <Badge variant="secondary" className="bg-purple-500/30 text-purple-200 border-purple-400/30">
          Día 5
        </Badge>
      </div>
    </div>
    
    {/* Creature Area */}
    <div className="flex-1 flex items-center justify-center relative">
      <div className="absolute inset-0 stars opacity-30" />
      <Creature stage={stage} />
    </div>
    
    {/* Quick Stats */}
    <div className="px-4 pb-4">
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
        <div className="grid grid-cols-4 gap-3">
          <StatMini label="Hambre" value={stats.hunger} color="bg-orange-500" />
          <StatMini label="Energía" value={stats.energy} color="bg-blue-500" />
          <StatMini label="Feliz" value={stats.happiness} color="bg-pink-500" />
          <StatMini label="Vínculo" value={stats.bond} color="bg-purple-500" />
        </div>
      </Card>
    </div>
    
    {/* Action Buttons */}
    <div className="px-4 pb-4">
      <div className="grid grid-cols-3 gap-3">
        <Button variant="secondary" className="bg-orange-500/20 hover:bg-orange-500/30 border-orange-400/30 text-orange-200">
          🍎 Alimentar
        </Button>
        <Button variant="secondary" className="bg-pink-500/20 hover:bg-pink-500/30 border-pink-400/30 text-pink-200">
          🎮 Jugar
        </Button>
        <Button variant="secondary" className="bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/30 text-blue-200">
          💤 Dormir
        </Button>
      </div>
    </div>
  </div>
);

const StatMini = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="text-center">
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
    </div>
    <span className="text-[10px] text-white/60">{label}</span>
  </div>
);

const StatsScreen = ({ stats }: { stats: typeof defaultStats }) => (
  <div className="flex flex-col h-full safe-area-top safe-area-bottom p-4 overflow-auto">
    <h2 className="text-2xl font-bold text-white mb-6">Estadísticas</h2>
    
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 mb-4">
      <h3 className="text-sm font-semibold text-purple-300 mb-4">Necesidades</h3>
      <div className="space-y-4">
        <StatBar label="Hambre" value={stats.hunger} color="bg-orange-500" icon="🍎" />
        <StatBar label="Energía" value={stats.energy} color="bg-blue-500" icon="⚡" />
        <StatBar label="Higiene" value={stats.hygiene} color="bg-cyan-500" icon="🛁" />
        <StatBar label="Felicidad" value={stats.happiness} color="bg-pink-500" icon="💖" />
        <StatBar label="Vínculo" value={stats.bond} color="bg-purple-500" icon="✨" />
      </div>
    </Card>
    
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 mb-4">
      <h3 className="text-sm font-semibold text-purple-300 mb-4">Atributos</h3>
      <div className="grid grid-cols-2 gap-4">
        <AttributeBox label="HP" value={80} max={100} />
        <AttributeBox label="ATK" value={45} max={100} />
        <AttributeBox label="DEF" value={55} max={100} />
        <AttributeBox label="SPD" value={70} max={100} />
      </div>
    </Card>
    
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
      <h3 className="text-sm font-semibold text-purple-300 mb-3">Moralidad</h3>
      <div className="relative h-4 bg-gradient-to-r from-purple-600 via-white/20 to-red-600 rounded-full">
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-purple-400"
          style={{ left: `calc(${stats.morality}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs">
        <span className="text-purple-300">✨ Luz</span>
        <span className="text-red-300">Oscuridad 🌑</span>
      </div>
    </Card>
  </div>
);

const StatBar = ({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm text-white/80">{icon} {label}</span>
      <span className="text-sm text-white/60">{value}%</span>
    </div>
    <Progress value={value} className="h-2 bg-white/10" indicatorClassName={color} />
  </div>
);

const AttributeBox = ({ label, value, max }: { label: string; value: number; max: number }) => (
  <div className="bg-white/5 rounded-lg p-3 text-center">
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-xs text-white/50">{label}</div>
  </div>
);

const GamesScreen = () => (
  <div className="flex flex-col h-full safe-area-top safe-area-bottom p-4">
    <h2 className="text-2xl font-bold text-white mb-6">Mini Juegos</h2>
    
    <div className="grid grid-cols-2 gap-4">
      <GameCard 
        title="Atrapa Estrellas" 
        description="Recolecta estrellas fugaces"
        emoji="⭐"
        color="from-yellow-500/20 to-orange-500/20"
        reward="+15 Felicidad"
      />
      <GameCard 
        title="Puzzle Cósmico" 
        description="Resuelve constelaciones"
        emoji="🧩"
        color="from-blue-500/20 to-purple-500/20"
        reward="+20 INT"
      />
      <GameCard 
        title="Carrera Espacial" 
        description="Esquiva asteroides"
        emoji="🚀"
        color="from-cyan-500/20 to-blue-500/20"
        reward="+10 SPD"
      />
      <GameCard 
        title="Meditación" 
        description="Conecta con el cosmos"
        emoji="🧘"
        color="from-purple-500/20 to-pink-500/20"
        reward="+25 Vínculo"
        locked={false}
      />
    </div>
    
    <Card className="mt-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 p-4">
      <div className="flex items-center gap-3">
        <div className="text-3xl">🎁</div>
        <div>
          <h3 className="font-semibold text-white">Bonus Diario</h3>
          <p className="text-sm text-white/60">Juega 3 juegos para desbloquear</p>
        </div>
        <Badge className="ml-auto bg-purple-500/30">1/3</Badge>
      </div>
    </Card>
  </div>
);

const GameCard = ({ title, description, emoji, color, reward, locked = false }: {
  title: string;
  description: string;
  emoji: string;
  color: string;
  reward: string;
  locked?: boolean;
}) => (
  <Card className={`bg-gradient-to-br ${color} border-white/10 p-4 ${locked ? 'opacity-50' : 'hover:scale-105 transition-transform cursor-pointer'}`}>
    <div className="text-4xl mb-2">{emoji}</div>
    <h3 className="font-semibold text-white text-sm">{title}</h3>
    <p className="text-xs text-white/50 mb-2">{description}</p>
    <Badge variant="outline" className="text-[10px] border-white/20 text-white/70">
      {reward}
    </Badge>
  </Card>
);

const EvolutionScreen = () => (
  <div className="flex flex-col h-full safe-area-top safe-area-bottom p-4 overflow-auto">
    <h2 className="text-2xl font-bold text-white mb-2">Evolución</h2>
    <p className="text-sm text-white/60 mb-6">Progreso hacia la siguiente etapa</p>
    
    {/* Evolution Progress */}
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-purple-500/30 flex items-center justify-center">
          <span className="text-2xl">🌟</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">Nebulito → Astralux</h3>
          <p className="text-sm text-white/60">Nivel 7 / 11</p>
          <Progress value={64} className="h-2 mt-2 bg-white/10" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-green-400 text-sm">✓</div>
          <div className="text-[10px] text-white/50">7 días cuidado</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-yellow-400 text-sm">◐</div>
          <div className="text-[10px] text-white/50">Vínculo 65%</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-white/30 text-sm">○</div>
          <div className="text-[10px] text-white/50">Nivel 11</div>
        </div>
      </div>
    </Card>
    
    {/* Evolution Tree */}
    <h3 className="text-sm font-semibold text-purple-300 mb-4">Árbol Evolutivo</h3>
    
    <div className="relative">
      {/* Tree visualization */}
      <div className="flex flex-col items-center gap-2">
        <EvoNode name="Nebulito" stage="baby" active />
        <div className="w-0.5 h-8 bg-purple-500/50" />
        <EvoNode name="Astralux" stage="teen" locked />
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-8 bg-purple-500/30" />
            <EvoNode name="Cosmara" stage="final" locked />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-8 bg-red-500/30" />
            <EvoNode name="Voidara" stage="corrupt" locked />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EvoNode = ({ name, stage, active = false, locked = false }: {
  name: string;
  stage: "baby" | "teen" | "final" | "corrupt";
  active?: boolean;
  locked?: boolean;
}) => {
  const colors = {
    baby: "from-purple-400 to-purple-600",
    teen: "from-purple-500 to-indigo-600",
    final: "from-yellow-400 to-purple-600",
    corrupt: "from-red-600 to-purple-900",
  };
  
  return (
    <div className={`relative ${locked ? 'opacity-40' : ''}`}>
      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${colors[stage]} flex items-center justify-center ${active ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''}`}>
        <span className="text-3xl">
          {stage === "baby" && "🌟"}
          {stage === "teen" && "⚡"}
          {stage === "final" && "👑"}
          {stage === "corrupt" && "🖤"}
        </span>
      </div>
      <p className="text-center text-xs text-white/80 mt-2">{name}</p>
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🔒</span>
        </div>
      )}
    </div>
  );
};

const ProfileScreen = () => (
  <div className="flex flex-col h-full safe-area-top safe-area-bottom p-4">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
        🧑‍🚀
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">Mateo</h2>
        <p className="text-sm text-purple-300">Guardián Cósmico</p>
        <Badge className="mt-1 bg-purple-500/30">Nivel 12</Badge>
      </div>
    </div>
    
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 mb-4">
      <h3 className="text-sm font-semibold text-purple-300 mb-3">Logros</h3>
      <div className="grid grid-cols-4 gap-3">
        <Achievement emoji="🌟" name="Primer día" unlocked />
        <Achievement emoji="🎮" name="Jugador" unlocked />
        <Achievement emoji="💖" name="Amor" unlocked />
        <Achievement emoji="⚡" name="Evolución" />
        <Achievement emoji="🏆" name="Campeón" />
        <Achievement emoji="🌙" name="Nocturno" />
        <Achievement emoji="🎯" name="Perfecto" />
        <Achievement emoji="✨" name="Maestro" />
      </div>
    </Card>
    
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 mb-4">
      <h3 className="text-sm font-semibold text-purple-300 mb-3">Estadísticas</h3>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-white">5</div>
          <div className="text-xs text-white/50">Días jugados</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">23</div>
          <div className="text-xs text-white/50">Mini juegos</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">156</div>
          <div className="text-xs text-white/50">Interacciones</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">1</div>
          <div className="text-xs text-white/50">Evoluciones</div>
        </div>
      </div>
    </Card>
    
    <div className="mt-auto space-y-2">
      <Button variant="outline" className="w-full border-white/20 text-white/80">
        ⚙️ Configuración
      </Button>
      <Button variant="outline" className="w-full border-white/20 text-white/80">
        🛍️ Tienda
      </Button>
    </div>
  </div>
);

const Achievement = ({ emoji, name, unlocked = false }: { emoji: string; name: string; unlocked?: boolean }) => (
  <div className={`text-center ${unlocked ? '' : 'opacity-30'}`}>
    <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center text-xl mb-1">
      {emoji}
    </div>
    <span className="text-[10px] text-white/60">{name}</span>
  </div>
);

// Default stats
const defaultStats = {
  hunger: 75,
  energy: 60,
  hygiene: 80,
  happiness: 85,
  bond: 65,
  morality: 35, // 0 = full dark, 100 = full light, 50 = neutral
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [stage] = useState<"baby" | "teen" | "final" | "corrupt">("baby");
  const [stats] = useState(defaultStats);

  return (
    <main className="min-h-screen cosmic-bg flex items-center justify-center p-4">
      {/* Desktop: Show phone frame */}
      <div className="hidden md:block">
        <div className="phone-frame cosmic-bg relative">
          <div className="phone-notch" />
          <AppContent 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            stage={stage} 
            stats={stats} 
          />
        </div>
      </div>
      
      {/* Mobile: Full screen */}
      <div className="md:hidden w-full h-screen">
        <AppContent 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          stage={stage} 
          stats={stats} 
        />
      </div>
    </main>
  );
}

function AppContent({ 
  activeTab, 
  setActiveTab, 
  stage, 
  stats 
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  stage: "baby" | "teen" | "final" | "corrupt";
  stats: typeof defaultStats;
}) {
  return (
    <div className="h-full flex flex-col">
      {/* Screen Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "home" && <HomeScreen stage={stage} stats={stats} />}
        {activeTab === "stats" && <StatsScreen stats={stats} />}
        {activeTab === "games" && <GamesScreen />}
        {activeTab === "evolution" && <EvolutionScreen />}
        {activeTab === "profile" && <ProfileScreen />}
      </div>
      
      {/* Bottom Navigation */}
      <div className="bg-black/40 backdrop-blur-md border-t border-white/10 safe-area-bottom">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-16 bg-transparent grid grid-cols-5 gap-0">
            <NavTab value="home" icon={<HomeIcon />} label="Inicio" active={activeTab === "home"} />
            <NavTab value="stats" icon={<StatsIcon />} label="Stats" active={activeTab === "stats"} />
            <NavTab value="games" icon={<GamesIcon />} label="Juegos" active={activeTab === "games"} />
            <NavTab value="evolution" icon={<EvoIcon />} label="Evolución" active={activeTab === "evolution"} />
            <NavTab value="profile" icon={<ProfileIcon />} label="Perfil" active={activeTab === "profile"} />
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

function NavTab({ value, icon, label, active }: { value: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <TabsTrigger 
      value={value} 
      className={`flex flex-col items-center justify-center gap-1 h-full rounded-none border-0 data-[state=active]:bg-transparent ${active ? 'text-purple-400' : 'text-white/50'}`}
    >
      {icon}
      <span className="text-[10px]">{label}</span>
    </TabsTrigger>
  );
}
