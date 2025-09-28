// back/src/data-source.ts
import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import dotenv from 'dotenv';

// Entidades (usar las mismas rutas que tenías)
import { User } from "../entities/User";
import { Appointment } from "../entities/Appointment";
import { Credential } from "../entities/Credential";

dotenv.config();

// Detecto DATABASE_URL (útil en Docker/Render) o config clásica de DB.
const databaseUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0
  ? process.env.DATABASE_URL
  : null;

/**
 * Configuración de DataSource - soporta dos modos:
 * 1) DATABASE_URL (por ejemplo en Render / Docker)
 * 2) Host/Port/Username/Password clásico (local)
 */
const commonEntities = [User, Appointment, Credential];

const dataSourceOptions = databaseUrl
  ? {
      type: 'postgres' as const,
      url: databaseUrl,
      synchronize: true,
      logging: false,
      entities: commonEntities,
      subscribers: [],
      migrations: [],
      // Si estamos en producción y el proveedor exige SSL (ej: Render/Heroku), acepto cert autofirmado
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }
  : {
      type: 'postgres' as const,
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_NAME || 'shift_aplication',
      synchronize: true,
      logging: false,
      entities: commonEntities,
      subscribers: [],
      migrations: [],
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };

export const AppDataSource = new DataSource({
  ...dataSourceOptions,
});

/**
 * Repositories exportados como `let` para asignarlos justo después
 * de que la DataSource se inicialice correctamente.
 *
 * Esto preserva la API (import { UserModel } from './data-source')
 * pero evita llamar getRepository antes de inicializar.
 */
export let UserModel: Repository<User>;
export let AppointmentModel: Repository<Appointment>;
export let CredentialModel: Repository<Credential>;

/**
 * Inicializa la DataSource con reintentos (útil en Docker cuando Postgres tarda en estar ready).
 * retries: cantidad de intentos (por defecto 10)
 * delayMs: milisegundos entre intentos (por defecto 2000)
 */
export async function initializeDataSourceWithRetry(
  retries = 10,
  delayMs = 2000
): Promise<void> {
  let attempt = 0;
  let lastError: unknown = null;

  while (attempt < retries) {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }

      // Asigno aquí los repositories para que estén disponibles
      UserModel = AppDataSource.getRepository(User);
      AppointmentModel = AppDataSource.getRepository(Appointment);
      CredentialModel = AppDataSource.getRepository(Credential);

      console.log('Data Source has been initialized and repositories assigned.');
      return;
    } catch (err) {
      attempt++;
      lastError = err;
      console.warn(
        `Data Source initialization failed (attempt ${attempt}/${retries}). Retrying in ${delayMs}ms...`,
        err
      );
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  console.error('All attempts to connect to the database have failed.');
  throw lastError;
}
