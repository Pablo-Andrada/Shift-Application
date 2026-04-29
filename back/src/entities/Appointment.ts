import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity({ name: "appointments" })
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
        default: "active"
    })
    status: "active" | "cancelled";

    @Column({ type: "boolean", default: false })
    reminderSent: boolean;

    // Descripción de la falla / motivo del turno (ingresado por el usuario)
    @Column({ type: "varchar", length: 200, default: "" })
    descripcionFalla: string;

    // Datos del vehículo ingresados por el usuario
    @Column({ type: "varchar", length: 100, default: "" })
    vehicleBrand: string;   // Marca

    @Column({ type: "varchar", length: 100, default: "" })
    vehicleModel: string;   // Modelo

    @Column({ type: "varchar", length: 20, default: "" })
    vehiclePlate: string;   // Patente

    @Column({ type: "varchar", length: 4, default: "" })
    vehicleYear: string;    // Año

    // Tipo de reparación (seleccionado de lista)
    @Column({ type: "varchar", length: 100, default: "" })
    repairType: string;

    // Notas internas del admin (no visibles para el usuario)
    @Column({ type: "varchar", length: 200, default: "" })
    adminNotes: string;

    // Mensaje del admin al cliente (visible para el usuario)
    @Column({ type: "varchar", length: 300, default: "" })
    adminMessage: string;

    // Duración estimada en minutos (la define el admin)
    @Column({ type: "int", default: 0 })
    estimatedDuration: number;

    // Comentarios adicionales del usuario (campo original, renombrado para claridad)
    @Column({ type: "varchar", length: 50, default: "" })
    comentarios: string;

    @ManyToOne(() => User, (user) => user.appointments)
    user: User;
}
