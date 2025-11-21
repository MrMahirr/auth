import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root1234',
  database: 'auth',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};
export default config;
