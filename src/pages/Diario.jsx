import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserData } from '../context/UserDataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import StarRating from '../components/StarRating.jsx'

/**
 * Diário — req. 3.1.2 Sistema de Avaliação e Diário (Log).
 *
 * Lista todos os registros do usuário, ordenados por data de visualização.
 * Permite editar nota/resenha e excluir registro.
 */
export default function Diario() {
  const { usuarioAtual } = useAuth()
  const {
    diary,
    obraIndex,
    obterObraDoIndice,
    excluirLog,
    editarLog,
    contarLikesReview,
  } = useUserData()
  const [editandoId, setEditandoId] = useState(null)
  const [resenhaEdit, setResenhaEdit] = useState('')
  const [notaEdit, setNotaEdit] = useState(0)

  const ordenado = useMemo(
    () => [...diary].sort((a, b) => (b.dataVisualizacao || '').localeCompare(a.dataVisualizacao || '')),
    [diary],
  )

  function comecarEdicao(entry) {
    setEditandoId(entry.id)
    setResenhaEdit(entry.resenha)
    setNotaEdit(entry.nota)
  }

  function salvarEdicao() {
    editarLog(editandoId, { resenha: resenhaEdit, nota: notaEdit })
    setEditandoId(null)
  }

  return (
    <div>
      <h1 className="page-title">Diário</h1>
      <p className="muted">
        Registros de @{usuarioAtual?.username}. Ordenados por data de visualização.
      </p>
      {ordenado.length === 0 ? (
        <div className="empty-state">
          Você ainda não tem registros. Encontre uma obra e clique em
          “Registrar no diário”.
        </div>
      ) : (
        <div className="diario-lista">
          {ordenado.map((entry) => {
            const obra = obterObraDoIndice(entry.obraIdUnique)
            const editando = editandoId === entry.id
            const totalLikes = usuarioAtual ? contarLikesReview(usuarioAtual.id, entry.id) : 0
            return (
              <article key={entry.id} className="diario-item">
                <div className="diario-cabecalho">
                  <strong>
                    {obra ? (
                      <Link to={obra.getRota()}>
                        {obra.getIconeSelo()} {obra.titulo}
                      </Link>
                    ) : (
                      'Obra removida'
                    )}
                  </strong>
                  <span className="muted">
                    {entry.dataVisualizacao}
                    {obra && ` · ${obra.getTipo()}`}
                    {entry.curtido && ' · ❤'}
                  </span>
                </div>

                {editando ? (
                  <>
                    <StarRating value={notaEdit} onChange={setNotaEdit} size="large" />
                    <textarea
                      value={resenhaEdit}
                      onChange={(e) => setResenhaEdit(e.target.value)}
                      placeholder="Resenha..."
                    />
                    <div className="actions-row">
                      <button className="btn primary" onClick={salvarEdicao}>Salvar</button>
                      <button className="btn" onClick={() => setEditandoId(null)}>Cancelar</button>
                    </div>
                  </>
                ) : (
                  <>
                    {entry.nota > 0 && <StarRating value={entry.nota} />}
                    {entry.resenha && (
                      <p className="review-display">{entry.resenha}</p>
                    )}
                    <div className="actions-row">
                      <span className="muted">❤ {totalLikes} curtida{totalLikes === 1 ? '' : 's'}</span>
                      <button className="btn" onClick={() => comecarEdicao(entry)}>Editar</button>
                      <button
                        className="btn"
                        onClick={() => {
                          if (confirm('Excluir este registro?')) excluirLog(entry.id)
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
