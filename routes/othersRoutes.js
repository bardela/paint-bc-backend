module.exports = function(app) {
  app.use((request, response) => {
    response.status(404).send({message: 'Not Found'});
  });

  app.use((error, request, response) => {
    response.status(500).send({message: 'Internal Server Error'});
    console.error(error);
  });
}