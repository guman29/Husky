// Small dependency-free bar chart (plain CSS, no charting library) used by
// the grooming and activity logs to show the last 7 days at a glance.
function MiniBarChart({ data, ariaLabel }) {
  const max = Math.max(1, ...data.map((point) => point.value))

  return (
    <div className="mini-chart" role="img" aria-label={ariaLabel}>
      {data.map((point, index) => (
        <div className="mini-chart-bar-wrap" key={`${point.label}-${index}`}>
          <div
            className="mini-chart-bar"
            style={{ height: `${(point.value / max) * 100}%` }}
            title={`${point.label}: ${point.value}`}
          />
          <span className="mini-chart-label">{point.label}</span>
        </div>
      ))}
    </div>
  )
}

export default MiniBarChart
