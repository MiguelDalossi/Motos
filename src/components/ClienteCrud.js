import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './Crud.css';  

function ClienteCrud() {
  const baseUrl = "http://localhost:5174/api/Clientes";

  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState({
    id: 0,
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: ''
  });

  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(false);

  // Limpa o cliente selecionado e abre o modal de inclusão
  const abrirModalIncluir = () => {
    setClienteSelecionado({
      id: 0,
      nome: '',
      email: '',
      telefone: '',
      cep: '',
      logradouro: '',
      bairro: '',
      localidade: '',
      uf: ''
    });
    setModalIncluir(true);
  };

  const fecharModal = (setModal) => () => setModal(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setClienteSelecionado(prev => ({ ...prev, [name]: value }));

    if (name === 'cep' && value.length === 8) {
      axios.get(`https://viacep.com.br/ws/${value}/json/`)
        .then(response => {
          if (!response.data.erro) {
            setClienteSelecionado(prev => ({
              ...prev,
              logradouro: response.data.logradouro || '',
              bairro: response.data.bairro || '',
              localidade: response.data.localidade || '',
              uf: response.data.uf || ''
            }));
          }
        }).catch(error => console.error("Erro ao buscar CEP:", error));
    }
  };

  const selecionarCliente = (cliente, acao) => {
    setClienteSelecionado(cliente);
    if (acao === 'Editar') setModalEditar(true);
    else if (acao === 'Excluir') setModalExcluir(true);
    else if (acao === 'Detalhes') setModalDetalhes(true);
  };

  const getClientes = () => {
    axios.get(baseUrl)
      .then(response => setClientes(response.data))
      .catch(console.error);
  };

  const postCliente = () => {
    axios.post(baseUrl, clienteSelecionado)
      .then(response => {
        setClientes([...clientes, response.data]);
        setModalIncluir(false);
      }).catch(error => {
        console.error("Erro ao salvar cliente:", error);
        alert("Erro ao salvar cliente. Veja o console para detalhes.");
      });
  };

  const putCliente = () => {
    axios.put(`${baseUrl}/${clienteSelecionado.id}`, clienteSelecionado)
      .then(response => {
        const atualizados = clientes.map(c =>
          c.id === response.data.id ? response.data : c
        );
        setClientes(atualizados);
        setModalEditar(false);
      }).catch(console.error);
  };

  const deleteCliente = () => {
    axios.delete(`${baseUrl}/${clienteSelecionado.id}`)
      .then(() => {
        setClientes(clientes.filter(c => c.id !== clienteSelecionado.id));
        setModalExcluir(false);
      }).catch(console.error);
  };

  useEffect(() => {
    getClientes();
  }, []);

  return (
    <div className="crud-container">
      <h3>Cadastro de Clientes</h3>
      <button className="btn btn-success" onClick={abrirModalIncluir}>Novo Cliente</button>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th><th>Nome</th><th>Email</th><th>Telefone</th><th>CEP</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nome}</td>
              <td>{c.email}</td>
              <td>{c.telefone}</td>
              <td>{c.cep}</td>
              <td>
                <button className="btn btn-primary" onClick={() => selecionarCliente(c, 'Editar')}>Editar</button>{' '}
                <button className="btn btn-danger" onClick={() => selecionarCliente(c, 'Excluir')}>Excluir</button>{' '}
                <button className="btn btn-info" onClick={() => selecionarCliente(c, 'Detalhes')}>Detalhes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Incluir */}
      <Modal isOpen={modalIncluir} toggle={fecharModal(setModalIncluir)}>
        <ModalHeader toggle={fecharModal(setModalIncluir)}>Novo Cliente</ModalHeader>
        <ModalBody>
          <InputForm handleChange={handleChange} cliente={clienteSelecionado} />
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={postCliente}>Salvar</button>
          <button className="btn btn-secondary" onClick={fecharModal(setModalIncluir)}>Cancelar</button>
        </ModalFooter>
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={modalEditar} toggle={fecharModal(setModalEditar)}>
        <ModalHeader toggle={fecharModal(setModalEditar)}>Editar Cliente</ModalHeader>
        <ModalBody>
          <InputForm handleChange={handleChange} cliente={clienteSelecionado} />
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={putCliente}>Salvar</button>
          <button className="btn btn-secondary" onClick={fecharModal(setModalEditar)}>Cancelar</button>
        </ModalFooter>
      </Modal>

      {/* Modal Excluir */}
      <Modal isOpen={modalExcluir} toggle={fecharModal(setModalExcluir)}>
        <ModalHeader toggle={fecharModal(setModalExcluir)}>Excluir Cliente</ModalHeader>
        <ModalBody>
          Confirma a exclusão do cliente <strong>{clienteSelecionado.nome}</strong>?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={deleteCliente}>Sim</button>
          <button className="btn btn-secondary" onClick={fecharModal(setModalExcluir)}>Não</button>
        </ModalFooter>
      </Modal>

      {/* Modal Detalhes */}
      <Modal isOpen={modalDetalhes} toggle={fecharModal(setModalDetalhes)}>
        <ModalHeader toggle={fecharModal(setModalDetalhes)}>Detalhes do Cliente</ModalHeader>
        <ModalBody>
          <p><strong>Nome:</strong> {clienteSelecionado.nome}</p>
          <p><strong>Email:</strong> {clienteSelecionado.email}</p>
          <p><strong>Telefone:</strong> {clienteSelecionado.telefone}</p>
          <p><strong>CEP:</strong> {clienteSelecionado.cep}</p>
          <p><strong>Endereço:</strong> {clienteSelecionado.logradouro}, {clienteSelecionado.bairro}, {clienteSelecionado.localidade} - {clienteSelecionado.uf}</p>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" onClick={fecharModal(setModalDetalhes)}>Fechar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

function InputForm({ handleChange, cliente }) {
  return (
    <>
      <label>Nome:</label>
      <input type="text" className="form-control" name="nome" onChange={handleChange} value={cliente.nome} />

      <label>Email:</label>
      <input type="email" className="form-control" name="email" onChange={handleChange} value={cliente.email} />

      <label>Telefone:</label>
      <input type="text" className="form-control" name="telefone" onChange={handleChange} value={cliente.telefone} />

      <label>CEP:</label>
      <input type="text" className="form-control" name="cep" onChange={handleChange} value={cliente.cep} />

      <label>Logradouro:</label>
      <input type="text" className="form-control" name="logradouro" onChange={handleChange} value={cliente.logradouro} />

      <label>Bairro:</label>
      <input type="text" className="form-control" name="bairro" onChange={handleChange} value={cliente.bairro} />

      <label>Cidade:</label>
      <input type="text" className="form-control" name="localidade" onChange={handleChange} value={cliente.localidade} />

      <label>UF:</label>
      <input type="text" className="form-control" name="uf" onChange={handleChange} value={cliente.uf} />
    </>
  );
}

export default ClienteCrud;