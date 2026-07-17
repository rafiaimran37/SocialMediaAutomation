function StatusBadge({ status, className = '' }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`.trim()}>{formatStatus(status)}</span>
}

function formatStatus(status) {
  return status
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

export default StatusBadge