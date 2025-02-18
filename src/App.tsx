import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Links } from './pages/Links';
import { Admin } from './pages/Admin';
import { Downloads } from './pages/Downloads';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/links" element={<Links />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/downloads" element={<Downloads />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
