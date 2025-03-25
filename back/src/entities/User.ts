import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Appointment } from "./Appointment";

@Entity({
    name:"users"
})//users
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length:100
    })
    name: string //VARCHAR (100)
    
    @Column()
    email: string
    
    @Column("integer")
    age: number

    @Column()    
    birthdate:Date
    
    @Column()
    active: boolean

    @Column()
    nDni: string

    @Column()
    credentialsId: number

    // @OneToOne(() => Vehicle)
    // @JoinColumn()
    // vehicle: Vehicle
    @OneToMany(() => Appointment , (appointment) => appointment.user)
    appointments : Appointment[]
}




// id: 1,
// name: 'John Doe',
// email: 'john.doe@example.com',
// birthdate: new Date('1990-01-01'),
// nDni: '12345678',
// credentialsId: 1,