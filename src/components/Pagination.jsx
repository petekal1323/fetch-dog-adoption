// src/components/Pagination.jsx

import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';

function Pagination({ currentPage, totalPages, onFirst, onPrevious, onNext, onLast }) {
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages - 1;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={2}>
      <Button variant="outlined" disabled={isFirstPage} onClick={onFirst}>
        First
      </Button>
      <Button variant="outlined" disabled={isFirstPage} onClick={onPrevious}>
        Previous
      </Button>
      <Typography variant="body1">
        Page {currentPage + 1} of {totalPages}
      </Typography>
      <Button variant="outlined" disabled={isLastPage} onClick={onNext}>
        Next
      </Button>
      <Button variant="outlined" disabled={isLastPage} onClick={onLast}>
        Last
      </Button>
    </Box>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onFirst: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onLast: PropTypes.func.isRequired,
};

export default Pagination;
