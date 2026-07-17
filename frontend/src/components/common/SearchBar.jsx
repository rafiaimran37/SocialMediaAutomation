function SearchBar({ placeholder = 'Search', className = '', ...props }) {
  return <input type="search" className={`search-bar ${className}`.trim()} placeholder={placeholder} {...props} />
}

export default SearchBar