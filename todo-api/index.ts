import express, {
  Express,
  Request,
  Response,
} from 'express';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
// Peladnyositani az express appot
const app: Express = express();
dotenv.config();

// Csinalni adatb. kapcsolatot
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  synchronize: true,
});

// Meghatarozni szerver portot
const port = process.env.PORT;

// Csinalni egy alapertelmezett route-ot
app.get('/', (req: Request, res: Response) => {
  res.send('Express + Tyscript server');
});

(async () => {
  try {
    await AppDataSource.initialize();
    // Elkezdeni hallgatni a kereseket a meghatarozott porton
    app.listen(port);
    console.log('Adatforras inicializalva');
  } catch (err) {
    console.error(
      'Hiba az adatforras inicializasanal',
      err,
    );
  }
})();
