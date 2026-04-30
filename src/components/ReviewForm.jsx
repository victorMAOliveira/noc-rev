import { useEffect, useState } from 'react'

export default function ReviewForm({ value, onSave, placeholder }) {
  const [editing, setEditing] = useState(!value)
  const [draft, setDraft] = useState(value || '')

  useEffect(() => {
    setDraft(value || '')
    setEditing(!value)
  }, [value])

  if (!editing) {
    return (
      <div>
        <div className="review-display">{value}</div>
        <div className="actions-row">
          <button className="btn" onClick={() => setEditing(true)}>
            Edit review
          </button>
          <button
            className="btn"
            onClick={() => {
              onSave('')
              setDraft('')
              setEditing(true)
            }}
          >
            Delete review
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="review-form">
      <textarea
        placeholder={placeholder || 'Write your thoughts...'}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <div className="row">
        <span className="muted">{draft.length} chars</span>
        <div className="actions-row">
          {value && (
            <button
              className="btn"
              onClick={() => {
                setDraft(value)
                setEditing(false)
              }}
            >
              Cancel
            </button>
          )}
          <button
            className="btn primary"
            onClick={() => {
              onSave(draft.trim())
              if (draft.trim()) setEditing(false)
            }}
            disabled={draft.trim() === (value || '')}
          >
            Save review
          </button>
        </div>
      </div>
    </div>
  )
}
