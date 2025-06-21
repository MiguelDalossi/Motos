import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MotoCrud from './components/MotoCrud';
import ClienteCrud from './components/ClienteCrud';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import EncomendaCrud from './components/EncomendaCrud';

function App() {
  return (
    <Router>
      <Header />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/motos" />} />
          <Route path="/motos" element={<MotoCrud />} />
          <Route path="/clientes" element={<ClienteCrud />} />
          <Route path="/encomendas" element={<EncomendaCrud />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;