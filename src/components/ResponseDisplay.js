import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'

const ResponseDisplay = ({ response }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {response ? (
          <Typography variant='body1'>{response}</Typography>
        ) : (
          <Typography variant='body2' color='text.secondary'>
            Waiting for response...
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default ResponseDisplay
