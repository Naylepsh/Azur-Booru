exports.paginationInfo = function (numberOfRecords, page, recordsPerPage) {
  return {
    currentPage: page ? parseInt(page) : 1,
    lastPage: Math.ceil(numberOfRecords / recordsPerPage),
  };
};
