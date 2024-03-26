import React from 'react'
import { TextField } from '@mui/material'

const PromptInput = ({ value, onChange }) => {
  return (
    <TextField
      label='Enter your question or prompt'
      multiline
      rows={4}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      fullWidth
      sx={{ mb: 2 }}
    />
  )
}

export default PromptInput
