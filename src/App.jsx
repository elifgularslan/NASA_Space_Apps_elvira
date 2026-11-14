import { useState } from 'react';
import { moonData } from './data/moonData';
import { marsData } from './data/marsData';
import { deepSpaceData } from './data/deepSpaceData';

const missions = [moonData, marsData, deepSpaceData];

export default function App() {
  const [selectedMission, setSelectedMission] = useState(null);
  const [foundIds, setFoundIds] = useState([]);
  const [activeObject, setActiveObject] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Kategori seçildiğinde sıfırla
  const startMission = (mission) => {
    setSelectedMission(mission);
    setFoundIds([]);
    setActiveObject(null);
    setShowHint(false);
  };

  const currentScene = selectedMission?.scenes[0];

  const handleObjectClick = (obj) => {
    if (!foundIds.includes(obj.id)) {
      setFoundIds([...foundIds, obj.id]);
    }
    setActiveObject(obj);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff', fontFamily: 'sans-serif', padding: '20px' }}>
      {/* ÜST BAR */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '15px', marginBottom: '25px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#38bdf8' }}>🚀 Abandoned, But Not Forgotten</h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94a3b8' }}>NASA Space Apps Challenge — Interactive Hardware Storyteller</p>
        </div>
        {selectedMission && (
          <button
            onClick={() => setSelectedMission(null)}
            style={{ padding: '8px 16px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' }}
          >
            ← Back to Missions
          </button>
        )}
      </header>

      {/* 1. EKRAN: 3 ANA KATEGORİ SEÇİMİ */}
      {!selectedMission ? (
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2>Select a Sector to Scan for Lost NASA Hardware</h2>
          <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Locate the equipment hidden in the scene, establish signal connection, and unlock their stories.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {missions.map((m) => (
              <div
                key={m.id}
                onClick={() => startMission(m)}
                style={{ background: '#111827', border: `2px solid ${m.themeColor}`, borderRadius: '12px', padding: '24px', cursor: 'pointer', textAlign: 'left' }}
              >
                <h3 style={{ color: m.themeColor, marginTop: 0 }}>{m.title}</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px' }}>{m.subtitle}</p>
                <span style={{ display: 'inline-block', marginTop: '10px', fontSize: '13px', color: m.themeColor, fontWeight: 'bold' }}>
                  Launch Scanner →
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 2. EKRAN: 2D OYUN VE HİKÂYE SAHNESİ */
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 style={{ margin: 0, color: selectedMission.themeColor }}>{currentScene.title}</h2>
            <div>
              <span style={{ marginRight: '15px', color: '#94a3b8' }}>
                Signals Found: <strong>{foundIds.length} / {currentScene.objects.length}</strong>
              </span>
              <button
                onClick={() => setShowHint(!showHint)}
                style={{ padding: '6px 14px', background: '#334155', color: '#fbbf24', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                {showHint ? 'Hide Radar Hint' : '📡 Radar Hint'}
              </button>
            </div>
          </div>

          {/* 2D FOTOĞRAF VE TIKLANABİLİR NESNELER */}
          <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #1e293b' }}>
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
                  title="Click to inspect signal"
                  style={{
                    position: 'absolute',
                    left: `${obj.xPercent}%`,
                    top: `${obj.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: isFound ? 'rgba(34, 197, 94, 0.35)' : showHint ? 'rgba(251, 191, 36, 0.35)' : 'transparent',
                    border: isFound ? '2px solid #22c55e' : showHint ? '2px dashed #fbbf24' : 'none',
                    cursor: 'pointer'
                  }}
                />
              );
            })}
          </div>

          {/* ALT BAR: ARANACAK NESNE İPUÇLARI */}
          <div style={{ marginTop: '20px', background: '#111827', padding: '16px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>📡 Incoming Signal Clues (Click the matching hardware on the photo above):</h4>
            {currentScene.objects.map((obj) => (
              <div key={obj.id} style={{ padding: '8px 0', borderBottom: '1px solid #1e293b', color: foundIds.includes(obj.id) ? '#22c55e' : '#e2e8f0' }}>
                <strong>{foundIds.includes(obj.id) ? '✅ [FOUND] ' : '🔍 [LOST] '} {obj.name}:</strong> <em>"{obj.clue}"</em>
              </div>
            ))}
          </div>

          {/* HİKÂYE PENCERESİ (MODAL) */}
          {activeObject && (
            <div style={{ marginTop: '20px', background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: `5px solid ${selectedMission.themeColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ marginTop: 0, color: selectedMission.themeColor }}>🤖 {activeObject.name}</h3>
                <button onClick={() => setActiveObject(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}>✕</button>
              </div>
              <p style={{ fontSize: '13px', color: '#fbbf24' }}><strong>Current Status:</strong> {activeObject.status}</p>
              <p style={{ lineHeight: '1.6', fontSize: '16px' }}>"{activeObject.story}"</p>
              <p style={{ background: '#0f172a', padding: '10px', borderRadius: '6px', fontSize: '14px' }}>
                <strong>🔬 The Science It Made Possible:</strong> {activeObject.scienceFact}
              </p>
              <a href={activeObject.nasaLink} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontSize: '14px' }}>
                View Official NASA Mission Archive ↗
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}