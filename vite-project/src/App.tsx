import { Routes, Route } from 'react-router-dom';
import HomePage from '../src/pages/Mainpage';
import LoginPage from '../src/pages/LoginPage';
import AdminPage from '../src/pages/AdmiPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<LoginPage />} />
      <Route path="/adminPage" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
