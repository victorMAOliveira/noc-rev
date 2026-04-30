import { useState } from 'react'

/**
 * 1-5 star rating with half-star support.
 * Click left half of a star -> .5, right half -> full
 *
 * Props:
 *  value: number (0..5, in 0.5 increments)
 *  onChange?: (value: number) => void   omit for read-only
 *  size?: 'normal' | 'large'
 *  allowClear?: boolean    show "clear" button when value > 0 and onChange present
 */
export default function StarRating({
  value = 0,
  onChange,
  size = 'normal',
  allowClear = true,
}) {
  const [hover, setHover] = useState(0)
  const interactive = typeof onChange === 'function'
  const display = hover || value

  function classFor(i) {
    // i is 1..5
    if (display >= i) return 'star filled'
    if (display >= i - 0.5) return 'star half'
    return 'star'
  }

  function handleClick(i, isLeftHalf) {
    if (!interactive) return
    const newVal = isLeftHalf ? i - 0.5 : i
    onChange(newVal === value ? 0 : newVal)
  }

  function handleMove(i, isLeftHalf) {
    if (!interactive) return
    setHover(isLeftHalf ? i - 0.5 : i)
  }

  return (
    <span
      className={
        'stars ' +
        (size === 'large' ? 'stars-large ' : '') +
        (interactive ? 'interactive' : '')
      }
      onMouseLeave={() => setHover(0)}
      role={interactive ? 'slider' : 'img'}
      aria-label={`Rating ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={classFor(i)}>
          {interactive && (
            <>
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '50%',
                  cursor: 'pointer',
                }}
                onMouseMove={() => handleMove(i, true)}
                onClick={() => handleClick(i, true)}
              />
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  left: '50%',
                  cursor: 'pointer',
                }}
                onMouseMove={() => handleMove(i, false)}
                onClick={() => handleClick(i, false)}
              />
            </>
          )}
        </span>
      ))}
      {interactive && allowClear && value > 0 && (
        <button
          type="button"
          className="rating-clear"
          onClick={() => onChange(0)}
          title="Clear rating"
        >
          ✕
        </button>
      )}
    </span>
  )
}
