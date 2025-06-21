import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import background from '../assets/fundo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5174/api/Auth/login', {
        email,
        senha
      });
      localStorage.setItem('token', res.data.token);
      navigate('/motos'); // redireciona após login
    } catch (err) {
      alert('Login inválido');
      console.error(err);
    }
  };

  return (
    <>
      {/* Fundo da tela inteira */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1
        }}
      ></div>

      {/* Container do formulário */}
      <div
        className="align-items-center justify-content-center"
        style={{ minHeight: '100vh', display: 'flex' }}
      >
        <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          <h3 className="text-center mb-4">Login</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Entrar</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
