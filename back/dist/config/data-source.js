"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialModel = exports.AppointmentModel = exports.UserModel = exports.AppDataSource = void 0;
exports.initializeDataSourceWithRetry = initializeDataSourceWithRetry;
// back/src/data-source.ts
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
// Entidades (usar las mismas rutas que tenías)
const User_1 = require("../entities/User");
const Appointment_1 = require("../entities/Appointment");
const Credential_1 = require("../entities/Credential");
dotenv_1.default.config();
// Si existe DATABASE_URL (por ejemplo en Docker/Render), la usamos.
// Si no existe, caemos en la configuración "clásica" que ya tenías.
const databaseUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0
    ? process.env.DATABASE_URL
    : null;
const dataSourceOptions = databaseUrl
    ? {
        type: 'postgres',
        url: databaseUrl,
        synchronize: true, // mantengo true como en tu config original
        logging: false,
        entities: [User_1.User, Appointment_1.Appointment, Credential_1.Credential],
        subscribers: [],
        migrations: [],
    }
    : {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'admin',
        database: process.env.DB_NAME || 'shift_aplication',
        synchronize: true, // mantengo true como en tu config original
        logging: false,
        entities: [User_1.User, Appointment_1.Appointment, Credential_1.Credential],
        subscribers: [],
        migrations: [],
    };
exports.AppDataSource = new typeorm_1.DataSource(Object.assign({}, dataSourceOptions));
/**
 * Inicializa la DataSource con reintentos (útil en Docker cuando Postgres tarda en estar ready).
 * retries: cantidad de intentos (por defecto 10)
 * delayMs: milisegundos entre intentos (por defecto 2000)
 */
function initializeDataSourceWithRetry() {
    return __awaiter(this, arguments, void 0, function* (retries = 10, delayMs = 2000) {
        let attempt = 0;
        let lastError = null;
        while (attempt < retries) {
            try {
                if (!exports.AppDataSource.isInitialized) {
                    yield exports.AppDataSource.initialize();
                }
                console.log('Data Source has been initialized.');
                return;
            }
            catch (err) {
                attempt++;
                lastError = err;
                console.warn(`Data Source initialization failed (attempt ${attempt}/${retries}). Retrying in ${delayMs}ms...`);
                yield new Promise((res) => setTimeout(res, delayMs));
            }
        }
        console.error('All attempts to connect to the database have failed.');
        throw lastError;
    });
}
// Exporto los repositories tal como los tenías (no modifiqué nombres ni comportamiento)
exports.UserModel = exports.AppDataSource.getRepository(User_1.User);
exports.AppointmentModel = exports.AppDataSource.getRepository(Appointment_1.Appointment);
exports.CredentialModel = exports.AppDataSource.getRepository(Credential_1.Credential);
