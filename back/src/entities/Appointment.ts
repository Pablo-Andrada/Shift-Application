// import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
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

//     @Column({
//         type: "enum",
//         enum: ["active", "cancelled"],
//         default: "active"
//     })
//     status: "active" | "cancelled";

//     @Column({
//         type: "boolean",
//         default: false // ⬅️ Por defecto no se envió el recordatorio
//     })
//     reminderSent: boolean;

//     @ManyToOne(() => User, (user) => user.appointments)
//     user: User;
// }


// src/entities/Appointment.ts
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
    
    // Este campo se mantiene por compatibilidad, aunque TypeORM maneja automáticamente la relación.
    @Column()
    userId: number;

    @Column({
        type: "enum",
        enum: ["active", "cancelled"],  
        default: "active"  // Por defecto, los turnos están activos
    })
    status: "active" | "cancelled";

    // Nuevo campo para almacenar si se ha enviado el recordatorio, ya estaba implementado.
    @Column({
        type: "boolean",
        default: false // Por defecto, no se ha enviado el recordatorio
    })
    reminderSent: boolean;

    // NUEVO CAMPO: comentarios. Se agregará para que el usuario pueda dejar un texto adicional (máximo 50 caracteres).
    // Se utiliza el tipo "varchar" con longitud 50 y se establece un valor por defecto (cadena vacía) para no afectar turnos existentes.
    @Column({
        type: "varchar",
        length: 50,
        default: ""
    })
    comentarios: string;

    @ManyToOne(() => User, (user) => user.appointments)
    user: User; // Se mantiene la relación con el usuario
}
