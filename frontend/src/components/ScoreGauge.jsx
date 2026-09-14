export default function ScoreGauge({
  score = 0,
  size = 132,
  label = 'ATS Score',
}) {
  const clamped = Math.max(0, Math.min(100, score))
  const radius = (size - 14) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - clamped / 100)

  const color =
    clamped >= 75
      ? '#16a34a'
      : clamped >= 45
        ? '#2563eb'
        : '#ef4444'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible' }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
        />

        {/* Score circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease',
          }}
        />

        {/* Score */}
        <text
          x="50%"
          y="47%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize={size * 0.26}
          fontWeight="800"
          fill="#0f172a"
        >
          {Math.round(clamped)}
        </text>

        {/* Out of 100 */}
        <text
          x="50%"
          y="65%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize={size * 0.1}
          fontWeight="600"
          fill="#94a3b8"
        >
          /100
        </text>
      </svg>

      <span
        style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#475569',
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </span>
    </div>
  )
}