import { useState, useEffect, useRef } from 'react';
import { moonData } from './data/moonData';
import { marsData } from './data/marsData';
import { deepSpaceData } from './data/deepSpaceData';

const missions = [moonData, marsData, deepSpaceData];

// SİYAH ARKA PLANI (VE DAMALI DESENİ) OTOMATİK ŞEFFAF YAPAN AKILLI BİLEŞEN
function TransparentPlanet({ src, alt }) {
  const [cleanSrc, setCleanSrc] = useState(src);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const w = canvas.width;
      const h = canvas.height;

      // Köşelerden başlayarak (Flood Fill mantığıyla) dış arka planı tamamen şeffaf yap
      // Böylece gezegenin kendi içindeki koyu kraterler ve siyah çerçevesi bozulmaz!
      const visited = new Uint8Array(w * h);
      const queue = [0, w - 1, (h - 1) * w, h * w - 1];

      const isBgPixel = (idx) => {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        // Saf siyah arka plan pikselleri
        const isBlack = r < 18 && g < 18 && b < 22;
        return isBlack;
      };

      while (queue.length > 0) {
        const p = queue.pop();
        if (p < 0 || p >= w * h || visited[p]) continue;
        visited[p] = 1;

        const idx = p * 4;
        if (isBgPixel(idx)) {
          data[idx + 3] = 0; // Tamamen şeffaf yap!
          const x = p % w;
          const y = Math.floor(p / w);
          if (x > 0) queue.push(p - 1);
          if (x < w - 1) queue.push(p + 1);
          if (y > 0) queue.push(p - w);
          if (y < h - 1) queue.push(p + w);
        }
      }

      // Yıldızların arasındaki iç siyah boşlukları da temizle (gezegenin merkez dairesi hariç)
      const cx = w / 2;
      const cy = h / 2;
      const planetRadius = w * 0.28; // Gezegenin iç kısmını koru
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const dist = Math.hypot(x - cx, y - cy);
          if (dist > planetRadius) {
            const idx = (y * w + x) * 4;
            if (data[idx] < 18 && data[idx + 1] < 18 && data[idx + 2] < 22) {
              data[idx + 3] = 0;
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setCleanSrc(canvas.toDataURL('image/png'));
    };
  }, [src]);

  return <img src={cleanSrc} alt={alt} className="pixel-planet-img" />;
}

