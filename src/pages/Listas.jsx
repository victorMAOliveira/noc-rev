import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useUserData } from '../context/UserDataContext.jsx'

/**
 * Listas — req. 3.1.3 Criação de Listas.
 * Lista as listas do usuário, permite criar nova, editar nome/descrição
 * e alternar visibilidade.
 */
export default function Listas() {
  const { usuarioAtual } = useAuth()
  const { lists, criarLista, atualizarLista, excluirLista } = useUserData()
  const [criando, setCriando] = useState(false)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [visibilidade, setVisibilidade] = useState('publica')

  function criar() {
    if (!nome.trim()) return
    criarLista({ nome: nome.trim(), descricao: descricao.trim(), visibilidade })
    setNome('')
    setDescricao('')
    setCriando(false)
  }

  return (
    <div>
      <h1 className="page-title">Minhas listas</h1>
      <button className="btn primary" onClick={() => setCriando((v) => !v)}>
        {criando ? 'Cancelar' : '+ Nova lista'}
      </button>

      {criando && (
        <div className="review-form">
          <label>
            Nome
            <input value={nome} onChange={(e) => setNome(e.target.value)} autoFocus />
          </label>
          <label>
            Descrição
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </label>
          <label>
            Visibilidade
            <select value={visibilidade} onChange={(e) => setVisibilidade(e.target.value)}>
              <option value="publica">Pública</option>
              <option value="privada">Privada</option>
              <option value="naoListada">Não listada (apenas por link)</option>
            </select>
          </label>
          <button className="btn primary" onClick={criar}>Criar</button>
        </div>
      )}

      {lists.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 16 }}>
          Você ainda não tem listas.
        </div>
      ) : (
        <div className="listas-grid" style={{ marginTop: 16 }}>
          {lists.map((l) => (
            <div key={l.id} className="lista-card">
              <Link to={`/listas/${usuarioAtual.id}/${l.id}`}>
                <h3>{l.nome}</h3>
              </Link>
              <div className="muted">
                {l.itens.length} item{l.itens.length === 1 ? '' : 's'} · {l.visibilidade}
              </div>
              <p>{l.descricao}</p>
              <div className="actions-row">
                <button
                  className="btn"
                  onClick={() => {
                    const novaVis =
                      l.visibilidade === 'publica' ? 'privada' :
                      l.visibilidade === 'privada' ? 'naoListada' : 'publica'
                    atualizarLista(l.id, { visibilidade: novaVis })
                  }}
                >
                  Alternar visibilidade
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    if (confirm(`Excluir "${l.nome}"?`)) excluirLista(l.id)
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
