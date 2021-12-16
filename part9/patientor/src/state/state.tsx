import React, { createContext, useContext, useReducer } from "react";
import { Patient, Gender, Diagnosis } from "../types";

import { Action } from "../types";

export type State = {
  patients: { [id: string]: Patient };
  patient: Patient;
  diagnosis: Diagnosis[];
};

const initialState: State = {
  patients: {},
  patient: { id: '', name: '', occupation: '', dateOfBirth : '', gender: Gender.Other, entries: [] },
  diagnosis: []
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider: React.FC<StateProviderProps> = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
