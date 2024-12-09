export const transactionListMockData = {
  size: 10,
  searchExpectations: [
    { term: 'KLM', count: 7 },
    { term: 'cafe', count: 3 },
  ],
};

export const transactionListSandboxData = {
  size: 10,
  searchExpectations: [{ term: 'pocket', count: 5 }],
};
