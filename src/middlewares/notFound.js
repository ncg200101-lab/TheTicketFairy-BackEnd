const notFound = (req, res, _next) => {
  return res.error({
    status: 404,
    messageCode: 'system.not_found',
  });
};

export default notFound;
