const unknownEndpoint = (request, response) => {
  console.error(new Error(`Unknown endpoint: ${request.method} ${request.originalUrl}`));
  response.status(404).send({error: "unknown endpoint"});
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);


  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
};


module.exports = {
  unknownEndpoint,
  errorHandler
}