import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import defaultProductImage from '../images/product-default-image.jpeg';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FileBase64 from 'react-filebase64';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


function Article({ article, setArticles }) {

  const [editOpen, setEditOpen] = useState(false);
  const [bidOpen, setBidOpen] = useState(false);

//Echtzeit aktualisierun
// useEffect(() => {
//   const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
//     setState(state => ({ data: state.data, error: false, loading: true }))
//     fetch('http://localhost:1337/article')
//       .then(data => data.json())
//       .then(obj =>
//         Object.keys(obj).map(key => {
//           let newData = obj[key]
//           newData.key = key
//           return newData
//         })
//      )
//      .then(newData => setState({ data: newData, error: false, loading: false }))
//      .catch(function(error) {
//         console.log(error)
//         setState({ data: null, error: true, loading: false })
//      })
//   }, 5000)
//
//   return () => clearInterval(intervalId); //This is important
//
//  //Image vom Backend
//
// //Versuch 1
// /*
// export async function get(url: string) {
//   try {
//       const response = await fetch(http://localhost:1337/article/images/${imagePath}, {
//           method: 'GET', // *GET, POST, PUT, DELETE, etc.
//           mode: 'cors', // no-cors, *cors, same-origin
//           cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//           headers: {
//               'Content-Type': 'image/jpeg'
//           }
//       })
//       const blob = await response.blob()
//       return [URL.createObjectURL(blob), null];
//   }
//   catch (error) {
//       console.error(`get: error occurred ${error}`);
//       return [null, error]
//   }
// }
// function foo(props: any) {
// const [screenShot, setScreenshot] = useState(undefined)
// const url = props.url
// useEffect(() => {
//   async function fetchData() {
//       // You can await here
//       const [response, error] = await get(url)
//       if (error)
//           log(error)
//       else {
//           log(`got response ${response}`)
//       setScreenshot(response)
//       }
//   }
//   fetchData();
// }, [url])
// return <div>
//   <img src={screenShot} className="Screenshot" alt="showing screen capture" />
// </div>
// }
// */
//
//
// //Versuch 2
// /*
//   const [image, setImage] = useState("");
//   useEffect(() => {
//     const getImage = async () => {
//       const config = {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       };
//       try {
//         const imagePath = article.productImage.replace("uploads/", "")
//         fetch(`http://localhost:1337/article/images/${imagePath}`, config)
//           .then(response => response.blob())
//           .then(imageBlob => {
//             // Then create a local URL for that image and print it
//             setImage(URL.createObjectURL(imageBlob));
//           });
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     getImage();
//   }, []);
//   */
//
//  //Versuch 3
//
// }, ['http://localhost:1337/article', useState])
  const [image, setImage] = useState('');
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const getBids = async () => {
      const config = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      try {
        const response = await fetch(`http://localhost:1337/article/bid/${article._id}`, config);
        setBids(await response.json());
        handleBidClose();
      } catch (error) {
        console.log(error);
      }
    };
    getBids();
  }, []);

  const [title, setTitle] = useState(article.title);
  const [description, setDescription] = useState(article.description);
  const [price, setPrice] = useState(article.price);
  const [bid, setBid] = useState(0);

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleBidClose = () => {
    setBidOpen(false);
  };

  const handleBidOpen = () => {
    setBidOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        title: title,
        price: price,
        description: description
      };
      const configPatch = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };
      const configGet = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      await fetch(`http://localhost:1337/article/${article._id}`, configPatch);
      const newArticles = await fetch('http://localhost:1337/article', configGet);
      setArticles(await newArticles.json());
      handleEditClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        articleID: article._id,
        price: bid
      };
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };
      const configGet = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch(`http://localhost:1337/article/bid`, config);
      const newArticles = await fetch('http://localhost:1337/article', configGet);
      setArticles(await newArticles.json());
      const response2 = await fetch(`http://localhost:1337/article/bid/${article._id}`, config);
      setBids(await response2.json());
      handleBidClose();
      console.log('BID', response);
    } catch (error) {
      console.log(error);
    }
  }

    const deleteArticle = async () => {
      try {
        const configDelete = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        const configGet = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        await fetch(`http://localhost:1337/article/${article._id}`, configDelete);
        const newArticles = await fetch('http://localhost:1337/article', configGet);
        setArticles(await newArticles.json());
      } catch (error) {
        console.log(error);
      }
    };

    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => {
      setIsOpen(true);
    }
  
    const closeModal = () => {
      setIsOpen(false);
    }

    return (

      <>
        <Card
          sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <CardMedia
            component="img"
            image={article.productImage ? article.productImage : defaultProductImage}
            alt="Produktbild"
          />
          <form>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {article.title}
              </Typography>
              <Typography>
                {article.description}
              </Typography>
              <Typography><h3>
                {article.price} €</h3>
              </Typography>
            </CardContent>
            <CardActions>
              <Button Primary size="small" onClick={handleBidOpen}>Bieten</Button>
              <Button onClick={deleteArticle}>Löschen</Button>
              <Button Primary onClick={handleEditOpen}>Bearbeiten</Button>
            </CardActions>
          </form>
        </Card>
        <div className="App">
          {editOpen && (
            <>
              <div className="overlay"></div>
              <div className="modal">
                <header className="modal__header">
                  <h3>Artikel "{article.title}" bearbeiten</h3>
                  <button onClick={handleEditClose} className="close-button">&times;</button>
                </header>
                <main className="modal__main">
                  <form onSubmit={handleSubmit}>
                    <div className='create-container2'>
                      <h1>Einen neuen Artikel hochladen:</h1>
                      <Box className='Upload'
                           component="form"
                           sx={{
                             '& > :not(style)': { m: 1, width: '29ch' }
                           }}
                           noValidate
                           autoComplete="off"
                      >
                        <TextField onChange={e => setTitle(e.target.value)} id="outlined-multiline-static"
                                   variant="outlined" placeholder={title} />
                        <TextField onChange={e => setPrice(e.target.value)} id="outlined-multiline-static"
                                   variant="outlined" type="Number" placeholder={price} />
                        <TextField
                          onChange={e => setDescription(e.target.value)}
                          sx={{
                            '& > :not(style)': { m: 0, width: '100%' }
                          }}
                          id="outlined-multiline-static"
                          multiline
                          rows={4}
                          placeholder={description}
                        />
                      </Box>
                      <Stack spacing={2} direction="row">
                        <Button type="submit">speichern</Button>
                      </Stack>
                    </div>
                  </form>
                </main>
              </div>
            </>
          )}
        </div>
        <div className="App">
          {bidOpen && (
            <>
              <div className="overlay"></div>
              <div className="modal">
                <header className="modal__header">
                  <h3>Auf Artikel "{article.title}" bieten</h3>
                  <button onClick={handleBidClose} className="close-button">&times;</button>
                </header>
                <main className="modal__main">
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 5 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>User ID</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bids.map((bid) => (
                          <TableRow
                            key={bid.userID}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {bid.userID}
                            </TableCell>
                            <TableCell align="right">{bid.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <form onSubmit={handleBidSubmit}>
                    <div className='create-container'>
                      <h2>Jetzt bieten:</h2>
                      <TextField onChange={e => setBid(e.target.value)} id="outlined-multiline-static"
                                 label="Dein Gebot"
                                 variant="outlined" type="Number" /><p></p>

                      <Button className="button" onClick={openModal} variant="outlined" color="success" type="submit">Gebot abgeben</Button>
                      <div> 
      {isOpen && (
        <>
          <div className="overlay"></div>
          <div className="modal">
            <header className="modal__header">
              <h3>EbuY - Dein Gebot wurde abgeschickt</h3>
              <button onClick={closeModal} className="close-button">&times;</button>
            </header>
            <main className="modal__main">
              <p>Drücke erneut auf "Bieten" um alle Gebote zu diesem Artikel zu sehen!</p>
            </main>
          </div>
        </>
      )}
    </div>
                    </div>
                  </form>
                </main>
              </div>
            </>
          )}
        </div>
      </>

    );
  };

  export default Article;

