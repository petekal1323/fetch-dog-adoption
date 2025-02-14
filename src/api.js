// src/api.js
import axios from 'axios';

const BASE_URL = 'https://frontend-take-home-service.fetch.com';

// Function to search for dogs
export const searchDogs = async (params) => {
  const response = await axios.get(`${BASE_URL}/dogs/search`, {
    params,
    withCredentials: true,
  });
  return response.data;
};

// Function to fetch full dog details by passing an array of IDs
export const fetchDogsDetails = async (ids) => {
  const response = await axios.post(`${BASE_URL}/dogs`, ids, {
    withCredentials: true,
  });
  return response.data;
};

// Function to fetch locations by providing an array of ZIP codes
export const fetchLocations = async (zipCodes) => {
  const response = await axios.post(`${BASE_URL}/locations`, zipCodes, {
    withCredentials: true,
  });
  return response.data;
};

// Function to generate a dog match from the favorites list
export const generateDogMatch = async (favorites) => {
  const response = await axios.post(`${BASE_URL}/dogs/match`, favorites, {
    withCredentials: true,
  });
  return response.data;
};
