import {createContext, useContext} from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
