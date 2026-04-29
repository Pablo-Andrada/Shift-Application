import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Appointment } from "./Appointment";
import { Credential } from "./Credential";

export type UserRole = "admin" | "user";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column()
    email: string;

    @Column()
    birthdate: Date;

    @Column()
    nDni: string;

    @Column()
    credentialsId: number;

    @Column({
        type: "enum",
        enum: ["admin", "user"],
        default: "user"
    })
    role: UserRole;

    @OneToOne(() => Credential, (credential) => credential.user)
    @JoinColumn()
    credential: Credential;

    @OneToMany(() => Appointment, (appointment) => appointment.user)
    appointments: Appointment[];
}
