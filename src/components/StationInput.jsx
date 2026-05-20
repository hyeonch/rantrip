import { useState, useRef } from 'react';
import { getAllStationNames } from '../utils/subway';
import './StationInput.css';

const ALL_STATIONS = getAllStationNames();

const CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JAMO_SET = new Set('ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ');

function extractChosung(str) {
  return [...str].map(ch => {
    const code = ch.charCodeAt(0);
    return (code >= 0xAC00 && code <= 0xD7A3) ? CHOSUNG[(code - 0xAC00) / 588 | 0] : ch;
  }).join('');
}

function getMatches(query) {
  if (!query) return [];
  const q = query.replace(/역$/, '');
  if (!q) return [];

  const isChosung = [...q].every(ch => JAMO_SET.has(ch));

  if (isChosung) {
    return ALL_STATIONS
      .filter(s => extractChosung(s).includes(q))
      .sort((a, b) => (extractChosung(a).startsWith(q) ? 0 : 1) - (extractChosung(b).startsWith(q) ? 0 : 1))
      .slice(0, 6);
  }

  return ALL_STATIONS
    .filter(s => s.includes(q))
    .sort((a, b) => (a.startsWith(q) ? 0 : 1) - (b.startsWith(q) ? 0 : 1))
    .slice(0, 6);
}

function MatchText({ text, query }) {
  const q = query.replace(/역$/, '');
  if (!q || [...q].every(ch => JAMO_SET.has(ch))) return <>{text}</>;
  const idx = text.indexOf(q);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export default function StationInput({ value, onChange, onStart }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [trackedValue, setTrackedValue] = useState(value);
  const inputRef = useRef(null);
  const prevNoMatchRef = useRef(false);

  // Reset to first item whenever search value changes (runs during render, no extra paint)
  if (trackedValue !== value) {
    setTrackedValue(value);
    setActiveIdx(0);
  }

  const filtered = getMatches(value);
  const showDropdown = filtered.length > 0 && filtered[0] !== value;
  const noMatch = value.trim() !== '' && filtered.length === 0;

  function triggerShake() {
    const el = inputRef.current;
    if (!el) return;
    el.classList.remove('station-input--shake');
    void el.offsetWidth;
    el.classList.add('station-input--shake');
  }

  function handleSelect(name) {
    onChange(name);
  }

  function handleChange(e) {
    const newVal = e.target.value;
    onChange(newVal);

    const hasNoMatch = newVal.trim() !== '' && getMatches(newVal).length === 0;
    if (hasNoMatch && !prevNoMatchRef.current) triggerShake();
    prevNoMatchRef.current = hasNoMatch;
  }

  function handleTryStart(stationName) {
    if (noMatch) {
      triggerShake();
      return;
    }
    onStart(stationName);
  }

  function handleKey(e) {
    if (!showDropdown) {
      if (e.key === 'Enter') handleTryStart();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => (i <= 0 ? filtered.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      handleTryStart(filtered[activeIdx]);
    } else if (e.key === 'Escape') {
      setActiveIdx(0);
    }
  }

  return (
    <div className="input-section">
      <p className="input-label">지금 어디 있어?</p>
      <div className="input-wrap">
        <input
          ref={inputRef}
          className={`station-input${noMatch ? ' station-input--noresult' : ''}`}
          type="text"
          placeholder="출발역 입력"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKey}
          autoComplete="off"
        />
        {showDropdown && (
          <ul className="autocomplete">
            {filtered.map((name, i) => (
              <li
                key={name}
                className={i === activeIdx ? 'active' : ''}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(name); }}
              >
                <MatchText text={name} query={value} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className="start-btn"
        onClick={() => handleTryStart(showDropdown ? filtered[activeIdx] : undefined)}
        disabled={!value.trim()}
      >
        운명에 맡기기 🎲
      </button>
    </div>
  );
}
