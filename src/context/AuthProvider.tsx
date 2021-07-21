import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useHistory } from "react-router";
import { tryCatch } from "../helpers/asyncHelpers";
import { localStorageService } from "../helpers/localStorageService";
import useAsync, { Status } from "../hooks/useAsync";

export const REFRESH_TOKEN_LOCAL_STORAGE = "refreshToken";

const signUpLoginInstance = axios.create({
  baseURL: `${process.env.REACT_APP_AUTH_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

const login = (email: string, password: string) => {
  return signUpLoginInstance
    .post(
      `/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return Promise.reject(err.message);
    });
};

const signUp = (email: string, password: string, displayName: string) => {
  return signUpLoginInstance
    .post(`/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_KEY}`, {
      email,
      password,
      displayName,
      returnSecureToken: true,
    })
    .then((response) => response.data)
    .catch((err) => Promise.reject(err.message));
};

interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  project_id: string;
  refresh_token: string;
  token_type: string;
  user_id: string;
}

const refreshToken = (refreshToken: string): Promise<RefreshTokenResponse> => {
  return axios
    .post(
      `${process.env.REACT_APP_REFRESH_TOKEN_URL}`,
      `grant_type=refresh_token&refresh_token=${refreshToken}`,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    .then((response) => response.data)
    .catch((err) => Promise.reject(err));
};

interface User {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: number;
  localId: string;
  displayName: string;
  kind: string;
  registered: boolean;
}

type unionType = User | null;

type AuthContextType = {
  error: string | null;
  status: Status;
  userData: unionType;
  signUpUser: (email: string, password: string, displayName: string) => void;
  loginUser: (email: string, password: string) => void;
  logOutUser: () => void;
  addTokenToHeader: (config: AxiosRequestConfig) => AxiosRequestConfig;
  refreshTokenOn401: (error: AxiosError) => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<undefined | AuthContextType>(undefined);

let initialState: unionType;
initialState = null;

type AuthProviderPropsType = { children: ReactNode };

export const AuthProvider = ({ children }: AuthProviderPropsType) => {
  const {
    error,
    status,
    data: userData,
    runAsync,
    setState,
    setError,
  } = useAsync(initialState);
  let history = useHistory();

  useEffect(() => {
    const refresh = localStorageService.getItem(
      REFRESH_TOKEN_LOCAL_STORAGE
    ) as string;
    if (refresh) {
      refreshToken(refresh)
        .then((res) => {
          setState({
            idToken: res.access_token,
            email: "",
            refreshToken: res.refresh_token,
            expiresIn: res.expires_in,
            localId: res.user_id,
            displayName: "",
            kind: "",
            registered: true,
          });
          history.push("/todos");
        })
        .catch((err) => {
          localStorage.removeItem(REFRESH_TOKEN_LOCAL_STORAGE);
          alert("Failed to refresh Token");
        });
    }
  }, [setState, history]);

  function signUpUser(email: string, password: string, displayName: string) {
    runAsync(signUp(email, password, displayName));
  }

  function loginUser(email: string, password: string) {
    runAsync(login(email, password));
  }

  function logOutUser() {
    localStorage.removeItem(REFRESH_TOKEN_LOCAL_STORAGE);
    setError("Log out");
  }

  const addTokenToHeader = useCallback(
    (config: AxiosRequestConfig) => {
      if (userData) {
        config.url = `${config.url}?auth=${userData.idToken}`;
      }
      return config;
    },
    [userData]
  );

  const refreshTokenOn401 = useCallback(
    async (error: AxiosError) => {
      const code = error.response ? error.response.status : 0;
      if (code === 401 && userData) {
        const [resRefresh] = await tryCatch(
          refreshToken(userData.refreshToken)
        );

        if (resRefresh) {
          console.log("refresh true", resRefresh);
          setState({
            ...userData,
            idToken: resRefresh.access_token,
            refreshToken: resRefresh.refresh_token,
          });
          const index = error.config.url?.lastIndexOf("auth=");
          error.config.url = `${error.config.url?.slice(0, index)}auth=${
            resRefresh.id_token
          }`;
        }

        const [resAxios] = await tryCatch(axios(error.config));
        if (resAxios) {
          return resAxios;
        }
      }
      return Promise.reject(error);
    },
    [userData, setState]
  );

  const isAuthenticated = !!userData;

  const value = {
    error,
    status,
    userData,
    signUpUser,
    loginUser,
    logOutUser,
    addTokenToHeader,
    refreshTokenOn401,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}
