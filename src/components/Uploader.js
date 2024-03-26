import React, { useState } from 'react'
import { Card, CardContent, Button, Typography } from '@mui/material'

const Uploader = ({ onUpload }) => {
  const [previewImage, setPreviewImage] = useState(null)

  const handleUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        onUpload(file)
      }
      reader.readAsDataURL(file)
    } else {
      // Handle case when no file is selected
      console.error('No file selected.')
    }
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant='body2'>
          Upload Image of Homework Problem:
        </Typography>
        <Button variant='contained' component='label' sx={{ mt: 1 }}>
          Choose File
          <input type='file' hidden accept='image/*' onChange={handleUpload} />
        </Button>
        {previewImage && (
          <div>
            <Typography variant='body2' sx={{ mt: 1 }}>
              Preview:
            </Typography>
            <img
              src={previewImage}
              alt='Preview'
              style={{ maxWidth: '100%', marginTop: '8px' }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Uploader
