import axios, { Axios, AxiosInstance } from "axios";
import { Component, createContext, JSX, useContext } from "solid-js";

const AxiosContext = createContext<AxiosInstance>();

export function AxiosProvider(props: {
  axiosInstance: AxiosInstance;
  children: JSX.Element;
}) {
  return (
    <AxiosContext.Provider value={props.axiosInstance}>
      {props.children}
    </AxiosContext.Provider>
  );
}


export function useAxiosContext() {
  return useContext(AxiosContext);
}
