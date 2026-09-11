import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './lib/store';
import Dashboard from './pages/Dashboard';
import SubmitArticle from './pages/SubmitArticle';
import ContentQueue from './pages/ContentQueue';
import Login from './pages/Login';
import Layout from './components/Layout';

function App() {
  const { isAuthenticated } = useStore();

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/submit" element={<SubmitArticle />} />
          <Route path="/queue" element={<ContentQueue />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
