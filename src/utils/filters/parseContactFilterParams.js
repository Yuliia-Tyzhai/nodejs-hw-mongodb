export const parseContactFilterParams = (query) => {
    const filter = {};

    if (query.userId) {
      filter.userId = query.userId;
    }
  
    return filter;
  };