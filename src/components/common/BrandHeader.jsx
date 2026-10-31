import { Link } from 'react-router-dom'

function BrandHeader({ admin = false }) {
  return (
    <header className="brand-bar">
      <Link to="/" className="brand-name">
        Tewiwi House
      </Link>
      {admin && <span className="admin-label">Dashboard admin</span>}
    </header>
  )
}

export default BrandHeader
