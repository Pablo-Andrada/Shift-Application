"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialModel = exports.AppointmentModel = exports.UserModel = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Appointment_1 = require("../entities/Appointment");
const Credential_1 = require("../entities/Credential");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "shift_aplication",
    // dropSchema: true,   //esta linea sirve para reiniciar la base de datos, es decir los usuarios y vehicles
    synchronize: true,
    logging: false,
    entities: [User_1.User, Appointment_1.Appointment, Credential_1.Credential],
    subscribers: [],
    migrations: [],
});
exports.UserModel = exports.AppDataSource.getRepository(User_1.User);
exports.AppointmentModel = exports.AppDataSource.getRepository(Appointment_1.Appointment);
exports.CredentialModel = exports.AppDataSource.getRepository(Credential_1.Credential);
