import { Link } from 'react-router-dom'
import logo from '../../assets/tewiwi-logo.jpeg'

function BrandHeader({ admin = false }) {
  return (
    <header className="brand-bar">
      <Link to="/" className="brand-lockup">
        <img className="brand-logo" src={logo} alt="Logo Tewiwi House" />
        <span className="brand-name">Tewiwi House</span>
      </Link>
      {admin && <span className="admin-label">Dashboard admin</span>}
    </header>
  )
}

export default BrandHeader
