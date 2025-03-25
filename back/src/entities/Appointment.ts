import { Column, Entity, PrimaryGeneratedColumn,ManyToOne } from "typeorm";
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

    @Column()
    status: 'active' | 'cancelled';

    @ManyToOne(() => User, (user) => user.vehicles)
    user: User
}

// id: 1,
// date: new Date('2024-12-25'),
// time: '14:00',
// userId: 1,
// status: 'active',