import axios, { Axios } from "axios";
import { Component, createContext, JSX, useContext } from "solid-js";

const AxiosContext = createContext<Axios>();

export function AxiosProvider(props: { children: JSX.Element }) {
  const axiosInstance = axios.create({
    baseURL: "/",
    withCredentials: true,
  });

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {props.children}
    </AxiosContext.Provider>
  );
}

export function useAxiosContext() {
  return useContext(AxiosContext);
}
