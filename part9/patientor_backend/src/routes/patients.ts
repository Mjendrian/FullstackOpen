import express from 'express';
import patientService from '../services/patientService';
import { toNewPatient, toNewEntry} from '../utils';
import patients from '../../data/patients';
import { EntryFields } from '../types';

const router = express.Router();

const isString = (text: unknown): text is string => {
  return typeof text === 'string';
};

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitivePatientEntries());
});

router.get('/:id', (req, res) => {
  if(!req || !req.params || !req.params.id || !isString(req.params.id)) {
    throw new Error('Incorrect or missing patient Id');
  }
  const patient_id = String(req.params.id);
  const patient = patientService.getPatient(patient_id);
  res.send(patient);
});


router.post('/', (req, res) => {
  try {
    if(!req || !req.body) {
      throw new Error('Incorrect or missing form infos');
    }
    type PatientFields = { name: unknown, dateOfBirth: unknown, ssn : unknown, gender: unknown, occupation: unknown, entries: [] };


    const body = req.body as PatientFields;
    const newPatient = toNewPatient(body);
    const addedEntry = patientService.addPatient(newPatient);   
    if(addedEntry) {
      res.json(addedEntry);
    } else {
      throw new Error('Patient unknown');
    }
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    if(!req || !req.body) {
      throw new Error('Incorrect or missing form infos');
    }

    const body = req.body as EntryFields;
    const newEntry = toNewEntry(body);
    if(!req.params || !req.params.id || !isString(req.params.id)) {
      throw new Error('Patient not found');
    }
    const patient = patients.find(p => p.id === req.params.id);
    if(!patient) {
      throw new Error('Patient not found');
    }
    const addedEntry = patientService.addEntry(newEntry, patient);    
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});


export default router;