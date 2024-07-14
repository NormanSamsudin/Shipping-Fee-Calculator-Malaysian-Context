const express = require('express');
const ngrok = require('@ngrok/ngrok');
const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
//const hpp = require('hpp');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const logisticRoutes = require('./routes/logisticRoutes');

// 1) GLOBAL MIDDLEWARE
const app = express();

// securityhttp headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        'code.jquery.com',
        '127.0.0.1'
      ]
    }
  })
);

console.log('Environment: ', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'testing') {
  app.use(
    morgan('common', {
      stream: fs.createWriteStream('./access.log', { flags: 'a' })
    })
  );
  app.use(morgan('dev'));
} else {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'testing') {
  //Port Forward
  ngrok
    .connect({ addr: process.env.PORT, authtoken_from_env: true })
    .then(listener => console.log(`Ngrok established at: ${listener.url()}`))
    .catch(error => console.log('Error connecting ngrok:', error));
}

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 5 login attempts per windowMs
  message:
    'Too many login attempts from this IP, please try again after 15 minutes',
  handler: (req, res, next, options) => {
    // Log the IP address
    console.log(`Too many login attempts from IP: ${req.ip}`);

    // Respond with the message
    res.status(options.statusCode).send(options.message);
  }
});

// apply limiter to all endpoint start with /api
app.use('/api', limiter);

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// body parser untuk format json
// only limited to body with 10kb to prevent code injection
app.use(express.json({ limit: '10kb' }));

// untuk nak serve frontend kita
app.use(express.static('public'));

//swagger
const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Shipping Rate API Calculator (JNT, City-Link)',
      version: '0.1.0',
      description:
        'This is a simple API can be used to calculate shipping rate for your parcel. This API will give you a solution of the cheapest shipping rate among these courier (Jnt, City-Link).'
    },
    servers: [
      {
        url: 'http://127.0.0.1:8000/api/v1/logistic'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {}));

app.use('/api/v1/logistic', logisticRoutes);

//untuk route yang tak wujud
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
