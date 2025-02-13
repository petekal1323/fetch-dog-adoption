// src/components/DogCard.jsx
import PropTypes from 'prop-types';
import { Card, CardMedia, CardContent, Typography, IconButton } from '@mui/material';
import { FavoriteIcon } from '@mui/icons-material/Favorite';
import { FavoriteBorderIcon } from '@mui/icons-material/FavoriteBorder';


function DogCard({ dog, isFavorite, onFavoriteToggle }) {
  return (
    <Card className='dog-card-container'>
      <CardMedia className='dog-card-media' component='img' height='200' image={dog.img} alt={dog.name} />
      <CardContent className='dog-card-content'>
        <Typography className='typography' variant="h4">{dog.name}</Typography>
        <Typography className='dog-card-items' variant="body2" color="text.secondary">
          Breed: {dog.breed} <br />
          Age: {dog.age} <br />
          ZIP: {dog.zip_code}
        </Typography>
        <IconButton
          onClick={() => {
            onFavoriteToggle(dog.id)
          }}
          aria-label="toggle favorite">{isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon/>}
        </IconButton>
      </CardContent>
    </Card>
  );
}

DogCard.propTypes = {
  dog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    zip_code: PropTypes.string.isRequired,
    breed: PropTypes.string.isRequired,
  }).isRequired,
  isFavorite: PropTypes.bool,
  onFavoriteToggle: PropTypes.func.isRequired,
};

DogCard.defaultProps = {
  isFavorite: false,
};

export default DogCard;
