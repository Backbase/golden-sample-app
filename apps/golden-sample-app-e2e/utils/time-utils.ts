export const timeID = () =>
  new Date().toISOString().split('.')[0].replace(/T/g, '-').replace(/:/g, '-');