export default function App() {
  const [stage, setStage] = useState('intro_start');

  const [selectedMission, setSelectedMission] = useState(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [foundIds, setFoundIds] = useState([]);
  const [activeObject, setActiveObject] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const handleContinueAfterReading = () => {
    setStage('intro_end');
  };

  const handleSelectMission = (mission) => {
    setSelectedMission(mission);
    setCurrentLevelIndex(0);
    setFoundIds([]);
    setActiveObject(null);
    setShowHint(false);

    if (mission.landingVideo) {
      setStage('landing');
    } else {
      setStage('game');
    }
  };

  const currentScene = selectedMission?.scenes[currentLevelIndex];
  const allFoundInLevel = currentScene && foundIds.length === currentScene.objects.length;

  const handleObjectClick = (obj) => {
    if (!foundIds.includes(obj.id)) {
      setFoundIds([...foundIds, obj.id]);
    }
    setActiveObject(obj);
  };

  const goToNextLevel = () => {
    if (currentLevelIndex + 1 < selectedMission.scenes.length) {
      setCurrentLevelIndex(currentLevelIndex + 1);
      setFoundIds([]);
      setActiveObject(null);
      setShowHint(false);
    } else {
      setStage('select');
    }
  };

  const renderPlanetArt = (id) => {
    if (id === 'moon') {
      return (
        <div className="pixel-planet-wrapper">
          <TransparentPlanet src="/images/moon.jpg" alt="The Moon" />
        </div>
      );
    }
    if (id === 'mars') {
      return (
        <div className="pixel-planet-wrapper">
          <TransparentPlanet src="/images/mars.jpg" alt="Mars" />
        </div>
      );
    }
    return (
      <div className="pixel-planet-wrapper">
        <TransparentPlanet src="/images/deepspace.jpg" alt="Deep Space" />
      </div>
    );
  };

  const isIntroStage = stage === 'intro_start' || stage === 'intro_read' || stage === 'intro_end';

  return (
    <div className="space-app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background-color: #030308;
          overflow-x: hidden;
        }

        .space-app-root {
          min-height: 100vh;
          color: #e2e8f0;
          font-family: 'Space Mono', monospace;
          position: relative;
        }

        .pixel-title {
          font-family: 'Press Start 2P', monospace;
          line-height: 1.5;
          text-transform: uppercase;
        }

        .retro-font {
          font-family: 'Silkscreen', monospace;
        }

        .bg-media {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          z-index: 0;
        }

        /* 2D PIXEL ART RESİM STİLLERİ */
        .pixel-planet-wrapper {
          width: 160px;
          height: 160px;
          margin: 6px auto 10px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: floatPlanet 4.5s infinite ease-in-out;
        }

        .pixel-planet-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }

        @keyframes floatPlanet {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.03); }
        }

        .cinematic-overlay {
          position: relative;
          z-index: 2;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 0 24px;
          pointer-events: none;
        }

        .story-floater {
          max-width: 860px;
          transition: opacity 1.2s ease-in-out, transform 1.6s cubic-bezier(0.22, 1, 0.36, 1), filter 1.2s ease;
        }

        .story-floater.hidden {
          opacity: 0;
          transform: translateY(35px) scale(1.06);
          filter: blur(8px);
        }

        .story-floater.visible {
          opacity: 1;
          transform: translateY(0px) scale(1);
          filter: blur(0px);
        }

        .story-floater.fading {
          opacity: 0;
          transform: translateY(-140px) scale(0.35);
          filter: blur(6px);
        }

        .cinematic-heading {
          font-family: 'Press Start 2P', monospace;
          font-size: clamp(22px, 3.2vw, 38px);
          color: #f8fafc;
          letter-spacing: 3px;
          margin: 0 0 28px 0;
          text-shadow:
            0 4px 0 #05050d,
            -3px -3px 0 #05050d,
            3px -3px 0 #05050d,
            -3px 3px 0 #05050d,
            3px 3px 0 #05050d,
            0 0 25px rgba(168, 85, 247, 0.85),
            0 0 45px rgba(56, 189, 248, 0.5);
        }

        .cinematic-body {
          font-family: 'Silkscreen', monospace;
          font-size: clamp(14px, 1.6vw, 20px);
          line-height: 1.85;
          color: #e2e8f0;
          margin: 0;
          text-shadow:
            0 3px 0 #04040a,
            -2px -2px 0 #04040a,
            2px -2px 0 #04040a,
            -2px 2px 0 #04040a,
            2px 2px 0 #04040a,
            0 0 18px rgba(0, 0, 0, 0.95);
        }

        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 18px rgba(251, 191, 36, 0.45); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(251, 191, 36, 0.85); }
        }

        .continue-cosmos-btn {
          margin-top: 34px;
          font-family: 'Press Start 2P', monospace;
          font-size: clamp(11px, 1.1vw, 14px);
          padding: 16px 26px;
          background: rgba(9, 11, 26, 0.82);
          color: #fcd34d;
          border: 2px solid #fcd34d;
          cursor: pointer;
          letter-spacing: 1.5px;
          animation: pulseGlow 2s infinite ease-in-out;
          transition: background 0.2s, color 0.2s;
        }

        .continue-cosmos-btn:hover {
          background: #fcd34d;
          color: #05050a;
        }

        .sector-screen {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 30px 20px;
          animation: fadeInSpace 1.2s ease forwards;
        }

        @keyframes fadeInSpace {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .sector-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 28px;
          max-width: 1040px;
          width: 100%;
          margin-top: 24px;
        }

        .retro-sector-card {
          background: rgba(8, 10, 24, 0.84);
          backdrop-filter: blur(8px);
          padding: 26px 22px;
          cursor: pointer;
          position: relative;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 420px;
          border-radius: 16px;
          border: 3px solid rgba(148, 163, 184, 0.4);
          transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }

        .retro-sector-card:hover {
          transform: translateY(-6px) scale(1.02);
          background: rgba(14, 18, 42, 0.95);
        }

        .retro-btn {
          font-family: 'Press Start 2P', monospace;
          font-size: 11px;
          padding: 12px 18px;
          background: rgba(15, 23, 42, 0.85);
          color: #f8fafc;
          border: 2px solid #475569;
          cursor: pointer;
          text-transform: uppercase;
          transition: all 0.2s;
        }
        .retro-btn:hover {
          border-color: #38bdf8;
          color: #38bdf8;
          transform: scale(1.05);
        }
      `}</style>

      {/* 1. AŞAMA ARKA PLANI */}
      {stage === 'intro_start' && (
        <video
          src="/videos/opening.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => setStage('intro_read')}
          className="bg-media"
          style={{ filter: 'brightness(0.95)' }}
        />
      )}

      {/* 2. AŞAMA ARKA PLANI */}
      {stage === 'intro_read' && (
        <video
          src="/videos/gifroket.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="bg-media"
          style={{ filter: 'brightness(0.85)' }}
        />
      )}

      {/* 3. AŞAMA ARKA PLANI */}
      {stage === 'intro_end' && (
        <video
          src="/videos/opening2.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => setStage('select')}
          className="bg-media"
          style={{ filter: 'brightness(0.95)' }}
        />
      )}

      {/* 4. AŞAMA ARKA PLANI */}
      {stage === 'select' && (
        <img
          src="/videos/gif.gif"
          alt="Space Background Loop"
          className="bg-media"
          style={{ filter: 'brightness(0.65) contrast(1.1)' }}
        />
      )}

      {/* SİNEMATİK YAZI KATMANI */}
      {isIntroStage && (
        <div className="cinematic-overlay">
          <div
            className={`story-floater ${
              stage === 'intro_start'
                ? 'hidden'
                : stage === 'intro_read'
                ? 'visible'
                : 'fading'
            }`}
          >
            <h1 className="cinematic-heading">
              Abandoned, But Not Forgotten
            </h1>
            <p className="cinematic-body">
              Since the 1960s, humanity has sent robotic pioneers across the solar system.
              On the Moon, under the red dust of Mars, and in the freezing dark of deep space,
              our silent explorers wait to tell their stories.
            </p>

            <button
              onClick={handleContinueAfterReading}
              className="continue-cosmos-btn"
              style={{
                pointerEvents: stage === 'intro_read' ? 'auto' : 'none'
              }}
            >
              [ CONTINUE INTO THE COSMOS &gt;&gt; ]
            </button>
          </div>

          <button
            onClick={() => setStage('select')}
            className="retro-btn"
            style={{ position: 'fixed', bottom: '28px', right: '28px', pointerEvents: 'auto', opacity: 0.75 }}
          >
            Skip Intro &gt;&gt;
          </button>
        </div>
      )}

      {/* 3'LÜ SEÇİM EKRANI */}
      {stage === 'select' && (
        <div className="sector-screen">
          <div style={{ textAlign: 'center', maxWidth: '900px' }}>
            <h1 className="pixel-title" style={{ fontSize: 'clamp(20px, 2.8vw, 34px)', color: '#f8fafc', margin: '0 0 12px 0', textShadow: '0 4px 0 #000, 0 0 25px rgba(56,189,248,0.7)', letterSpacing: '3px' }}>
              LANDING SECTOR
            </h1>
          </div>

          <div className="sector-grid">
            {missions.map((m) => (
              <div
                key={m.id}
                onClick={() => handleSelectMission(m)}
                className="retro-sector-card"
                style={{
                  borderColor: m.themeColor,
                  boxShadow: `0 0 28px ${m.themeColor}45, inset 0 0 18px ${m.themeColor}15`
                }}
              >
                <div>
                  <h3 className="pixel-title" style={{ color: m.themeColor, fontSize: '18px', margin: '0 0 4px 0', textShadow: '0 3px 0 #000', letterSpacing: '2px' }}>
                    {m.title.split(':')[0]}
                  </h3>
                  
                  {renderPlanetArt(m.id)}

                  <p className="retro-font" style={{ color: '#cbd5e1', fontSize: '12px', lineHeight: '1.65', marginTop: '6px', textShadow: '0 2px 0 #000' }}>
                    {m.subtitle}
                  </p>
                </div>

                <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <span className="pixel-title" style={{ fontSize: '13px', color: '#fcd34d', letterSpacing: '2px', textShadow: '0 2px 0 #000' }}>
                    LAUNCH &gt;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GEZEGENE İNİŞ VİDEOSU */}
      {stage === 'landing' && selectedMission && (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#000' }}>
          <video
            src={selectedMission.landingVideo}
            autoPlay
            muted
            playsInline
            onEnded={() => setStage('game')}
            onError={() => setStage('game')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <button
            onClick={() => setStage('game')}
            className="retro-btn"
            style={{ position: 'fixed', bottom: '30px', right: '30px' }}
          >
            Skip Landing &gt;&gt;
          </button>
        </div>
      )}

      {/* OYUN EKRANI */}
      {stage === 'game' && selectedMission && currentScene && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px dashed ${selectedMission.themeColor}66`, paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="retro-font" style={{ fontSize: '13px', color: selectedMission.themeColor }}>
                [{selectedMission.title.toUpperCase()}] — LEVEL {currentLevelIndex + 1} / {selectedMission.scenes.length}
              </span>
              <h2 className="pixel-title" style={{ margin: '6px 0 0', fontSize: '18px', color: '#f8fafc' }}>
                {currentScene.title}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span className="retro-font" style={{ color: '#fcd34d', fontSize: '14px' }}>
                SIGNALS: {foundIds.length}/{currentScene.objects.length}
              </span>
              <button onClick={() => setShowHint(!showHint)} className="retro-btn" style={{ borderColor: '#fcd34d', color: '#fcd34d' }}>
                {showHint ? 'HIDE RADAR' : 'RADAR HINT'}
              </button>
              <button onClick={() => setStage('select')} className="retro-btn">
                &lt; SECTORS
              </button>
            </div>
          </header>

          <div style={{ position: 'relative', width: '100%', height: '520px', overflow: 'hidden', border: `3px solid ${selectedMission.themeColor}` }}>
            <img
              src={currentScene.backgroundImage}
              alt={currentScene.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {currentScene.objects.map((obj) => {
              const isFound = foundIds.includes(obj.id);
              return (
                <button
                  key={obj.id}
                  onClick={() => handleObjectClick(obj)}
                  style={{
                    position: 'absolute',
                    left: `${obj.xPercent}%`,
                    top: `${obj.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: isFound ? 'rgba(34, 197, 94, 0.4)' : showHint ? 'rgba(251, 191, 36, 0.35)' : 'transparent',
                    border: isFound ? '3px solid #22c55e' : showHint ? '2px dashed #fbbf24' : 'none',
                    cursor: 'pointer'
                  }}
                />
              );
            })}
          </div>

          {activeObject && !allFoundInLevel && (
            <div style={{ marginTop: '20px', background: '#0f172a', padding: '22px', border: `3px solid ${selectedMission.themeColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="pixel-title" style={{ margin: 0, fontSize: '15px', color: selectedMission.themeColor }}>
                  SIGNAL LOCKED: {activeObject.name}
                </h3>
                <button onClick={() => setActiveObject(null)} className="retro-btn" style={{ padding: '6px 10px' }}>X</button>
              </div>
              <p className="retro-font" style={{ fontSize: '13px', color: '#fcd34d', marginTop: '10px' }}>
                STATUS: {activeObject.status}
              </p>
              <p style={{ lineHeight: '1.7', fontSize: '15px', color: '#f1f5f9' }}>"{activeObject.story}"</p>
              <div style={{ background: '#050811', padding: '12px', borderLeft: '4px solid #38bdf8', fontSize: '13px' }}>
                <strong className="retro-font" style={{ color: '#38bdf8' }}>SCIENCE IMPACT: </strong>
                {activeObject.scienceFact}
              </div>
            </div>
          )}

          <div style={{ marginTop: '20px', background: '#090d1a', padding: '18px', border: '2px solid #1e293b' }}>
            <h4 className="retro-font" style={{ margin: '0 0 12px 0', color: '#94a3b8' }}>
              INCOMING TELEMETRY CLUES (CLICK OBJECTS ON SCENE):
            </h4>
            {currentScene.objects.map((obj) => (
              <div key={obj.id} style={{ padding: '10px 0', borderBottom: '1px dashed #1e293b', color: foundIds.includes(obj.id) ? '#22c55e' : '#e2e8f0' }}>
                <strong className="retro-font">{foundIds.includes(obj.id) ? '[FOUND] ' : '[LOST] '} {obj.name}:</strong> <em>"{obj.clue}"</em>
              </div>
            ))}
          </div>

          {allFoundInLevel && (
            <div style={{ marginTop: '30px', background: '#090d1a', border: '3px solid #22c55e', padding: '28px' }}>
              <h2 className="pixel-title" style={{ color: '#22c55e', marginTop: 0, fontSize: '18px' }}>
                SECTOR COMPLETE! ARCHIVE UNLOCKED
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px', marginBottom: '24px' }}>
                <img src={currentScene.backgroundImage} alt="Original NASA Scene" style={{ width: '100%', border: '2px solid #334155' }} />
                <div>
                  <h3 className="retro-font" style={{ color: selectedMission.themeColor, marginTop: 0 }}>
                    MISSION SUMMARY: {currentScene.title}
                  </h3>
                  <p style={{ lineHeight: '1.7', color: '#cbd5e1' }}>
                    {currentScene.totalStory || "Every piece of hardware in this sector worked together to push the boundaries of human knowledge."}
                  </p>
                  <a
                    href={currentScene.nasaArchiveLink || currentScene.objects[0]?.nasaLink}
                    target="_blank"
                    rel="noreferrer"
                    className="retro-btn"
                    style={{ display: 'inline-block', marginTop: '14px', textDecoration: 'none', borderColor: '#38bdf8', color: '#38bdf8' }}
                  >
                    OFFICIAL NASA ARCHIVE &gt;&gt;
                  </a>
                </div>
              </div>

              <h4 className="retro-font" style={{ color: '#fcd34d', borderBottom: '1px dashed #334155', paddingBottom: '8px' }}>
                RECOVERED HARDWARE LOGS:
              </h4>
              <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
                {currentScene.objects.map((obj) => (
                  <div key={obj.id} style={{ background: '#111827', padding: '14px', borderLeft: `4px solid ${selectedMission.themeColor}` }}>
                    <strong className="retro-font" style={{ color: selectedMission.themeColor }}>{obj.name}</strong>{' '}
                    <span style={{ fontSize: '12px', color: '#fcd34d' }}>({obj.status})</span>
                    <p style={{ margin: '8px 0', fontSize: '14px', color: '#e2e8f0' }}>"{obj.story}"</p>
                    <small style={{ color: '#94a3b8' }}><strong>Science:</strong> {obj.scienceFact}</small>
                  </div>
                ))}
              </div>

              <button onClick={goToNextLevel} className="retro-btn" style={{ background: '#22c55e', color: '#000', borderColor: '#22c55e' }}>
                {currentLevelIndex + 1 < selectedMission.scenes.length ? `NEXT LEVEL (LEVEL ${currentLevelIndex + 2}) >>` : 'RETURN TO SECTORS >>'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}