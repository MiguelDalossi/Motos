import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MotoCrud from './components/MotoCrud';
import ClienteCrud from './components/ClienteCrud';
import EncomendaCrud from './components/EncomendaCrud';
import Header from './components/Header';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Header />
      <div className="container mt-4">
        <Routes>
          {/* Rota pública */}
          <Route path="/" element={<Login />} />

          {/* Rotas privadas */}
          <Route
            path="/motos"
            element={
              <PrivateRoute>
                <MotoCrud />
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <ClienteCrud />
              </PrivateRoute>
            }
          />
          <Route
            path="/encomendas"
            element={
              <PrivateRoute>
                <EncomendaCrud />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;