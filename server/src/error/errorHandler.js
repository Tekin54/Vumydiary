import chalk from 'chalk';

// eslint-disable-next-line
const errorHandler = (err, req, res, next) => {
  console.log('Error ===> ', chalk.red(err.message));
  console.log('Line  ===>: ', chalk.blue(err.stack));
  res.status(500).send('An error occurred on the server');
};

const notFoundHandler = (req, res) => {
  console.log('Not Found ===> ', chalk.blue(req.originalUrl));
  res.status(404).send('The resource was not found on this server');
};

export { errorHandler, notFoundHandler };
