// src/components/DogCard.jsx
import PropTypes from 'prop-types';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

function DogCard({ dog }) {
  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={dog.img}
        alt={dog.name}
      />
      <CardContent>
        <Typography variant="h5">{dog.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          Breed: {dog.breed} <br />
          Age: {dog.age} <br />
          ZIP: {dog.zip_code}
        </Typography>
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
};

export default DogCard;
