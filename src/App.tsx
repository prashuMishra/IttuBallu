import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX, Star, Trophy, Sparkles, Rocket, RotateCcw } from "lucide-react";

type Hero = "boy" | "girl";
type Planet = { table: number; name: string; emoji: string; color: string; description: string };
const planets: Planet[] = [
  { table: 2, name: "Blue Planet", emoji: "🌎", color: "#4e9fff", description: "Count in twos" },
  { table: 3, name: "Jungle Planet", emoji: "🌴", color: "#51c78a", description: "Meet the jungle friends" },
  { table: 4, name: "Dino Planet", emoji: "🦕", color: "#9a82ef", description: "Dino counting time" },
  { table: 5, name: "Candy Planet", emoji: "🍭", color: "#ff83bd", description: "Sweet counting" },
  { table: 6, name: "Ocean Planet", emoji: "🐬", color: "#46c5d9", description: "Dive into numbers" },
  { table: 7, name: "Rainbow Planet", emoji: "🌈", color: "#f2a64a", description: "Follow the colours" },
  { table: 8, name: "Robot Planet", emoji: "🤖", color: "#7388a8", description: "Power up your brain" },
  { table: 9, name: "Magic Planet", emoji: "🪄", color: "#b47be8", description: "A little magic" },
  { table: 10, name: "Gold Planet", emoji: "🏆", color: "#e7b83f", description: "The grand adventure" }
];

const character = {
  boy: { name: "Svojas", emoji: "👦🏻", suit: "🧑🏻‍🚀", greeting: "Ready for a space adventure?" },
  girl: { name: "Itiksha", emoji: "👧🏻", suit: "👩🏻‍🚀", greeting: "Let's explore and have fun!" }
};

