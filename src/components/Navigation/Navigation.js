import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <NavLink to="/comments" className={({ isActive }) => isActive ? 'active' : ''}>
        Comments
      </NavLink>
      <NavLink to="/posts" className={({ isActive }) => isActive ? 'active' : ''}>
        Posts
      </NavLink>
      <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
        Users
      </NavLink>
      <NavLink to="/people" className={({ isActive }) => isActive ? 'active' : ''}>
        People
      </NavLink>
    </nav>
  );
};

export default Navigation;
