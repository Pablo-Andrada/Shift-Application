import { UserRole } from "../entities/User";

export default interface UserDto {
    name: string;
    email: string;
    birthdate: Date;
    nDni: string;
    credentialsId: number;
    role?: UserRole;
}
