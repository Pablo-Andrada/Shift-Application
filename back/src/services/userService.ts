import UserDto from "../dtos/UserDto";
import { User } from "../entities/User";
import { UserModel } from "../config/data-source";

export const createUserService = async (userData: UserDto): Promise<User> => {
    const user = UserModel.create(userData);
    await UserModel.save(user);
    return user;
};

export const getUsersService = async (): Promise<User[]> => {
    return await UserModel.find({ relations: { appointments: true } });
};

export const getUserByIdService = async (id: number): Promise<User | null> => {
    return await UserModel.findOne({ where: { id }, relations: { appointments: true } });
};

export const deleteUserService = async (id: number): Promise<void> => {
    await UserModel.delete({ id });
};

export const getUserByCredentialIdService = async (credentialId: number): Promise<User | null> => {
    return await UserModel.findOne({
        where: { credentialsId: credentialId },
        relations: ["credential", "appointments"]
    });
};
