// src/components/Search.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import DogCard from './DogCard';
import styles from './Search.module.css';
import {
  Container,
  Typography,
  Box,
  Grid2,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

function Search() {
  const [dogs, setDogs] = useState([]);
  const [breedFilter, setBreedFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState([0]);
  const [total, setTotal] = useState(0);
  const pageSize = 24; // number of results per page i chose 24 so it would look good with 4 across on each row

  useEffect(() => {
    async function fetchDogs() {
      try {
        // 1. Call the search endpoint to get the list of matching dog IDs
        const searchResponse = await axios.get(
          'https://frontend-take-home-service.fetch.com/dogs/search',
          {
            params: {
              // You may adjust the parameters based on your API spec
              breed: breedFilter, // if API expects an array, adjust accordingly
              sort: `breed:${sortOrder}`,
              size: pageSize,
              from: page * pageSize,
            },
            withCredentials: true,
          }
        );

        const { resultIds, total: totalResults } = searchResponse.data;
        setTotal(totalResults);

        // 2. If there are any results, fetch the full dog objects
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
        console.error('Error fetching dogs:', error);
      }
    }
    fetchDogs();
  }, [breedFilter, sortOrder, page]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Container maxWidth="lg" className={styles.searchWrapper}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          justifyContent="center"
        >
          Search for Your Perfect Dog
        </Typography>

        {/* Search Filters */}
        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          gap={2}
          mb={3}
        >
          <TextField
            label="Breed Filter"
            variant="outlined"
            value={breedFilter}
            onChange={(e) => setBreedFilter(e.target.value)}
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
            onClick={() => setPage(0)}
          >
            Apply
          </Button>
        </Box>

        {/* Dog Cards Grid */}
        <Grid2 id="grid_container" className="grid_container" container spacing={3}>
          {dogs.map((dog) => (
            <Grid2 xs={12} sm={6} md={4} key={dog.id}>
              <DogCard dog={dog} />
            </Grid2>
          ))}
        </Grid2>

        {/* Pagination Controls */}
        <Box display="flex" justifyContent="center" mt={3} gap={2}>
          <Button
            variant="outlined"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Typography variant="body1">
            Page {page + 1} of {Math.ceil(total / pageSize)}
          </Typography>
          <Button
            variant="outlined"
            disabled={dogs.length < pageSize}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Search;
