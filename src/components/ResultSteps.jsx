import './ResultSteps.css';

const DIR_LABEL = { up: '상행 ↑', down: '하행 ↓' };

function StepCard({ step, variant, delay }) {
  const style = {
    '--step-color': step.color,
    animationDelay: `${delay}ms`,
  };
  const cls = [
    'step-card',
    variant === 'active' ? 'step-card--active' : '',
    variant === 'done' ? 'step-card--done' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} style={style}>
      <span className="step-eyebrow">{step.label}</span>
      <span className="step-value">{step.value}</span>
      {step.sub && <span className="step-sub">{step.sub}</span>}
      {step.badge && (
        <div className="line-badge" style={{ background: step.color + '18', color: step.color }}>
          <span className="line-dot" style={{ background: step.color }} />
          {step.badge}
        </div>
      )}
    </div>
  );
}

export default function ResultSteps({ result, departure, currentStep, isRunning, maxStops, onMaxStopsChange, onNext }) {
  const { lineName, lineColor, boarding, direction, directionStats, destination } = result;

  const steps = [
    {
      label: '호선',
      value: lineName,
      sub: boarding.matched ? null : `출발역이 ${lineName}에 없어 가장 가까운 역으로 이동`,
      badge: boarding.name,
      color: lineColor,
    },
    {
      label: '방향',
      value: DIR_LABEL[direction],
      sub: `${boarding.name} 기준`,
      color: lineColor,
    },
    destination && {
      label: '목적지',
      value: destination.name,
      sub: `${lineName} · ${DIR_LABEL[direction]}`,
      color: lineColor,
    },
  ].filter(Boolean);

  return (
    <div className="result-section">
      <div className="departure-tag">
        <span className="departure-label">출발</span>
        <span className="departure-name">{departure}</span>
      </div>

      <div className="steps">
        {steps.slice(0, currentStep + 1).map((step, i) => {
          const variant = i === currentStep && isRunning ? 'active' : 'done';
          return <StepCard key={i} step={step} variant={variant} delay={i * 40} />;
        })}
      </div>

      {isRunning && currentStep === 1 && (
        <div className="direction-extras">
          <div className="direction-counts">
            <div className="direction-stat">
              <span className="direction-stat-label">상행 최대</span>
              <span className="direction-stat-value">
                {directionStats.upCount} <span>정거장</span>
              </span>
            </div>
            <div className="direction-divider" />
            <div className="direction-stat">
              <span className="direction-stat-label">하행 최대</span>
              <span className="direction-stat-value">
                {directionStats.downCount} <span>정거장</span>
              </span>
            </div>
          </div>
          <div className="maxstops-row">
            <label className="maxstops-label" htmlFor="maxstops">최대 정거장</label>
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
        <button className="btn-primary" onClick={onNext}>
          {currentStep === 0 ? '방향 뽑기' : '목적지 뽑기'}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 2 }}>
            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
