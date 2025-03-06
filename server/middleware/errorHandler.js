const unknownEndpoint = (request, response) => {
  console.error(new Error(`Unknown endpoint: ${request.method} ${request.originalUrl}`));
  response.status(404).send({error: "unknown endpoint"});
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  response.status(500);
  response.json({
    message: error.message,
  });
};

module.exports = {
  unknownEndpoint,
  errorHandler
}