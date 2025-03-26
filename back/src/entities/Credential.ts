import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity({
    name: "credentials"
})
export class Credential {  // Estaba mal nombrado como "Appointment"
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    username: string;
    
    @Column()
    password: string;
    
    @OneToOne(() => User, (user) => user.credential) // Relación bidireccional opcional
    @JoinColumn()
    user: User;
}
