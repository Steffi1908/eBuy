import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Article({article}) {
  
//Image vom Backend

//V1
/*export async function get(url: string) {
  try {
      const response = await fetch(http://localhost:1337/article/images/${imagePath}, {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          headers: {
              'Content-Type': 'image/jpeg'
          }
      })
      const blob = await response.blob()
      return [URL.createObjectURL(blob), null];
  }
  catch (error) {
      console.error(`get: error occurred ${error}`);
      return [null, error]
  }
}   

function foo(props: any) {
const [screenShot, setScreenshot] = useState(undefined)
const url = props.url
useEffect(() => {
  async function fetchData() {
      // You can await here
      const [response, error] = await get(url)
      if (error)
          log(error)
      else {
          log(`got response ${response}`)
      setScreenshot(response)
      }
  }
  fetchData();
}, [url])

return <div>
  <img src={screenShot} className="Screenshot" alt="showing screen capture" />
</div>
} */


//V2
/*
  const [image, setImage] = useState("");

  useEffect(() => {
    const getImage = async () => {
      const config = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      try {

        const imagePath = article.productImage.replace("uploads/", "")
        fetch(`http://localhost:1337/article/images/${imagePath}`, config)
          .then(response => response.blob())
          .then(imageBlob => {
            // Then create a local URL for that image and print it
            setImage(URL.createObjectURL(imageBlob)); 

          });


      } catch (error) {
        console.log(error);
      }
    };
    getImage();
  }, []);*/


//Echtzeit aktualisierung
useEffect(() => {
  const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
    setState(state => ({ data: state.data, error: false, loading: true }))
    fetch('http://localhost:1337/article')
      .then(data => data.json())
      .then(obj =>
        Object.keys(obj).map(key => {
          let newData = obj[key]
          newData.key = key
          return newData
        })
     )
     .then(newData => setState({ data: newData, error: false, loading: false }))
     .catch(function(error) {
        console.log(error)
        setState({ data: null, error: true, loading: false })
     })
  }, 5000)

  return () => clearInterval(intervalId); //This is important
 
}, ['http://localhost:1337/article', useState])


  const [title, deleteTitle] = useState('');
  const [description, deleteDescription] = useState('');
  const [price, deletePrice] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        title: title,
        description: description,
        price: price,
        image: image
      };
      const config = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };

      const response = await fetch(`http://localhost:1337/articles`, config);

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <Card
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardMedia
        component="img"
        image={image}
        alt="random"
      />
      <form onSubmit={handleSubmit}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {article.title}
        </Typography>
        <Typography>
          {article.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={'/Bid/' + article._id }><Button Primary size="small">Bieten</Button></Link>
        <Button onChange={e => deleteTitle(e.target.value)}>Löschen</Button>
        <Button Primary to={'/NewArtikel'} component={Link}>Bearbeiten</Button>
      </CardActions>
      </form>
    </Card>
    


  );
}
export default Article;

