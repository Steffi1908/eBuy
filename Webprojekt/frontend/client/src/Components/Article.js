import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { useEffect, useState } from 'react';

function Article({article}) {
  
//Image vom Backend

//Versuch 1
/*
export async function get(url: string) {
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
} 
*/


//Versuch 2
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
  }, []);
  */


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


  return (

    <Card
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardMedia
        component="img"
        image={image}
        alt="random"
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {article.title}
        </Typography>
        <Typography>
          {article.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Bieten</Button>
      </CardActions>
    </Card>


  );
}
export default Article;

