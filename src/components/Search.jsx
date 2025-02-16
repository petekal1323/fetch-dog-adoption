// src/components/Search.jsx
import { useState, useEffect } from 'react';
import DogCard from './DogCard';
import { Container, Typography, Box, Grid2, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import Pagination from './Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import { searchDogs, fetchDogsDetails, fetchLocations, generateDogMatch } from '../api.js';


function Search() {
  const [dogs, setDogs] = useState([]);
  const [breedInput, setBreedInput] = useState('');
  const [breedFilter, setBreedFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [match, setMatch] = useState(null);
  const [locations, setLocations] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const pageSize = 24;



  useEffect(() => {
    console.log(breedFilter, sortOrder, page);
    const fetchDogsData = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        // Search for dogs
        const searchData = await searchDogs({
          breeds: breedFilter ? [breedFilter] : undefined,
          sort: `breed:${sortOrder}`,
          size: pageSize,
          from: page * pageSize,
        });
        const { resultIds, total } = searchData;
        setTotal(total);

        if (resultIds && resultIds.length > 0) {
          const fetchedDogs = await fetchDogsDetails(resultIds);

          // If the fetched dogs array is empty and we're not on the first page,
          // move back one page so the user sees content.
          if (fetchedDogs.length === 0 && page > 0) {
            setPage(page - 1);
            return; // Exit early so we don't proceed with an empty result
          }

          setDogs(fetchedDogs);

          // get unique ZIP codes from the fetched dogs
          const zipCodes = Array.from(new Set(fetchedDogs.map(dog => dog.zip_code)));

          // get location details for these zip codes
          const fetchedLocations = await fetchLocations(zipCodes);
          const locationMap = {};
          if (Array.isArray(fetchedLocations)) {
            fetchedLocations.forEach(loc => {
              if (loc && loc.zip_code) {
                locationMap[loc.zip_code] = loc;
              }
            });
          }
          setLocations(locationMap);
      } else {
        setDogs([]);
        setLocations({});
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to fetch dogs: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchDogsData();
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
    const matchData = await generateDogMatch(favorites);
    const matchedDogId = matchData.match;
    const dogData = await fetchDogsDetails([matchedDogId]);
    setMatch(dogData[0]);
  } catch (error) {
    console.error('Error generating match:', error);
  }
};


const totalPages = Math.max(Math.ceil(total / pageSize) - 1, 0);

return (
  <Box className="searchContainer" display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
    <Container maxWidth="lg" className="searchWrapper">


      {/* Pagination Controls */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onFirst={() => setPage(0)}
        onPrevious={() => setPage(page - 1)}
        onNext={() => setPage(page + 1)}
        onLast={() => setPage(totalPages - 1)}
      />

      <Typography paddingBlock="1rem" variant="h4" component="h1" gutterBottom align="center" >
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
        <Button className='generate_match_btn' variant="contained" color="secondary" onClick={handleGenerateMatch}>
          Generate Match
        </Button>
        {match && (
          <Box mt={2} textAlign="center">
            <Typography variant="p">Based on your Likes!</Typography>
            <Typography variant="h6">Your Match:</Typography>
            <DogCard
              dog={match}
              city={locations[match.zip_code] ? locations[match.zip_code].city : 'Unknown'}
              isFavorite={true}
              onFavoriteToggle={() => { }}
            />
          </Box>
        )}
      </Box>

      {/* Loading and Error Messages */}
      {isLoading && (
        <CircularProgress />
      )}
      {errorMessage && (
        <Typography variant="h6" align="center" color="error">
          {errorMessage}
        </Typography>
      )}

      {/* Dog Cards Grid */}
      {!isLoading && !errorMessage && (

        <Grid2
          id="grid_container"
          className="grid_container"
          container
          spacing={2}
          justifyContent="center"
        >
          {dogs.map((dog) => (
            <Grid2 xs={12} sm={8} md={4} key={dog.id} sx={{ display: 'flex', justifyContent: 'center' }}>
              <DogCard
                dog={dog}
                city={locations[dog.zip_code] ? locations[dog.zip_code].city : 'Unknown'}
                isFavorite={favorites.includes(dog.id)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </Grid2>
          ))}
        </Grid2>
      )}

      {/* Pagination Controls (Bottom) */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onFirst={() => setPage(0)}
        onPrevious={() => setPage(page - 1)}
        onNext={() => setPage(page + 1)}
        onLast={() => setPage(totalPages - 1)}
      />
    </Container>
  </Box>
);
}

export default Search;
