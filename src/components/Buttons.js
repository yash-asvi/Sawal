import React from 'react'
import { Button, CircularProgress } from '@mui/material'

const Buttons = ({ onFindAnswer, onRegenerate, onClear, disabled }) => {
  return (
    <div>
      <Button
        variant='contained'
        disabled={disabled}
        onClick={onFindAnswer}
        startIcon={disabled ? <CircularProgress size='small' /> : null}
      >
        Find Answer
      </Button>
      <Button
        variant='outlined'
        disabled={disabled || !onRegenerate}
        onClick={onRegenerate}
      >
        Regenerate
      </Button>
      <Button variant='outlined' color='error' onClick={onClear}>
        Clear
      </Button>
    </div>
  )
}

export default Buttons
