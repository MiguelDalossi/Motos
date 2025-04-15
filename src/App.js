import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const baseUrl = "http://localhost:5174/api/Motos";
  const [data, setData] = useState([]);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(false); // Novo modal para detalhes

  const [motoSelecionado, setMotoSelecionado] = useState({
    id: '',
    modelo: '',
    marca: '',
    cor: '',
    chassi: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setMotoSelecionado({
      ...motoSelecionado,
      [name]: value
    });
  };

  const abrirFecharModalIncluir = () => {
    setMotoSelecionado({ id: '', modelo: '', marca: '', cor: '', chassi: '' });
    setModalIncluir(!modalIncluir);
  };

  const abrirFecharModalEditar = () => setModalEditar(!modalEditar);
  const abrirFecharModalExcluir = () => setModalExcluir(!modalExcluir);
  const abrirFecharModalDetalhes = () => setModalDetalhes(!modalDetalhes); // Função para abrir/fechar modal de detalhes

  const selecionarMoto = (moto, opcao) => {
    setMotoSelecionado({ ...moto }); // força atualização correta
    if (opcao === "Editar") setTimeout(abrirFecharModalEditar, 0);
    else if (opcao === "Excluir") abrirFecharModalExcluir();
    else if (opcao === "Detalhes") abrirFecharModalDetalhes(); // Ao clicar em detalhes, abre o modal de detalhes
  };

  const motosGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      });
  };

  const pedidoPost = async () => {
    delete motoSelecionado.id;
    await axios.post(baseUrl, motoSelecionado)
      .then(response => {
        setData([...data, response.data]);
        abrirFecharModalIncluir();
      }).catch(error => {
        console.log(error);
      });
  };

  const pedidoPut = async () => {
    await axios.put(baseUrl + "/" + motoSelecionado.id, motoSelecionado)
      .then(response => {
        let resposta = response.data;
        let dadosAtualizados = data.map(moto =>
          moto.id === resposta.id ? resposta : moto
        );
        setData(dadosAtualizados);
        abrirFecharModalEditar();
      }).catch(error => {
        console.log(error);
      });
  };

  const pedidoDelete = async () => {
    await axios.delete(baseUrl + "/" + motoSelecionado.id)
      .then(() => {
        setData(data.filter(moto => moto.id !== motoSelecionado.id));
        abrirFecharModalExcluir();
      }).catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    motosGet();
  }, []);

  return (
    <div className="moto-container">
      <br />
      <h3>Cadastro de Motos</h3>

      <header>
        <button onClick={abrirFecharModalIncluir} className="btn btn-success">
          Incluir Nova Moto
        </button>
      </header>

      <table className="table table-bordered">
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
          {data.map(moto => (
            <tr key={moto.id}>
              <td>{moto.id}</td>
              <td>{moto.modelo}</td>
              <td>{moto.marca}</td>
              <td>{moto.cor}</td>
              <td>{moto.chassi}</td>
              <td>
                <button className="btn btn-primary" onClick={() => selecionarMoto(moto, "Editar")}>Editar</button>{" "}
                <button className="btn btn-danger" onClick={() => selecionarMoto(moto, "Excluir")}>Excluir</button>{" "}
                <button className="btn btn-info" onClick={() => selecionarMoto(moto, "Detalhes")}>Detalhes</button> {/* Novo botão de detalhes */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Moto</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Modelo:</label>
            <input type="text" className="form-control" name="modelo" onChange={handleChange} />
            <label>Marca:</label>
            <input type="text" className="form-control" name="marca" onChange={handleChange} />
            <label>Cor:</label>
            <input type="text" className="form-control" name="cor" onChange={handleChange} />
            <label>Chassi:</label>
            <input type="text" className="form-control" name="chassi" onChange={handleChange} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={pedidoPost}>Incluir</button>
          <button className="btn btn-danger" onClick={abrirFecharModalIncluir}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Moto</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Modelo:</label>
            <input type="text" className="form-control" name="modelo" onChange={handleChange} value={motoSelecionado.modelo} />
            <label>Marca:</label>
            <input type="text" className="form-control" name="marca" onChange={handleChange} value={motoSelecionado.marca} />
            <label>Cor:</label>
            <input type="text" className="form-control" name="cor" onChange={handleChange} value={motoSelecionado.cor} />
            <label>Chassi:</label>
            <input type="text" className="form-control" name="chassi" onChange={handleChange} value={motoSelecionado.chassi} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={pedidoPut}>Salvar</button>
          <button className="btn btn-danger" onClick={abrirFecharModalEditar}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalHeader>Excluir Moto</ModalHeader>
        <ModalBody>
          Confirma a exclusão da moto <strong>{motoSelecionado.modelo}</strong>?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={pedidoDelete}>Sim</button>
          <button className="btn btn-secondary" onClick={abrirFecharModalExcluir}>Não</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDetalhes}>
        <ModalHeader>Detalhes da Moto</ModalHeader>
        <ModalBody>
          <div>
            <p><strong>Modelo:</strong> {motoSelecionado.modelo}</p>
            <p><strong>Marca:</strong> {motoSelecionado.marca}</p>
            <p><strong>Cor:</strong> {motoSelecionado.cor}</p>
            <p><strong>Chassi:</strong> {motoSelecionado.chassi}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" onClick={abrirFecharModalDetalhes}>Fechar</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