function App() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [selected, setSelected] = useState<Planet | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [sound, setSound] = useState(true);
  const [completed, setCompleted] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("lma-completed") || "[]"); } catch { return []; }
  });
  const [stars, setStars] = useState<number>(() => Number(localStorage.getItem("lma-stars") || 0));
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    localStorage.setItem("lma-completed", JSON.stringify(completed));
    localStorage.setItem("lma-stars", String(stars));
  }, [completed, stars]);

  const questions = useMemo(() => selected ? Array.from({ length: 10 }, (_, i) => {
    const multiplier = i + 1;
    const correct = selected.table * multiplier;
    const choices = new Set<number>([correct]);
    while (choices.size < 3) {
      const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() < 0.5 ? -1 : 1);
      const option = Math.max(1, correct + offset);
      choices.add(option);
    }
    return { multiplier, correct, choices: Array.from(choices).sort(() => Math.random() - 0.5) };
  }) : [], [selected, questionIndex === -1]);

  const current = questions[questionIndex];

  function playTone(correct: boolean) {
    if (!sound) return;
    try {
      const audio = new AudioContext();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.connect(gain); gain.connect(audio.destination);
      oscillator.frequency.value = correct ? 660 : 220;
      gain.gain.setValueAtTime(0.12, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.22);
      oscillator.start(); oscillator.stop(audio.currentTime + 0.22);
      oscillator.onended = () => audio.close();
    } catch { /* sound is optional */ }
  }

  function startPlanet(planet: Planet) {
    setSelected(planet); setQuestionIndex(0); setScore(0); setAnswered(null); setFeedback("");
  }

  function chooseAnswer(value: number) {
    if (!current || answered !== null) return;
    setAnswered(value);
    const correct = value === current.correct;
    playTone(correct);
    if (correct) {
      setScore(s => s + 1); setStars(s => s + 1);
      setFeedback("Amazing! You got it! ⭐");
    } else {
      setFeedback(`Good try! The answer is ${current.correct}. Let's keep going! 💛`);
    }
  }

  function nextQuestion() {
    if (questionIndex < 9) {
      setQuestionIndex(i => i + 1); setAnswered(null); setFeedback("");
    } else {
      if (score + (answered === current?.correct ? 0 : 0) >= 0 && !completed.includes(selected!.table)) {
        setCompleted(c => [...c, selected!.table]);
        setStars(s => s + 3);
      }
      setSelected(null);
    }
  }

  const isFinished = selected !== null && questionIndex === 9 && answered !== null;
  const heroInfo = hero ? character[hero] : null;

  return (
    <main className="app-shell">
      <div className="stars-bg" aria-hidden="true"><i>✦</i><i>✧</i><i>✦</i><i>·</i><i>✧</i><i>✦</i></div>
      <header className="topbar">
        <div className="brand"><span className="brand-icon">🚀</span><span>Little Maths <b>Adventure</b></span></div>
        <div className="top-actions">
          <div className="star-count"><Star size={17} fill="currentColor" /> {stars}</div>
          <button className="sound-button" onClick={() => setSound(s => !s)} aria-label="Toggle sound">{sound ? <Volume2 /> : <VolumeX />}</button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!hero && (
          <motion.section key="choose" className="welcome-screen" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
            <div className="welcome-copy">
              <span className="eyebrow"><Sparkles size={15}/> A playful learning universe</span>
              <h1>Ready for a<br/><span>maths adventure?</span></h1>
              <p>Pick your space buddy and explore nine magical planets. Every answer brings a little celebration!</p>
              <h2>Who is your space buddy?</h2>
            </div>
            <div className="character-options">
              <button className="character-card boy-card" onClick={() => setHero("boy")}>
                <span className="character-glow blue-glow"></span><span className="character-art">🧑🏻‍🚀</span>
                <strong>Captain Svojas</strong><small>Let's blast off!</small><span className="pick-label">Choose me <span>→</span></span>
              </button>
              <button className="character-card girl-card" onClick={() => setHero("girl")}>
                <span className="character-glow pink-glow"></span><span className="character-art">👩🏻‍🚀</span>
                <strong>Captain Itiksha</strong><small>Let's sparkle!</small><span className="pick-label">Choose me <span>→</span></span>
              </button>
            </div>
            <div className="floating-planet planet-one">🪐</div><div className="floating-planet planet-two">⭐</div>
          </motion.section>
        )}

        {hero && !selected && (
          <motion.section key="map" className="map-screen" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .97 }}>
            <div className="map-heading">
              <div className="mini-hero">{character[hero].suit}</div>
              <div><span className="eyebrow">WELCOME, CAPTAIN {character[hero].name.toUpperCase()}!</span><h1>Choose a planet to explore</h1><p>Complete a little mission and collect stars.</p></div>
              <button className="change-hero" onClick={() => setHero(null)}>Change buddy</button>
            </div>
            <div className="progress-strip"><span>YOUR SPACE JOURNEY</span><b>{completed.length} / 9 planets explored</b><div className="progress-track"><div style={{ width: `${completed.length / 9 * 100}%` }} /></div></div>
            <div className="planet-grid">
              {planets.map((planet, i) => {
                const done = completed.includes(planet.table);
                return <motion.button key={planet.table} className={`planet-card ${done ? "done" : ""}`} style={{ "--planet": planet.color } as any} whileHover={{ y: -7, scale: 1.025 }} whileTap={{ scale: .97 }} onClick={() => startPlanet(planet)}>
                  <span className="planet-number">TABLE {planet.table}</span><span className="planet-emoji">{planet.emoji}</span><strong>{planet.name}</strong><small>{planet.description}</small>{done && <span className="done-tag">✓ Explored</span>}
                </motion.button>;
              })}
            </div>
            <div className="map-footer"><span>✨ Every planet is a new adventure!</span><span>Tip: You can play again anytime.</span></div>
          </motion.section>
        )}

        {hero && selected && current && (
          <motion.section key="game" className="game-screen" initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -25 }}>
            <div className="game-topline">
              <button className="back-button" onClick={() => setSelected(null)}><ArrowLeft size={18}/> Planets</button>
              <span className="level-label">{selected.emoji} TABLE {selected.table} MISSION</span>
              <span className="question-count">{questionIndex + 1} / 10</span>
            </div>
            <div className="game-progress"><div style={{ width: `${(questionIndex + (answered !== null ? 1 : 0)) / 10 * 100}%` }} /></div>
            <div className="game-content">
              <motion.div className="guide-character" animate={{ y: [0, -9, 0], rotate: [-2, 2, -2] }} transition={{ duration: 2.5, repeat: Infinity }}>{character[hero].suit}<span className="speech-bubble">{answered === null ? "You can do it!" : answered === current.correct ? "Hooray!" : "Nice try!"}</span></motion.div>
              <div className="question-panel">
                <span className="eyebrow">MISSION {questionIndex + 1} • {selected.name.toUpperCase()}</span>
                <h1>How much is...</h1>
                <div className="math-question"><span>{selected.table}</span><b>×</b><span>{current.multiplier}</span><b>=</b><span className="question-mark">?</span></div>
                <p className="helper-text">Choose the right answer, Captain!</p>
                <div className="answer-grid">
                  {current.choices.map(choice => <motion.button key={choice} className={`answer-button ${answered === choice ? (choice === current.correct ? "correct" : "incorrect") : ""} ${answered !== null && choice === current.correct ? "reveal-correct" : ""}`} whileHover={answered === null ? { scale: 1.06, y: -3 } : {}} whileTap={answered === null ? { scale: .94 } : {}} onClick={() => chooseAnswer(choice)} disabled={answered !== null}>{choice}</motion.button>)}
                </div>
                <AnimatePresence>
                  {answered !== null && <motion.div className="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><strong>{feedback}</strong><button onClick={nextQuestion}>{questionIndex === 9 ? "Finish mission" : "Next question"} <span>→</span></button></motion.div>}
                </AnimatePresence>
              </div>
            </div>
            <div className="game-bottom"><span>⭐ {score} correct answers</span><span>Keep trying — you're doing great!</span></div>
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="footer"><span>Made for curious little minds 💜</span><span>Little Maths Adventure · Tables 2–10</span></footer>
    </main>
  );
}

export default App;
