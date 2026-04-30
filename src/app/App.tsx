import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';
import AdminHQ from './pages/AdminHQ';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/admin-hq" element={<AdminHQ />} />
      </Routes>
    </Router>
  );
}
