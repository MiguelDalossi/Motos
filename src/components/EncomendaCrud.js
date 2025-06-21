import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import './Crud.css';

function EncomendaCrud() {
  const baseUrl = 'http://localhost:5174/api/EncomendaMotos';
  const clientesUrl = 'http://localhost:5174/api/Clientes';
  const motosUrl = 'http://localhost:5174/api/Motos';

  const [data, setData] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [motos, setMotos] = useState([]);

  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(false);

  const [encomenda, setEncomenda] = useState({
    id: '',
    motoId: '',
    modelo: '',
    cor: '',
    cep: '',
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    clienteId: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setEncomenda({ ...encomenda, [name]: value });
  };

  const buscarEndereco = async cep => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.data.erro) {
        setEncomenda(prev => ({
          ...prev,
          logradouro: response.data.logradouro,
          bairro: response.data.bairro,
          localidade: response.data.localidade,
          uf: response.data.uf
        }));
      }
    } catch (error) {
      console.log('Erro ao buscar CEP:', error);
    }
  };

  const abrirFecharModalIncluir = () => {
    setEncomenda({
      id: '',
      motoId: '',
      modelo: '',
      cor: '',
      cep: '',
      logradouro: '',
      bairro: '',
      localidade: '',
      uf: '',
      clienteId: ''
    });
    setModalIncluir(!modalIncluir);
  };

  const abrirFecharModalDetalhes = () => setModalDetalhes(!modalDetalhes);

  const carregarEncomendas = async () => {
    try {
      const res = await axios.get(baseUrl);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const carregarClientes = async () => {
    try {
      const res = await axios.get(clientesUrl);
      setClientes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const carregarMotos = async () => {
    try {
      const res = await axios.get(motosUrl);
      setMotos(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const cadastrarEncomenda = async () => {
    try {
      const motoSelecionada = motos.find(m => m.id.toString() === encomenda.motoId.toString());
      const encomendaParaEnviar = {
        ...encomenda,
        modelo: motoSelecionada ? motoSelecionada.modelo : encomenda.modelo,
        cor: motoSelecionada ? motoSelecionada.cor : encomenda.cor
      };
      await axios.post(baseUrl, encomendaParaEnviar);
      carregarEncomendas();
      abrirFecharModalIncluir();
    } catch (error) {
      console.log(error);
    }
  };

  const excluirEncomenda = async id => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
      carregarEncomendas();
    } catch (error) {
      console.log(error);
    }
  };

  const selecionarEncomenda = (encomendaSelecionada, acao) => {
    setEncomenda(encomendaSelecionada);
    if (acao === "Detalhes") abrirFecharModalDetalhes();
  };

  useEffect(() => {
    carregarEncomendas();
    carregarClientes();
    carregarMotos();
  }, []);

  const clienteSelecionado = clientes.find(c => c.id === encomenda.clienteId);

  return (
    <div className="crud-container">
      <h3>Encomendas</h3>
      <button className="btn btn-success" onClick={abrirFecharModalIncluir}>Nova Encomenda</button>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Modelo</th>
            <th>Cor</th>
            <th>CEP</th>
            <th>Cliente</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.modelo}</td>
              <td>{e.cor}</td>
              <td>{e.cep}</td>
              <td>{e.clienteId}</td>
              <td>
                <button className="btn btn-info" onClick={() => selecionarEncomenda(e, "Detalhes")}>Detalhes</button>{" "}
                <button className="btn btn-danger" onClick={() => excluirEncomenda(e.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Nova Encomenda</ModalHeader>
        <ModalBody>
          <label>Moto:</label>
          <select
            className="form-control mb-2"
            name="motoId"
            value={encomenda.motoId}
            onChange={handleChange}
          >
            <option value="">Selecione uma moto</option>
            {motos.map(moto => (
              <option key={moto.id} value={moto.id}>
                {moto.modelo} - {moto.cor}
              </option>
            ))}
          </select>

          <input
            className="form-control mb-2"
            name="cep"
            placeholder="CEP"
            value={encomenda.cep}
            onBlur={e => buscarEndereco(e.target.value)}
            onChange={handleChange}
          />
          <input
            className="form-control mb-2"
            name="logradouro"
            placeholder="Logradouro"
            value={encomenda.logradouro}
            onChange={handleChange}
          />
          <input
            className="form-control mb-2"
            name="bairro"
            placeholder="Bairro"
            value={encomenda.bairro}
            onChange={handleChange}
          />
          <input
            className="form-control mb-2"
            name="localidade"
            placeholder="Cidade"
            value={encomenda.localidade}
            onChange={handleChange}
          />
          <input
            className="form-control mb-2"
            name="uf"
            placeholder="UF"
            value={encomenda.uf}
            onChange={handleChange}
          />

          <label>Cliente:</label>
          <select
            className="form-control mb-2"
            name="clienteId"
            value={encomenda.clienteId}
            onChange={handleChange}
          >
            <option value="">Selecione um cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={cadastrarEncomenda}>Salvar</button>
          <button className="btn btn-secondary" onClick={abrirFecharModalIncluir}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDetalhes}>
        <ModalHeader>Detalhes da Encomenda</ModalHeader>
        <ModalBody>
          <p><strong>Moto:</strong> {encomenda.modelo} - {encomenda.cor}</p>
          <p><strong>CEP:</strong> {encomenda.cep}</p>
          <p><strong>Logradouro:</strong> {encomenda.logradouro}</p>
          <p><strong>Bairro:</strong> {encomenda.bairro}</p>
          <p><strong>Cidade:</strong> {encomenda.localidade}</p>
          <p><strong>UF:</strong> {encomenda.uf}</p>
          <p><strong>Cliente:</strong> {clienteSelecionado ? clienteSelecionado.nome : 'Não encontrado'}</p>
          <p><strong>Email:</strong> {clienteSelecionado ? clienteSelecionado.email : 'Não encontrado'}</p>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" onClick={abrirFecharModalDetalhes}>Fechar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default EncomendaCrud;