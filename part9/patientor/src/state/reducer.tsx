import { State } from "./state";
import { Patient, Action, Diagnosis } from "../types";

export const reducer = (state: State, action: Action): State => {
  console.log(state);
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
      case "SET_DIAGNOSIS_LIST":
        return {
          ...state,
          diagnosis: action.payload
        };
    case "SET_PATIENT_DETAIL":
      return {
        ...state,
        patient: {
          ...action.payload
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    default:
      return state;
  }
};

export const setPatientList = (patientListFromApi: Patient[]) : Action => {
    return { 
      type: "SET_PATIENT_LIST", 
      payload: patientListFromApi
    };
};

export const setDiagnosisList = (diagnonsisListFromApi: Diagnosis[]) : Action => {
  return { 
    type: "SET_DIAGNOSIS_LIST", 
    payload: diagnonsisListFromApi
  };
};

export const setPatientDetail = (patientDetailFromApi: Patient) : Action => {
  return { 
    type: "SET_PATIENT_DETAIL", 
    payload: patientDetailFromApi
  };
};

export const addPatient = (newPatient: Patient) : Action => {
  return { 
    type: "ADD_PATIENT", 
    payload: newPatient
  };
};


