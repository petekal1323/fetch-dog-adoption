// src/components/Pagination.jsx

import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';

function Pagination({ currentPage, totalPages, onPrevious, onNext }) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={2}>
      <Button variant="outlined" disabled={currentPage === 0} onClick={onPrevious}>
        Previous
      </Button>
      <Typography variant="body1">
        Page {currentPage + 1} of {totalPages}
      </Typography>
      <Button variant="outlined" disabled={currentPage >= totalPages - 1} onClick={onNext}>
        Next
      </Button>
    </Box>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default Pagination;