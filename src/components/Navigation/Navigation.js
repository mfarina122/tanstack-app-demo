import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <Link to="/comments">Commenti</Link>
      <Link to="/posts">Posts</Link>
    </nav>
  );
}

export default Navigation;
