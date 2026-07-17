function Input({ label, id, className = '', ...props }) {
  return (
    <label className={`input ${className}`.trim()} htmlFor={id}>
      <span className="input__label">{label}</span>
      <input id={id} className="input__field" {...props} />
    </label>
  )
}

export default Input