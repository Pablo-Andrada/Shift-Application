// import { Column, Entity, PrimaryGeneratedColumn,ManyToOne } from "typeorm";
// import { User } from "./User";

// @Entity({
//     name: "appointments"
// })
// export class Appointment {
//     @PrimaryGeneratedColumn()
//     id: number;
    
//     @Column()
//     date: Date;
    
//     @Column()
//     time: string;
    
//     @Column()
//     userId: number;

//     @Column()
//     status: 'active' | 'cancelled';

//     @ManyToOne(() => User, (user) => user.appointments)
//     user: User
// }

// // id: 1,
// // date: new Date('2024-12-25'),
// // time: '14:00',
// // userId: 1,
// // status: 'active',
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity({
    name: "appointments"
})
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    date: Date;
    
    @Column()
    time: string;
    
    @Column()
    userId: number;

    @Column({
        type: "enum",
        enum: ["active", "cancelled"],  
        default: "active"  // Por defecto, los turnos están activos
    })
    status: "active" | "cancelled";

    @ManyToOne(() => User, (user) => user.appointments)
    user: User; // Se eliminó userId porque TypeORM lo maneja solo
}
id: number; // ID numérico que identifica al turno
date: Date; // Fecha para la cual fue reservado el turno
time: string; // Hora para la cual fue reservado el turno (formato HH:mm)
userId: number; // ID del usuario que agendó el turno, referencia al usuario
status: 'active' | 'cancelled'; // Estado actual del turno