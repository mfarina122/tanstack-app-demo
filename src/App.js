import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import CommentsPage from './pages/CommentsPage';
import PostsPage from './pages/PostsPage';
import UsersPage from './pages/UsersPage';
import PeoplePage from './pages/PeoplePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Demo Tanstack Table - Componente Riutilizzabile</h1>
        <Navigation />
        
        <Routes>
          <Route path="/" element={<Navigate to="/comments" replace />} />
          <Route path="/comments" element={<CommentsPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/people" element={<PeoplePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
