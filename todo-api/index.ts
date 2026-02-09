import 'reflect-metadata';

import express, { Express } from 'express';
import { addRoutes } from './src/config/routes.config';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { responseFormatter } from './src/middleware/responseFormatter.middleware';
import cors, { CorsOptions } from 'cors';

// import { DataSource } from 'typeorm';
// Peladnyositani az express appot
const app: Express = express();

// CONFIG DOTENV
dotenv.config();

// PORT
const port = process.env.PORT;

const corsOptions: CorsOptions = {
  // use my hosting url
  origin: [
    process.env.FRONT_END_URL!,
    process.env.LOCAL_DEV_SERVER!,
  ],
  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// CORS
app.use(cors(corsOptions));

// MIDDLEWARE
app.use(express.json());
app.use(responseFormatter);

// Creating our routes for the express app
addRoutes(app);

const boostrap = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('Cannot read environment variables');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      dbName: process.env.DATABASE_NAME,
    });
    app.listen(port, () => {
      console.log('SERVER RUNNING');
    });
  } catch (err) {
    console.log(err);
    // IF ERROR EXIT PROCESS
    process.exit(1);
  }
};

boostrap();

// dotenv.config();

// Csinalni adatb. kapcsolatot
// export const AppDataSource = new DataSource({
//   type: 'mysql',
//   host: 'localhost',
//   port: 3306,
//   username: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DB,
//   synchronize: true,
// });

// Meghatarozni szerver portot
// const port = process.env.PORT;

// (async () => {
//   try {
//     await AppDataSource.initialize();
//     // Elkezdeni hallgatni a kereseket a meghatarozott porton
//     app.listen(port);
//     console.log('Adatforras inicializalva');
//   } catch (err) {
//     console.error(
//       'Hiba az adatforras inicializasanal',
//       err,
//     );
//   }
// })();
