import './ResultSteps.css';

const DIRECTION_LABEL = { up: '상행 ↑', down: '하행 ↓' };

export default function ResultSteps({ result, departure, currentStep, isRunning, maxStops, onMaxStopsChange, onNext, onReset }) {
  const { lineName, lineColor, boarding, direction, directionStats, destination } = result;

  const steps = [
    {
      label: '호선',
      value: lineName,
      sub: boarding.matched
        ? null
        : `출발역이 ${lineName}에 없어서 가장 가까운 역으로 이동`,
      color: lineColor,
    },
    {
      label: '방향',
      value: DIRECTION_LABEL[direction],
      sub: `${boarding.name}역 기준`,
      color: lineColor,
    },
    destination && {
      label: '목적지',
      value: destination.name,
      sub: `${lineName} ${DIRECTION_LABEL[direction]}`,
      color: lineColor,
    },
  ].filter(Boolean);

  const done = currentStep >= 2 && !isRunning;

  return (
    <div className="result-section">
      <div className="departure-tag">
        <span className="departure-label">출발</span>
        <span className="departure-name">{departure}</span>
      </div>
      <div className="steps">
        {steps.slice(0, currentStep + 1).map((step, i) => (
          <div
            key={i}
            className={`step-card ${i === currentStep ? 'step-card--active' : 'step-card--done'}`}
            style={{ '--line-color': step.color }}
          >
            <span className="step-label">{step.label}</span>
            <span className="step-value">{step.value}</span>
            {step.sub && <span className="step-sub">{step.sub}</span>}
          </div>
        ))}
      </div>

      <div className="result-actions">
        {isRunning && currentStep === 1 && (
          <div className="direction-extras">
            <div className="direction-counts">
              <span>상행 최대 <strong>{directionStats.upCount}</strong>정거장</span>
              <span className="divider">·</span>
              <span>하행 최대 <strong>{directionStats.downCount}</strong>정거장</span>
            </div>
            <div className="maxstops-row">
              <label className="maxstops-label" htmlFor="maxstops">최대 정거장 수</label>
              <input
                id="maxstops"
                className="maxstops-input"
                type="number"
                min="1"
                max={direction === 'up' ? directionStats.upCount : directionStats.downCount}
                value={maxStops}
                onChange={(e) => onMaxStopsChange(e.target.value)}
                placeholder="제한 없음"
              />
            </div>
          </div>
        )}
        {isRunning && (
          <button className="next-btn" onClick={onNext}>
            {currentStep === 0 ? '방향 뽑기 →' : currentStep === 1 ? '목적지 뽑기 →' : ''}
          </button>
        )}
        {done && (
          <>
            <div className="final-msg">🎉 오늘의 목적지는 <strong>{destination.name}</strong>!</div>
            <button className="reset-btn" onClick={onReset}>다시 뽑기</button>
          </>
        )}
      </div>
    </div>
  );
}
