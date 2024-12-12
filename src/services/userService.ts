import AppDataSource from "../config/datasource";
import User from "../models/User";
import UserDto from "../dto/UserDto";

const userRepository = AppDataSource.getRepository(User)

export const userExists = async (username: string): Promise<boolean> => {
    return await userRepository.findOneBy({username: username}) != null;
}

export const getUser = async (username: string): Promise<UserDto|null> => {
    const user = await userRepository.findOneBy({username: username});
    if (!user) {
        return null;
    }
    const userDto = new UserDto()
    userDto.id = user.id;
    userDto.username = user.username;
    userDto.role = user.role;
    return userDto;
}
