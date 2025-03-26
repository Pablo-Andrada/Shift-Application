import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Appointment } from "./Appointment";
import { Credential } from "./Credential";

@Entity({
    name:"users"
})//users
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;
    
    @Column()
    email: string;
    
    @Column("integer")
    age: number;

    @Column()
    birthdate: Date;
    
    @Column()
    active: boolean;

    @Column()
    nDni: string;

    @OneToOne(() => Credential, (credential) => credential.user) 
    @JoinColumn()
    credential: Credential;  // Antes era solo "credentialsId", ahora se hace bien la relación 1:1

    @OneToMany(() => Appointment , (appointment) => appointment.user)
    appointments: Appointment[];
}
