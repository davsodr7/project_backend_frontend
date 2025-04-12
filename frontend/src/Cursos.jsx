import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = () => {
    axios.get('http://localhost:5000/api/cursos')
      .then((response) => {
        setCursos(response.data);
      })
      .catch((error) => {
        console.error('Erro ao carregar cursos:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios.put(`http://localhost:5000/api/cursos/${editId}`, { descricao, valor })
        .then(() => {
          fetchCursos();
          cancelEdit();
        })
        .catch((error) => {
          console.error('Erro ao atualizar curso:', error);
        });
    } else {
      axios.post('http://localhost:5000/api/cursos', { descricao, valor })
        .then(() => {
          fetchCursos();
          setDescricao('');
          setValor('');
        })
        .catch((error) => {
          console.error('Erro ao adicionar curso:', error);
        });
    }
  };

  const deleteCurso = (id) => {
    axios.delete(`http://localhost:5000/api/cursos/${id}`)
      .then(() => {
        fetchCursos();
      })
      .catch((error) => {
        console.error('Erro ao excluir curso:', error);
      });
  };

  const startEdit = (curso) => {
    setEditId(curso.id);
    setDescricao(curso.descricao);
    setValor(curso.valor);
  };

  const cancelEdit = () => {
    setEditId(null);
    setDescricao('');
    setValor('');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-4" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container-fluid" style={{ maxWidth: '1200px' }}>
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h2 className="text-center mb-0">Gerenciamento de Cursos</h2>
          </div>
          
          <div className="card-body p-4">
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="row g-3 align-items-end">
                <div className="col-md-5">
                  <label htmlFor="descricao" className="form-label fw-bold">Descrição</label>
                  <input
                    type="text"
                    className="form-control"
                    id="descricao"
                    placeholder="Descrição do curso"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="valor" className="form-label fw-bold">Valor (R$)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="valor"
                    placeholder="Valor do curso"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="col-md-4 d-flex">
                  {editId ? (
                    <>
                      <button type="submit" className="btn btn-warning me-2 flex-grow-1">Atualizar</button>
                      <button type="button" onClick={cancelEdit} className="btn btn-outline-secondary flex-grow-1">Cancelar</button>
                    </>
                  ) : (
                    <button type="submit" className="btn btn-success text-white flex-grow-1">Adicionar Curso</button>
                  )}
                </div>
              </div>
            </form>

            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th className="w-50">Descrição</th>
                    <th className="w-20">Valor (R$)</th>
                    <th className="w-30">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cursos.map((curso) => (
                    <tr key={curso.id}>
                      <td className="align-middle">{curso.descricao}</td>
                      <td className="align-middle">R$ {parseFloat(curso.valor).toFixed(2)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            onClick={() => startEdit(curso)} 
                            className="btn btn-sm btn-warning flex-grow-1"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => deleteCurso(curso.id)} 
                            className="btn btn-sm btn-danger flex-grow-1"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cursos;