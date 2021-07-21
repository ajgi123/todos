import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { useEffect } from "react";

const defaultRequest = (config: AxiosRequestConfig) => {
  return config;
};

const defaultRequestError = (error: AxiosError) => {
  return Promise.reject(error);
};

const defaultResponse = (response: AxiosResponse<any>) => {
  return response;
};

const defaultResponseError = (
  error: AxiosError
): void | undefined | Promise<any> => {
  return Promise.reject(error);
};

const useInterceptor = (
  instance: AxiosInstance,
  {
    requestFunc = defaultRequest,
    requestErrorFunc = defaultRequestError,
    responseFunc = defaultResponse,
    responseErrorFunc = defaultResponseError,
  }
) => {
  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(
      requestFunc,
      requestErrorFunc
    );

    const responseInterceptor = instance.interceptors.response.use(
      responseFunc,
      responseErrorFunc
    );
    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [requestErrorFunc, requestFunc, responseErrorFunc, responseFunc]);
};

export default useInterceptor;
