import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Crud.css';

function MotoCrud() {
  const baseUrl = "http://localhost:5174/api/Motos";

  const [motos, setMotos] = useState([]);
  const [motoSelecionado, setMotoSelecionado] = useState({
    id: '',
    modelo: '',
    marca: '',
    cor: '',
    chassi: ''
  });

  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(false);

  
  const abrirModal = (setModal) => () => setModal(true);
  const fecharModal = (setModal) => () => setModal(false);

  
  const handleChange = e => {
    const { name, value } = e.target;
    setMotoSelecionado(prev => ({ ...prev, [name]: value }));
  };

  
  const selecionarMoto = (moto, acao) => {
    setMotoSelecionado(moto);
    if (acao === 'Editar') setModalEditar(true);
    else if (acao === 'Excluir') setModalExcluir(true);
    else if (acao === 'Detalhes') setModalDetalhes(true);
  };

  //Buscar Moto
  const getMotos = () => {
    axios.get(baseUrl)
      .then(res => setMotos(res.data))
      .catch(console.error);
  };

  // Adicionar moto
  const postMoto = () => {
    const novo = { ...motoSelecionado };
    delete novo.id;

    axios.post(baseUrl, novo)
      .then(res => {
        setMotos([...motos, res.data]);
        setModalIncluir(false);
      })
      .catch(console.error);
  };

  // Atualizar moto
  const putMoto = () => {
    axios.put(`${baseUrl}/${motoSelecionado.id}`, motoSelecionado)
      .then(res => {
        const motosAtualizadas = motos.map(moto =>
          moto.id === res.data.id ? res.data : moto
        );
        setMotos(motosAtualizadas);
        setModalEditar(false);
      })
      .catch(console.error);
  };

  // Deletar moto
  const deleteMoto = () => {
    axios.delete(`${baseUrl}/${motoSelecionado.id}`)
      .then(() => {
        setMotos(motos.filter(moto => moto.id !== motoSelecionado.id));
        setModalExcluir(false);
      })
      .catch(console.error);
  };

  // Carregar motos no carregamento
  useEffect(() => {
    getMotos();
  }, []);

  return (
    <div className="crud-container">
      <h3>Cadastro de Motos</h3>
      <button className="btn btn-success" onClick={() => {
        setMotoSelecionado({ id: '', modelo: '', marca: '', cor: '', chassi: '' });
        setModalIncluir(true);
      }}>Novo Moto</button>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Cor</th>
            <th>Chassi</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {motos.map(moto => (
            <tr key={moto.id}>
              <td>{moto.id}</td>
              <td>{moto.modelo}</td>
              <td>{moto.marca}</td>
              <td>{moto.cor}</td>
              <td>{moto.chassi}</td>
              <td>
                <button className="btn btn-primary" onClick={() => selecionarMoto(moto, 'Editar')}>Editar</button>{' '}
                <button className="btn btn-danger" onClick={() => selecionarMoto(moto, 'Excluir')}>Excluir</button>{' '}
                <button className="btn btn-info" onClick={() => selecionarMoto(moto, 'Detalhes')}>Detalhes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir} toggle={fecharModal(setModalIncluir)}>
        <ModalHeader toggle={fecharModal(setModalIncluir)}>Novo Moto</ModalHeader>
        <ModalBody>
          <InputForm moto={motoSelecionado} handleChange={handleChange} />
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={postMoto}>Salvar</button>
          <button className="btn btn-secondary" onClick={fecharModal(setModalIncluir)}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar} toggle={fecharModal(setModalEditar)}>
        <ModalHeader toggle={fecharModal(setModalEditar)}>Editar Moto</ModalHeader>
        <ModalBody>
          <InputForm moto={motoSelecionado} handleChange={handleChange} />
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={putMoto}>Salvar</button>
          <button className="btn btn-secondary" onClick={fecharModal(setModalEditar)}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir} toggle={fecharModal(setModalExcluir)}>
        <ModalHeader toggle={fecharModal(setModalExcluir)}>Excluir Moto</ModalHeader>
        <ModalBody>
          Confirma a exclusão da moto <strong>{motoSelecionado.modelo}</strong>?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={deleteMoto}>Sim</button>
          <button className="btn btn-secondary" onClick={fecharModal(setModalExcluir)}>Não</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDetalhes} toggle={fecharModal(setModalDetalhes)}>
        <ModalHeader toggle={fecharModal(setModalDetalhes)}>Detalhes da Moto</ModalHeader>
        <ModalBody>
          <p><strong>Modelo:</strong> {motoSelecionado.modelo}</p>
          <p><strong>Marca:</strong> {motoSelecionado.marca}</p>
          <p><strong>Cor:</strong> {motoSelecionado.cor}</p>
          <p><strong>Chassi:</strong> {motoSelecionado.chassi}</p>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" onClick={fecharModal(setModalDetalhes)}>Fechar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

function InputForm({ moto, handleChange }) {
  return (
    <>
      <label>Modelo:</label>
      <input type="text" className="form-control" name="modelo" value={moto.modelo} onChange={handleChange} />

      <label>Marca:</label>
      <input type="text" className="form-control" name="marca" value={moto.marca} onChange={handleChange} />

      <label>Cor:</label>
      <input type="text" className="form-control" name="cor" value={moto.cor} onChange={handleChange} />

      <label>Chassi:</label>
      <input type="text" className="form-control" name="chassi" value={moto.chassi} onChange={handleChange} />
    </>
  );
}

export default MotoCrud;