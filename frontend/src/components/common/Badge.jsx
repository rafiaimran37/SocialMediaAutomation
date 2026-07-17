function Badge({ children, className = '', ...props }) {
  return (
    <span className={`badge ${className}`.trim()} {...props}>
      {children}
    </span>
  )
}

export default Badge