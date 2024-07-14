//server file where everything is started
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // pakai package env utk mudah access environmanet variables
//const http = require('http');

// kalau ada exception yang uncaught
// process.on('uncaughtException', err => {
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });

//walaupon die exit tapi jangan risau sebb nnti hosting server tu akan restart balik automatically
//tapi depend dekat jenis hosting server yang ada

// nak access file config
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE_LINK;
console.log('Link: ', DB);
mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: true,
    // useUnifiedTopology: true
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB Connected...');
  })
  .catch(err => console.log('DB LOCAL ERROR:', err));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// kalau macam database punya password salah tu nnti akan error
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  // xnak directly exit the server
  // nk bagi semua operation exec dlu baru shutdown
  server.close(() => {
    process.exit(1);
  });
});
