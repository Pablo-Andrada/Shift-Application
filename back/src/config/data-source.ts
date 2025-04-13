import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Appointment } from "../entities/Appointment";
import { Credential } from "../entities/Credential";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "shift_aplication",
    //dropSchema: true,   //esta linea sirve para reiniciar la base de datos, es decir los usuarios y vehicles
    synchronize: true,
    logging: false,
    entities: [User,Appointment,Credential],
    subscribers: [],
    migrations: [],
})

export const UserModel = AppDataSource.getRepository(User);
export const AppointmentModel = AppDataSource.getRepository(Appointment);
export const CredentialModel = AppDataSource.getRepository(Credential);

