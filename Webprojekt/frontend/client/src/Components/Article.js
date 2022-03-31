import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Article({article}) {

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
        alt="Produktbild"
      />
      <form onSubmit={handleSubmit}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {article.title}
        </Typography>
        <Typography>
          {article.description}
        </Typography>
        <Typography> <h3> 
          {article.price} €</h3>
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

