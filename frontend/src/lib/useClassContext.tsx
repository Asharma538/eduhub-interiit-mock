import {
  Accessor,
  createContext,
  createSignal,
  JSX,
  Setter,
  useContext,
} from "solid-js";

export interface ClassDetails {
  classId: string;
  isTeacher: boolean;
  className: string;
}

const ClassContext = createContext<{
  classDetails: Accessor<ClassDetails>;
  setClassDetails: Setter<ClassDetails>;
}>();

export function ClassProvider(props: { children: JSX.Element }) {
  const [classDetails, setClassDetails] = createSignal<ClassDetails>(localStorage.getItem("classDetails") ? JSON.parse(localStorage.getItem("classDetails")!) : {
    classId: "",
    isTeacher: false,
    className: "",
  });

  return (
    <ClassContext.Provider value={{ classDetails, setClassDetails }}>
      {props.children}
    </ClassContext.Provider>
  );
}

export function useClassContext() {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClassContext must be used within a ClassProvider");
  }
  return context;
}
