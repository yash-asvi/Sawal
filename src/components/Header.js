import React from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'

const Header = () => {
  return (
    <AppBar position='static'>
      <Toolbar variant='dense'>
        <SchoolIcon sx={{ mr: 2 }} />
        <Typography variant='h6' color='inherit'>
          Sawal - Homework Helper
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Header
