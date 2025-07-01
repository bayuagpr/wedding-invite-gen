import { Routes, Route, Navigate } from 'react-router-dom';
import TemplatesPage from './pages/TemplatesPage';
import GuestsPage from './pages/GuestsPage';
import ExportPage from './pages/ExportPage';
import HelpPage from './pages/HelpPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TemplatesPage />} />
      <Route path="/templates" element={<Navigate to="/" replace />} />
      <Route path="/guests" element={<GuestsPage />} />
      <Route path="/export" element={<ExportPage />} />
      <Route path="/help" element={<HelpPage />} />
      {/* Catch all other routes and redirect to templates */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;