export interface User {
    user: {
        name: string;
        surname: string;
        email: string;
        username: string;
        image?: string;
        password?: string;
        bio?: string;
        gender?: string;
        dateofbirth?: string;
        avatar?: string;
    }
}

export interface UpdateUserDto {
    user: {
        name: string;
        surname: string;
        email: string;
        username: string;
        image?: string;
        password?: string;
        bio?: string;
        gender?: string;
        dateofbirth?: string;
    }
}

export class RegisterUserDto {

}

