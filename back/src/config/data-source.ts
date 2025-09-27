// back/src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

// Entidades (usar las mismas rutas que tenías)
import { User } from "../entities/User";
import { Appointment } from "../entities/Appointment";
import { Credential } from "../entities/Credential";

dotenv.config();

// Si existe DATABASE_URL (por ejemplo en Docker/Render), la usamos.
// Si no existe, caemos en la configuración "clásica" que ya tenías.
const databaseUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0
  ? process.env.DATABASE_URL
  : null;

const dataSourceOptions = databaseUrl
  ? {
      type: 'postgres' as const,
      url: databaseUrl,
      synchronize: true, // mantengo true como en tu config original
      logging: false,
      entities: [User, Appointment, Credential],
      subscribers: [],
      migrations: [],
    }
  : {
      type: 'postgres' as const,
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_NAME || 'shift_aplication',
      synchronize: true, // mantengo true como en tu config original
      logging: false,
      entities: [User, Appointment, Credential],
      subscribers: [],
      migrations: [],
    };

export const AppDataSource = new DataSource({
  ...dataSourceOptions,
});

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
      console.log('Data Source has been initialized.');
      return;
    } catch (err) {
      attempt++;
      lastError = err;
      console.warn(
        `Data Source initialization failed (attempt ${attempt}/${retries}). Retrying in ${delayMs}ms...`
      );
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  console.error('All attempts to connect to the database have failed.');
  throw lastError;
}

// Exporto los repositories tal como los tenías (no modifiqué nombres ni comportamiento)
export const UserModel = AppDataSource.getRepository(User);
export const AppointmentModel = AppDataSource.getRepository(Appointment);
export const CredentialModel = AppDataSource.getRepository(Credential);
