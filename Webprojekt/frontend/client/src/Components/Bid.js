import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import {useParams} from 'react-router-dom'

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}


function Bid() {
  const { articleID } = useParams()
  const [price, setPrice] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        articleID,
        price,
      };
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };

      const response = await fetch(`http://localhost:1337/article/bid`, config);
      console.log("BID", response)
    } catch (error) {
      console.log(error);
    }
  };

  return (

    // Header
    <React.Fragment>

      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />

      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `2px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <h2>E</h2><h4>bu</h4><h2>Y</h2>
          <Typography variant="h6" color="#468a84" noWrap sx={{ flexGrow: 1 }}>
          </Typography>
          <Button to={'/home'} component={Link}>
            <Box
              sx={{ '& > :not(style)': { m: 0 } }}>
              <HomeIcon fontSize="large" color="action" />
            </Box>
          </Button>
          <Button to={'/Login'} component={Link}>
            <Stack direction="row" spacing={2}>
              <Avatar src="/broken-image.jpg" />
            </Stack>
          </Button>

        </Toolbar>
      </AppBar>
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 10, pb: 6 }}>
        <Typography variant="h2" align="center" color="#76aeb2" component="p">
          Auf einen Artikel bieten
        </Typography>
      </Container>

      <form onSubmit={handleSubmit}>
        <div className='create-container'>
          <h2>Artikel:</h2>
          <h2>Beschreibung:</h2>
          <TextField onChange={e => setPrice(e.target.value)} id="outlined-multiline-static" label="Dein Gebot"
            variant="outlined" type="Number" />

          <p>BILD</p>
          <Button onClick={handleSubmit}>Gebot abgeben</Button>
        </div>
      </form>

    </React.Fragment>
  );
}
export default Bid;