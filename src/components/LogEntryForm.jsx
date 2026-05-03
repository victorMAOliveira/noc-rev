import { useState } from 'react'
import StarRating from './StarRating.jsx'

/**
 * LogEntryForm — formulário do Sistema de Avaliação e Diário (req. 3.1.2).
 * Captura: data de visualização, nota (0.5–5), curtir, resenha textual.
 */
export default function LogEntryForm({ obra, onSubmit, onCancel }) {
  const hoje = new Date().toISOString().slice(0, 10)
  const [data, setData] = useState(hoje)
  const [nota, setNota] = useState(0)
  const [resenha, setResenha] = useState('')
  const [curtido, setCurtido] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      dataVisualizacao: data,
      nota,
      resenha: resenha.trim(),
      curtido,
    })
  }

  return (
    <form className="log-form" onSubmit={handleSubmit}>
      <div className="log-form-header">
        <strong>Registrar no diário</strong>
        {obra && <span className="muted"> — {obra.titulo}</span>}
      </div>
      <div className="form-row">
        <label>
          Data de visualização
          <input
            type="date"
            value={data}
            max={hoje}
            onChange={(e) => setData(e.target.value)}
          />
        </label>
        <label>
          Nota
          <StarRating value={nota} onChange={setNota} size="large" />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={curtido}
            onChange={(e) => setCurtido(e.target.checked)}
          />
          ❤ Curtir
        </label>
      </div>
      <textarea
        placeholder="Escreva sua resenha (opcional)..."
        value={resenha}
        onChange={(e) => setResenha(e.target.value)}
      />
      <div className="actions-row">
        <button type="submit" className="btn primary">Salvar registro</button>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
