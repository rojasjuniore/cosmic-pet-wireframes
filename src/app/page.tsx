"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface GameState {
  creatureName: string;
  creatureImage: string;
  words: string[];
  level: number;
  xp: number;
  day: number;
  stats: Stats;
  stage: "baby" | "teen" | "final" | "corrupt";
  lastUpdate: number;
  achievements: string[];
  gamesPlayed: number;
  interactions: number;
}

interface Stats {
  hunger: number;
  energy: number;
  hygiene: number;
  happiness: number;
  bond: number;
  morality: number;
}

// Icons
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

// Onboarding Component
const Onboarding = ({ onComplete }: { onComplete: (name: string, words: string[], image: string) => void }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [words, setWords] = useState(["", "", ""]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (words.some(w => !w.trim())) {
      setError("Completa las 3 palabras");
      return;
    }
    
    setGenerating(true);
    setError("");
    
    try {
      const response = await fetch("/api/generate-creature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: words.map(w => w.trim()) }),
      });
      
      if (!response.ok) throw new Error("Error generando");
      
      const data = await response.json();
      onComplete(name || "Nebulito", words, data.image);
    } catch {
      setError("Error generando criatura. Intenta de nuevo.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen cosmic-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 p-6">
        {step === 0 && (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🌌</div>
            <h1 className="text-2xl font-bold text-white">Cosmic Pet</h1>
            <p className="text-white/70">Crea tu compañero cósmico único</p>
            <Button 
              onClick={() => setStep(1)} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Comenzar
            </Button>
          </div>
        )}
        
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white text-center">¿Cómo se llamará?</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de tu criatura"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={20}
            />
            <Button 
              onClick={() => setStep(2)} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Siguiente
            </Button>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white text-center">Define tu criatura</h2>
            <p className="text-white/60 text-center text-sm">3 palabras que describan su esencia</p>
            
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  type="text"
                  value={words[i]}
                  onChange={(e) => {
                    const newWords = [...words];
                    newWords[i] = e.target.value;
                    setWords(newWords);
                  }}
                  placeholder={["ej: valiente", "ej: misterioso", "ej: luminoso"][i]}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={20}
                />
              ))}
            </div>
            
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            
            <Button 
              onClick={handleGenerate} 
              disabled={generating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">✨</span> Generando criatura...
                </span>
              ) : (
                "✨ Crear mi criatura"
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

// Creature Display Component
const CreatureDisplay = ({ image, isAnimated = true }: { image: string; isAnimated?: boolean }) => (
  <div className={`relative ${isAnimated ? 'float-animation pulse-glow' : ''}`}>
    <img 
      src={image} 
      alt="Tu criatura" 
      className="w-48 h-48 object-contain drop-shadow-2xl rounded-full"
    />
  </div>
);

// Home Screen
const HomeScreen = ({ 
  game, 
  onAction 
}: { 
  game: GameState;
  onAction: (action: "feed" | "play" | "sleep" | "clean" | "pet") => void;
}) => {
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleAction = (action: "feed" | "play" | "sleep" | "clean" | "pet") => {
    onAction(action);
    const messages = {
      feed: "¡Ñam ñam! 🍎",
      play: "¡Qué divertido! 🎮",
      sleep: "Zzz... 💤",
      clean: "¡Brillando! ✨",
      pet: "¡Le encanta! 💖"
    };
    setActionFeedback(messages[action]);
    setTimeout(() => setActionFeedback(null), 1500);
  };

  return (
    <div className="flex flex-col h-full safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="px-4 pt-2 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{game.creatureName}</h1>
            <p className="text-sm text-purple-300">Nivel {game.level} • {getStageName(game.stage)}</p>
          </div>
          <Badge variant="secondary" className="bg-purple-500/30 text-purple-200 border-purple-400/30">
            Día {game.day}
          </Badge>
        </div>
      </div>
      
      {/* Creature Area */}
      <div className="flex-1 flex items-center justify-center relative" onClick={() => handleAction("pet")}>
        <div className="absolute inset-0 stars opacity-30" />
        <CreatureDisplay image={game.creatureImage} />
        
        {/* Action Feedback */}
        {actionFeedback && (
          <div className="absolute top-1/3 text-4xl animate-bounce">
            {actionFeedback}
          </div>
        )}
      </div>
      
      {/* Quick Stats */}
      <div className="px-4 pb-4">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
          <div className="grid grid-cols-4 gap-3">
            <StatMini label="Hambre" value={game.stats.hunger} color="bg-orange-500" />
            <StatMini label="Energía" value={game.stats.energy} color="bg-blue-500" />
            <StatMini label="Feliz" value={game.stats.happiness} color="bg-pink-500" />
            <StatMini label="Vínculo" value={game.stats.bond} color="bg-purple-500" />
          </div>
        </Card>
      </div>
      
      {/* XP Bar */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span>XP</span>
          <Progress value={(game.xp % 100)} className="h-1.5 flex-1 bg-white/10" indicatorClassName="bg-yellow-500" />
          <span>{game.xp % 100}/100</span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-4 gap-2">
          <ActionButton icon="🍎" label="Alimentar" onClick={() => handleAction("feed")} disabled={game.stats.hunger >= 100} />
          <ActionButton icon="🎮" label="Jugar" onClick={() => handleAction("play")} disabled={game.stats.energy < 10} />
          <ActionButton icon="💤" label="Dormir" onClick={() => handleAction("sleep")} disabled={game.stats.energy >= 100} />
          <ActionButton icon="🛁" label="Limpiar" onClick={() => handleAction("clean")} disabled={game.stats.hygiene >= 100} />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label, onClick, disabled }: { icon: string; label: string; onClick: () => void; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
      disabled 
        ? 'bg-white/5 opacity-50 cursor-not-allowed' 
        : 'bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95'
    }`}
  >
    <span className="text-2xl mb-1">{icon}</span>
    <span className="text-[10px] text-white/70">{label}</span>
  </button>
);

const StatMini = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="text-center">
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
    </div>
    <span className="text-[10px] text-white/60">{label}</span>
  </div>
);

// Stats Screen
const StatsScreen = ({ game }: { game: GameState }) => (
  <div className="flex flex-col h-full safe-area-top safe-area-bottom p-4 overflow-auto">
    <h2 className="text-2xl font-bold text-white mb-6">Estadísticas</h2>
    
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 mb-4">
      <h3 className="text-sm font-semibold text-purple-300 mb-4">Necesidades</h3>
      <div className="space-y-4">
        <StatBar label="Hambre" value={game.stats.hunger} color="bg-orange-500" icon="🍎" />
        <StatBar label="Energía" value={game.stats.energy} color="bg-blue-500" icon="⚡" />
        <StatBar label="Higiene" value={game.stats.hygiene} color="bg-cyan-500" icon="🛁" />
        <StatBar label="Felicidad" value={game.stats.happiness} color="bg-pink-500" icon="💖" />
        <StatBar label="Vínculo" value={game.stats.bond} color="bg-purple-500" icon="✨" />
      </div>
    </Card>
    
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 mb-4">
      <h3 className="text-sm font-semibold text-purple-300 mb-3">Palabras de esencia</h3>
      <div className="flex gap-2 flex-wrap">
        {game.words.map((word, i) => (
          <Badge key={i} className="bg-purple-500/30 text-purple-200">{word}</Badge>
        ))}
      </div>
    </Card>
    
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
      <h3 className="text-sm font-semibold text-purple-300 mb-3">Moralidad</h3>
      <div className="relative h-4 bg-gradient-to-r from-purple-600 via-white/20 to-red-600 rounded-full">
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-purple-400"
          style={{ left: `calc(${100 - game.stats.morality}% - 8px)` }}
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
      <span className="text-sm text-white/60">{Math.round(value)}%</span>
    </div>
    <Progress value={value} className="h-2 bg-white/10" indicatorClassName={color} />
  </div>
);

// Mini Games Screen
const GamesScreen = ({ onPlay }: { onPlay: (game: string) => void }) => (
  <div className="flex flex-col h-full safe-area-top safe-area-bottom p-4">
    <h2 className="text-2xl font-bold text-white mb-6">Mini Juegos</h2>
    
    <div className="grid grid-cols-2 gap-4">
      <GameCard 
        title="Atrapa Estrellas" 
        description="Toca las estrellas"
        emoji="⭐"
        color="from-yellow-500/20 to-orange-500/20"
        reward="+15 Felicidad"
        onClick={() => onPlay("stars")}
      />
      <GameCard 
        title="Quiz Cósmico" 
        description="Responde preguntas"
        emoji="🧠"
        color="from-blue-500/20 to-purple-500/20"
        reward="+20 Vínculo"
        onClick={() => onPlay("quiz")}
      />
      <GameCard 
        title="Meditación" 
        description="Mantén presionado"
        emoji="🧘"
        color="from-purple-500/20 to-pink-500/20"
        reward="+25 Energía"
        onClick={() => onPlay("meditate")}
      />
      <GameCard 
        title="Alimentar" 
        description="Desliza comida"
        emoji="🍎"
        color="from-green-500/20 to-cyan-500/20"
        reward="+30 Hambre"
        onClick={() => onPlay("feed")}
      />
    </div>
  </div>
);

const GameCard = ({ title, description, emoji, color, reward, onClick }: {
  title: string;
  description: string;
  emoji: string;
  color: string;
  reward: string;
  onClick: () => void;
}) => (
  <Card 
    className={`bg-gradient-to-br ${color} border-white/10 p-4 hover:scale-105 transition-transform cursor-pointer active:scale-95`}
    onClick={onClick}
  >
    <div className="text-4xl mb-2">{emoji}</div>
    <h3 className="font-semibold text-white text-sm">{title}</h3>
    <p className="text-xs text-white/50 mb-2">{description}</p>
    <Badge variant="outline" className="text-[10px] border-white/20 text-white/70">
      {reward}
    </Badge>
  </Card>
);

// Star Catch Mini Game
const StarCatchGame = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [stars, setStars] = useState<{id: number; x: number; y: number}[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setStars(prev => [...prev, { 
        id: Date.now(), 
        x: Math.random() * 80 + 10, 
        y: Math.random() * 60 + 20 
      }]);
    }, 800);
    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStars(prev => prev.slice(-8));
    }, 2000);
    return () => clearTimeout(timeout);
  }, [stars]);

  const catchStar = (id: number) => {
    setStars(prev => prev.filter(s => s.id !== id));
    setScore(s => s + 1);
  };

  if (gameOver) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8 text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold text-white mb-2">¡Juego terminado!</h2>
          <p className="text-4xl text-yellow-400 font-bold mb-4">{score} estrellas</p>
          <Button onClick={() => onComplete(score)} className="bg-purple-600 hover:bg-purple-700">
            Continuar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 cosmic-bg z-50">
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Badge className="bg-yellow-500/30 text-yellow-200 text-lg px-4 py-2">
          ⭐ {score}
        </Badge>
        <Badge className="bg-red-500/30 text-red-200 text-lg px-4 py-2">
          ⏱️ {timeLeft}s
        </Badge>
      </div>
      
      <div className="absolute inset-0 stars" />
      
      {stars.map(star => (
        <button
          key={star.id}
          onClick={() => catchStar(star.id)}
          className="absolute text-4xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform animate-pulse"
          style={{ left: `${star.x}%`, top: `${star.y}%` }}
        >
          ⭐
        </button>
      ))}
      
      <p className="absolute bottom-8 left-0 right-0 text-center text-white/60">
        ¡Toca las estrellas!
      </p>
    </div>
  );
};

// Evolution Screen
const EvolutionScreen = ({ game }: { game: GameState }) => {
  const nextLevel = game.stage === "baby" ? 11 : game.stage === "teen" ? 26 : 50;
  const progress = Math.min((game.level / nextLevel) * 100, 100);
  
  return (
    <div className="flex flex-col h-full safe-area-top safe-area-bottom p-4 overflow-auto">
      <h2 className="text-2xl font-bold text-white mb-2">Evolución</h2>
      <p className="text-sm text-white/60 mb-6">Progreso hacia la siguiente etapa</p>
      
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img src={game.creatureImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">{getStageName(game.stage)} → {getNextStageName(game.stage)}</h3>
            <p className="text-sm text-white/60">Nivel {game.level} / {nextLevel}</p>
            <Progress value={progress} className="h-2 mt-2 bg-white/10" indicatorClassName="bg-purple-500" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/5 rounded-lg p-2">
            <div className={`text-sm ${game.day >= 7 ? 'text-green-400' : 'text-white/30'}`}>
              {game.day >= 7 ? '✓' : '○'}
            </div>
            <div className="text-[10px] text-white/50">7 días cuidado</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className={`text-sm ${game.stats.bond >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
              {game.stats.bond >= 50 ? '✓' : '◐'}
            </div>
            <div className="text-[10px] text-white/50">Vínculo {Math.round(game.stats.bond)}%</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className={`text-sm ${game.level >= nextLevel ? 'text-green-400' : 'text-white/30'}`}>
              {game.level >= nextLevel ? '✓' : '○'}
            </div>
            <div className="text-[10px] text-white/50">Nivel {nextLevel}</div>
          </div>
        </div>
      </Card>
      
      {/* Evolution Tree */}
      <h3 className="text-sm font-semibold text-purple-300 mb-4">Árbol Evolutivo</h3>
      <div className="flex flex-col items-center gap-2">
        <EvoNode name="Bebé" active={game.stage === "baby"} unlocked />
        <div className="w-0.5 h-8 bg-purple-500/50" />
        <EvoNode name="Joven" active={game.stage === "teen"} unlocked={game.level >= 11} />
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-8 bg-purple-500/30" />
            <EvoNode name="Final" active={game.stage === "final"} unlocked={game.level >= 26 && game.stats.morality >= 60} />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-8 bg-red-500/30" />
            <EvoNode name="Corrupto" active={game.stage === "corrupt"} unlocked={game.level >= 26 && game.stats.morality < 40} corrupt />
          </div>
        </div>
      </div>
    </div>
  );
};

const EvoNode = ({ name, active, unlocked, corrupt }: { name: string; active?: boolean; unlocked?: boolean; corrupt?: boolean }) => (
  <div className={`${!unlocked ? 'opacity-40' : ''}`}>
    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
      active ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''
    } ${corrupt ? 'bg-gradient-to-br from-red-600 to-purple-900' : 'bg-gradient-to-br from-purple-500 to-indigo-600'}`}>
      <span className="text-2xl">
        {corrupt ? '🖤' : active ? '✨' : unlocked ? '⭐' : '🔒'}
      </span>
    </div>
    <p className="text-center text-xs text-white/80 mt-2">{name}</p>
  </div>
);

// Profile Screen
const ProfileScreen = ({ game, onReset }: { game: GameState; onReset: () => void }) => (
  <div className="flex flex-col h-full safe-area-top safe-area-bottom p-4">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-20 h-20 rounded-full overflow-hidden">
        <img src={game.creatureImage} alt="" className="w-full h-full object-cover" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">{game.creatureName}</h2>
        <p className="text-sm text-purple-300">{getStageName(game.stage)}</p>
        <Badge className="mt-1 bg-purple-500/30">Nivel {game.level}</Badge>
      </div>
    </div>
    
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 mb-4">
      <h3 className="text-sm font-semibold text-purple-300 mb-3">Estadísticas</h3>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-white">{game.day}</div>
          <div className="text-xs text-white/50">Días jugados</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{game.gamesPlayed}</div>
          <div className="text-xs text-white/50">Mini juegos</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{game.interactions}</div>
          <div className="text-xs text-white/50">Interacciones</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{game.xp}</div>
          <div className="text-xs text-white/50">XP Total</div>
        </div>
      </div>
    </Card>
    
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4 mb-4">
      <h3 className="text-sm font-semibold text-purple-300 mb-3">Logros</h3>
      <div className="grid grid-cols-4 gap-3">
        <Achievement emoji="🌟" name="Primer día" unlocked={game.day >= 1} />
        <Achievement emoji="🎮" name="Jugador" unlocked={game.gamesPlayed >= 5} />
        <Achievement emoji="💖" name="Amigo" unlocked={game.stats.bond >= 50} />
        <Achievement emoji="⚡" name="Nivel 10" unlocked={game.level >= 10} />
      </div>
    </Card>
    
    <div className="mt-auto">
      <Button 
        variant="outline" 
        className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20"
        onClick={onReset}
      >
        🗑️ Reiniciar juego
      </Button>
    </div>
  </div>
);

const Achievement = ({ emoji, name, unlocked }: { emoji: string; name: string; unlocked?: boolean }) => (
  <div className={`text-center ${!unlocked ? 'opacity-30' : ''}`}>
    <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center text-xl mb-1">
      {emoji}
    </div>
    <span className="text-[10px] text-white/60">{name}</span>
  </div>
);

// Helper functions
function getStageName(stage: string): string {
  const names: Record<string, string> = {
    baby: "Bebé Cósmico",
    teen: "Joven Estelar", 
    final: "Guardián Cósmico",
    corrupt: "Ente del Vacío"
  };
  return names[stage] || stage;
}

function getNextStageName(stage: string): string {
  const next: Record<string, string> = {
    baby: "Joven Estelar",
    teen: "Guardián/Corrupto",
    final: "Máximo",
    corrupt: "Redención"
  };
  return next[stage] || "???";
}

// Main App
export default function Home() {
  const [game, setGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [miniGame, setMiniGame] = useState<string | null>(null);

  // Load game from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cosmicPetGame");
    if (saved) {
      const parsed = JSON.parse(saved);
      setGame(parsed);
    }
    setLoading(false);
  }, []);

  // Save game to localStorage
  useEffect(() => {
    if (game) {
      localStorage.setItem("cosmicPetGame", JSON.stringify(game));
    }
  }, [game]);

  // Stat decay over time
  useEffect(() => {
    if (!game) return;
    
    const interval = setInterval(() => {
      setGame(prev => {
        if (!prev) return prev;
        
        const now = Date.now();
        const elapsed = (now - prev.lastUpdate) / 1000 / 60; // minutes
        
        if (elapsed < 1) return prev;
        
        return {
          ...prev,
          lastUpdate: now,
          stats: {
            ...prev.stats,
            hunger: Math.max(0, prev.stats.hunger - elapsed * 0.5),
            energy: Math.max(0, prev.stats.energy - elapsed * 0.3),
            hygiene: Math.max(0, prev.stats.hygiene - elapsed * 0.2),
            happiness: Math.max(0, prev.stats.happiness - elapsed * 0.4),
            bond: Math.max(0, prev.stats.bond - elapsed * 0.1),
          }
        };
      });
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [game]);

  const handleCreateCreature = (name: string, words: string[], image: string) => {
    const newGame: GameState = {
      creatureName: name,
      creatureImage: image,
      words,
      level: 1,
      xp: 0,
      day: 1,
      stats: {
        hunger: 80,
        energy: 80,
        hygiene: 100,
        happiness: 90,
        bond: 50,
        morality: 70,
      },
      stage: "baby",
      lastUpdate: Date.now(),
      achievements: [],
      gamesPlayed: 0,
      interactions: 0,
    };
    setGame(newGame);
  };

  const handleAction = useCallback((action: "feed" | "play" | "sleep" | "clean" | "pet") => {
    setGame(prev => {
      if (!prev) return prev;
      
      const effects: Record<string, Partial<Stats>> = {
        feed: { hunger: 25 },
        play: { happiness: 20, energy: -15 },
        sleep: { energy: 30 },
        clean: { hygiene: 30 },
        pet: { happiness: 10, bond: 5 },
      };
      
      const effect = effects[action];
      const newStats = { ...prev.stats };
      
      for (const [key, value] of Object.entries(effect)) {
        const k = key as keyof Stats;
        newStats[k] = Math.min(100, Math.max(0, newStats[k] + (value || 0)));
      }
      
      // Good actions increase morality
      if (action !== "pet") {
        newStats.morality = Math.min(100, newStats.morality + 1);
      }
      
      return {
        ...prev,
        stats: newStats,
        xp: prev.xp + 5,
        level: Math.floor((prev.xp + 5) / 100) + 1,
        interactions: prev.interactions + 1,
        lastUpdate: Date.now(),
      };
    });
  }, []);

  const handleMiniGameComplete = useCallback((score: number) => {
    setGame(prev => {
      if (!prev) return prev;
      
      const xpGain = score * 3;
      const happinessGain = Math.min(30, score * 2);
      const bondGain = Math.min(15, score);
      
      return {
        ...prev,
        stats: {
          ...prev.stats,
          happiness: Math.min(100, prev.stats.happiness + happinessGain),
          bond: Math.min(100, prev.stats.bond + bondGain),
        },
        xp: prev.xp + xpGain,
        level: Math.floor((prev.xp + xpGain) / 100) + 1,
        gamesPlayed: prev.gamesPlayed + 1,
        lastUpdate: Date.now(),
      };
    });
    setMiniGame(null);
  }, []);

  const handleReset = () => {
    if (confirm("¿Seguro que quieres reiniciar? Perderás todo el progreso.")) {
      localStorage.removeItem("cosmicPetGame");
      setGame(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="text-4xl animate-pulse">✨</div>
      </div>
    );
  }

  if (!game) {
    return <Onboarding onComplete={handleCreateCreature} />;
  }

  if (miniGame === "stars") {
    return <StarCatchGame onComplete={handleMiniGameComplete} />;
  }

  return (
    <main className="min-h-screen cosmic-bg flex items-center justify-center p-4">
      {/* Desktop: Show phone frame */}
      <div className="hidden md:block">
        <div className="phone-frame cosmic-bg relative">
          <div className="phone-notch" />
          <AppContent 
            game={game}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAction={handleAction}
            onPlayGame={setMiniGame}
            onReset={handleReset}
          />
        </div>
      </div>
      
      {/* Mobile: Full screen */}
      <div className="md:hidden w-full h-screen">
        <AppContent 
          game={game}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onAction={handleAction}
          onPlayGame={setMiniGame}
          onReset={handleReset}
        />
      </div>
    </main>
  );
}

function AppContent({ 
  game,
  activeTab, 
  setActiveTab,
  onAction,
  onPlayGame,
  onReset,
}: { 
  game: GameState;
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  onAction: (action: "feed" | "play" | "sleep" | "clean" | "pet") => void;
  onPlayGame: (game: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        {activeTab === "home" && <HomeScreen game={game} onAction={onAction} />}
        {activeTab === "stats" && <StatsScreen game={game} />}
        {activeTab === "games" && <GamesScreen onPlay={onPlayGame} />}
        {activeTab === "evolution" && <EvolutionScreen game={game} />}
        {activeTab === "profile" && <ProfileScreen game={game} onReset={onReset} />}
      </div>
      
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
