import { useState } from 'react'
import { useUserData } from '../context/UserDataContext.jsx'

/**
 * AdicionarALista — popover para adicionar uma Obra (qualquer tipo) a uma
 * lista existente do usuário. Habilita as Listas Mistas (req. 3.2.4): aceita
 * Filme, Série, Minissérie, Documentário e Episódio na mesma lista.
 */
export default function AdicionarALista({ obra }) {
  const { lists, adicionarItemNaLista, criarLista } = useUserData()
  const [aberto, setAberto] = useState(false)
  const [novoNome, setNovoNome] = useState('')

  function adicionar(listId) {
    adicionarItemNaLista(listId, obra)
    setAberto(false)
  }

  function criarECardicionar() {
    if (!novoNome.trim()) return
    const lista = criarLista({ nome: novoNome.trim() })
    adicionarItemNaLista(lista.id, obra)
    setNovoNome('')
    setAberto(false)
  }

  return (
    <div className="lista-picker">
      <button className="btn" onClick={() => setAberto((v) => !v)}>
        + Adicionar a lista
      </button>
      {aberto && (
        <div className="popover">
          <strong>Suas listas</strong>
          {lists.length === 0 ? (
            <p className="muted">Nenhuma lista ainda.</p>
          ) : (
            <ul>
              {lists.map((l) => {
                const jaTem = l.itens.includes(obra.getIdentificadorUnico())
                return (
                  <li key={l.id}>
                    <button
                      className="btn-link"
                      disabled={jaTem}
                      onClick={() => adicionar(l.id)}
                    >
                      {jaTem ? '✓ ' : ''}
                      {l.nome}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          <hr />
          <div className="form-row">
            <input
              placeholder="Criar nova lista..."
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
            />
            <button className="btn primary" onClick={criarECardicionar}>
              Criar e adicionar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
