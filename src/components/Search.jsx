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
          // Fetch dog details
          const fetchedDogs = await fetchDogsDetails(resultIds);
          setDogs(fetchedDogs);
  
          
          const zipCodes = Array.from(new Set(fetchedDogs.map(dog => dog.zip_code)));
          // Fetch locations for these zip codes
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

  const totalPages = Math.ceil(total / pageSize);

  return (
    <Box className="searchContainer" display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
      <Container maxWidth="lg" className="searchWrapper">


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
          <Button className='generate_match_btn' variant="contained" color="secondary" onClick={handleGenerateMatch}>
            Generate Match
          </Button>
          {match && (
            <Box mt={2} textAlign="center">
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
            alignItems="center"
            justifyContent="center"
            container
            spacing={2}
          >
            {dogs.length > 0 ? (
              dogs.map((dog) => (
                <Grid2 xs={12} sm={6} md={4} key={dog.id}>
                  <DogCard
                    dog={dog}
                    city={locations[dog.zip_code] ? locations[dog.zip_code].city : 'Unknown'}
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
        )}

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
