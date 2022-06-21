import { Link } from "react-router-dom"

const Navbar = () => {

  return (
    <nav id='menu'>
      <h2>Menu</h2>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/test'>DNA Test</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar