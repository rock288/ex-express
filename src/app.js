const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const routes = require('./routes/v1');
const { jwtStrategy } = require('./config/passport');
const morgan = require('./config/morgan');
const config = require('./config/config');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const { errorConverter, errorHandler } = require('./middlewares/error');
const cors = require('cors');
const app = express();

// innit middleware
app.use(express.json());
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
app.use(helmet()); // hide data
app.use(compression()); // nen payload

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// init routes
app.use('/v1', routes);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
