// src/components/Search.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import DogCard from './DogCard';
import styles from './../styles/Search.module.css';
import { Container, Typography, Box, Grid2, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import Pagination from './Pagination';

function Search() {
  const [dogs, setDogs] = useState([]);
  const [breedInput, setBreedInput] = useState('');
  const [breedFilter, setBreedFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [match, setMatch] = useState(null);
  const pageSize = 24;

  useEffect(() => {
    console.log("useEffect triggered: breedFilter =", breedFilter, ", sortOrder =", sortOrder, ", page =", page);
    const fetchDogs = async () => {
      try {
        const response = await axios.get('https://frontend-take-home-service.fetch.com/dogs/search', {
          params: {
            breeds: breedFilter ? [breedFilter] : undefined,
            sort: `breed:${sortOrder}`,
            size: pageSize,
            from: page * pageSize,
          },
          withCredentials: true,
        });

        const { resultIds, total } = response.data;
        setTotal(total);

        if (resultIds && resultIds.length > 0) {
          const dogsResponse = await axios.post(
            'https://frontend-take-home-service.fetch.com/dogs',
            resultIds,
            { withCredentials: true }
          );
          setDogs(dogsResponse.data);
        } else {
          setDogs([]);
        }
      } catch (error) {
        console.error('Oops! Something went wrong while fetching dogs:', error);
      }
    };

    fetchDogs();
  }, [breedFilter, sortOrder, page]);

  const handleFavoriteToggle = (dogId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(dogId)) {
        return prevFavorites.filter((id) => id !== dogId);
      } else {
        return [...prevFavorites, dogId];
      }
    });
  };

  const handleGenerateMatch = async () => {
    if (favorites.length === 0) {
      alert('Please select at least one favorite dog!');
      return;
    }
    try {
      const matchResponse = await axios.post(
        'https://frontend-take-home-service.fetch.com/dogs/match',
        favorites,
        { withCredentials: true }
      );
      const matchedDogId = matchResponse.data.match;
      const dogResponse = await axios.post(
        'https://frontend-take-home-service.fetch.com/dogs',
        [matchedDogId],
        { withCredentials: true }
      );
      setMatch(dogResponse.data[0]);
    } catch (error) {
      console.error('Error generating match:', error);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
      <Container maxWidth="lg" className={styles.searchWrapper}>


        {/* Pagination Controls */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrevious={() => setPage(page - 1)}
          onNext={() => setPage(page + 1)}
        />

        <Typography variant="h4" component="h1" gutterBottom align="center">
          Search for Your Perfect Dog
        </Typography>

        {/* Search Filters */}
        <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2} mb={3}>
          <TextField
            label="Breed Filter"
            variant="outlined"
            value={breedInput}
            onChange={(e) => setBreedInput(e.target.value)}
          />
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel>Sort Order</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              label="Sort Order"
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              console.log("Apply clicked! breedInput =", breedInput);
              setBreedFilter(breedInput);
              setPage(0);
            }}
          >
            Apply
          </Button>
        </Box>

        {/* Generate Match Section */}
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginBottom="10px" paddingBlock="20px" mt={4}>
          <Button variant="contained" color="secondary" onClick={handleGenerateMatch}>
            Generate Match
          </Button>
          {match && (
            <Box mt={2} textAlign="center">
              <Typography variant="h6">Your Match:</Typography>
              <DogCard dog={match} isFavorite={false} onFavoriteToggle={() => { }} />
            </Box>
          )}
        </Box>

        {/* Dog Cards Grid */}
        <Grid2 id="grid_container" className="grid_container" alignItems="center" justifyContent="center" container spacing="10px">
          {dogs.length > 0 ? (
            dogs.map((dog) => (
              <Grid2 xs={12} sm={6} md={4} key={dog.id}>
                <DogCard
                  dog={dog}
                  isFavorite={favorites.includes(dog.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </Grid2>
            ))
          ) : (
            <Typography variant="h4" align="center">
              No dogs found.
            </Typography>
          )}
        </Grid2>

        {/* Pagination Controls (Bottom) */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrevious={() => setPage(page - 1)}
          onNext={() => setPage(page + 1)}
        />
      </Container>
    </Box>
  );
}

export default Search;
