import {User} from "./User.model";

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: {
        token: string;
        id: string;
        name: string;
        email: string;
        role?: string;
    }
}

export interface RegisterDto {

    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    gender: string | null;
    dateofbirth: string | null;


}

export interface GoogleLoginDto {

    email: string;
    username: string;

}
