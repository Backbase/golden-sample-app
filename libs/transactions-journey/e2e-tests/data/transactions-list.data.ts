export const TRANSACTIONS_LIST = {
  size: 10,
  searchedSize: 3,
  searchTerm: 'cafe',
  searchExpectations: [
    { term: 'KLM', count: 7 },
    { term: 'cafe', count: 3 },
  ],
};
