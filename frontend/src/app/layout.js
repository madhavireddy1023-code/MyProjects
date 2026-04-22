import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Estimator from '../pages/Estimator';
import Analysis from '../pages/Analysis';
import Comparison from '../pages/Comparison';
import '../App.css';

function Nav() {
  const location = useLocation();
  
  return (
    <nav className="nav">
      <div className="container">
        <h1 className="text-2xl font-bold text-blue-600">Housing Estimator</h1>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Estimator
          </Link>
          <Link to="/comparison" className={location.pathname === '/comparison' ? 'active' : ''}>
            Comparison
          </Link>
          <Link to="/analysis" className={location.pathname === '/analysis' ? 'active' : ''}>
            Analysis
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function Layout({ children }) {
  return (
    <BrowserRouter>
      <div className="app">
        <Nav />
        <div className="container">
          <Routes>
            <Route path="/" element={<Estimator />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
