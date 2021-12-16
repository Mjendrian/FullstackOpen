import patients from '../../data/patients';
import { v4 as uuidv4 } from 'uuid';

import { Patient, NonSensitivePatientEntry, NewPatientEntry, NewEntry } from '../types';

const getEntries = (): Array<Patient> => {  
  return patients;
};

const getPatient = ( id: string ) :  Patient | undefined => {  
  if(typeof id === undefined) {
    throw new Error('Incorrect or missing patient Id');
  }
  const patient = patients.find(p => p.id === id);
  return patient;
};

const getNonSensitivePatientEntries = (): NonSensitivePatientEntry[] => {  

  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({    
    id,    
    name,    
    dateOfBirth,    
    gender,
    occupation  
  }));
};

const addPatient = ( entry: NewPatientEntry ): Patient => {  
  const newPatientEntry = {
    id: uuidv4(),
    ...entry  
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = ( entry: NewEntry, patient : Patient ): Patient => {  
  const newEntry = {
    id: uuidv4(),
    ...entry  
  };

  const patientToUpdate = patients.find(p => p.id === patient.id);
  if(patientToUpdate === undefined) {
    throw new Error('Incorrect or missing patient Id');
  }
  
  patientToUpdate.entries.push(newEntry);
  return patientToUpdate;
};

export default {
  getEntries,
  getNonSensitivePatientEntries,
  addEntry,
  getPatient,
  addPatient
};