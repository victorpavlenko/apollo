import React from 'react';

import { IconButton } from '@material-ui/core';
import { LastPage, FirstPage, KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';

function TablePaginationActions(props) {

  const { count, page, limit, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / limit) - 1));
  };

  return (
    <div style={{ display: "flex"}}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPage />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / limit) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / limit) - 1}
        aria-label="last page"
      >
        <LastPage />
      </IconButton>
    </div>
  );
}

export default TablePaginationActions