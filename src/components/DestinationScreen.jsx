import { useEffect, useRef } from 'react';
import './DestinationScreen.css';

const DIR_LABEL = { up: '상행 ↑', down: '하행 ↓' };

function ConfettiCanvas({ color }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    function hexToRgb(hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    }
    const [r, g, b] = hexToRgb(color || '#15C5CE');
    const palette = [
      'rgba(255,255,255,0.9)',
      `rgba(${r},${g},${b},0.6)`,
      'rgba(255,255,255,0.6)',
      `rgba(${Math.min(r + 60, 255)},${Math.min(g + 60, 255)},${Math.min(b + 60, 255)},0.8)`,
      'rgba(255,255,255,0.4)',
    ];

    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 200,
      w: 6 + Math.random() * 8,
      h: 3 + Math.random() * 5,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.12,
      vx: (Math.random() - 0.5) * 2.5,
      vy: 2.5 + Math.random() * 3.5,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));

    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;
        p.vy += 0.04;
        if (p.y > canvas.height + 20) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
          p.vy = 2.5 + Math.random() * 3.5;
        }
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [color]);

  return <canvas ref={canvasRef} className="confetti-canvas" />;
}

function destStationSize(name) {
  const len = name.length;
  if (len <= 4) return '64px';
  if (len <= 6) return '52px';
  if (len <= 8) return '40px';
  return '32px';
}

export default function DestinationScreen({ destination, result, onReset }) {
  const { lineName, lineColor, direction } = result;

  return (
    <div className="dest-screen" style={{ background: lineColor }}>
      <div className="door-left" style={{ background: lineColor, filter: 'brightness(0.82)' }}>
        <div className="door-inner-line" />
        <div className="door-handle" />
      </div>
      <div className="door-right" style={{ background: lineColor, filter: 'brightness(0.82)' }}>
        <div className="door-inner-line" />
        <div className="door-handle" />
      </div>

      <ConfettiCanvas color={lineColor} />

      <div className="dest-content">
        <p className="dest-eyebrow">오늘의 목적지</p>
        <h1 className="dest-station" style={{ fontSize: destStationSize(destination.name), whiteSpace: 'nowrap' }}>{destination.name}</h1>
        <div className="dest-line-badge">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
          {lineName} · {DIR_LABEL[direction]}
        </div>
        <button className="dest-again-btn" onClick={onReset}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1.5 7a5.5 5.5 0 1010.5-2.3M1.5 4v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          다시 뽑기
        </button>
      </div>
    </div>
  );
}
