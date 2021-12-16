import { NewPatientEntry, Gender, Entry, EntryType, NewEntry, EntryFields, Discharge, SickLeave } from './types';

type PatientFields = { name: unknown, dateOfBirth: unknown, ssn : unknown, gender: unknown, occupation: unknown, entries: [] };

const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation, entries } : PatientFields ): NewPatientEntry => {
  const newEntry: NewPatientEntry = {
    name: parseName(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn : parseSsn(ssn),
    gender: parseGender(gender),
    occupation: parseOccupation(occupation),
    entries: parseEntries(entries)
  };

  return newEntry;
};

const toNewEntry = ({ description, type, date, specialist, healthCheckRating, employerName, discharge, diagnosisCodes, sickLeave } : EntryFields ): NewEntry => {
  switch(type) {
    case EntryType.HealthCheck : 
      const healthCheckEntry: NewEntry = {
        description: parseDescription(description),
        type: EntryType.HealthCheck,
        date: parseDate(date),
        specialist: parseSpecialist(specialist),
        diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
        healthCheckRating : parseHealthCheckRating(healthCheckRating)
      };
      return healthCheckEntry;
    case EntryType.OccupationalHealthcare : 
      const occupationalHealthcareEntry: NewEntry = {
        description: parseDescription(description),
        type: EntryType.OccupationalHealthcare,
        date: parseDate(date),
        specialist: parseSpecialist(specialist),
        employerName: parseName(employerName) ,
        sickLeave: parseSickLeave(sickLeave)
      };
      return occupationalHealthcareEntry;
    case EntryType.Hospital : 
      const hospitalEntry: NewEntry = {
        description: parseDescription(description),
        type: EntryType.Hospital,
        date: parseDate(date),
        specialist: parseSpecialist(specialist),
        discharge: parseDischarge(discharge)
      };
      return hospitalEntry;
    default : 
      throw new Error('Unknown Entry type');
  }

};

const parseDescription = (description : unknown) : string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description');
  }

  return description;
};

/*
const parseType =  (type : unknown) : EntryType => {
  if (!type || !isString(type)) {
    throw new Error('Incorrect or missing type');
  }

  switch (type) {
    case "OccupationalHealthcare" :
      return EntryType.OccupationalHealthcare;
    case "HealthCheck" :
      return EntryType.HealthCheck;
    case "Hospital" :
      return EntryType.Hospital;
    default :
      throw new Error('Incorrect or missing type');
  }
};
*/

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

const parseDiagnosisCodes = (diagnosisCodes : unknown) : string[] => {

  if(!diagnosisCodes || (Array.isArray(diagnosisCodes) && diagnosisCodes.length === 0) ) {
    return [];
  }

  for( const diagnosisCode of diagnosisCodes as string[] ) {
    if(!isString(diagnosisCode)) {
      throw new Error('Incorrect diagnosisCodes');
    }
  }

  
  return diagnosisCodes as string[];

};


const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseDischarge = (discharge: unknown) : Discharge => {
  if(!discharge) {
    throw new Error('No discharge dates found');
  }

  if(typeof discharge !== 'object'  || !('date' in discharge) || !('criteria' in discharge) ) {
    throw new Error('No discharge information found');
  } 

  if(!isString((discharge as Discharge).date) || !isString((discharge as Discharge).criteria)) {
    throw new Error('No discharge information found');
  }

  return discharge as Discharge;
};

const parseSickLeave  = (sickLeave: unknown) : SickLeave => {
  if(!sickLeave) {
    return sickLeave as SickLeave;
  }

  if(typeof sickLeave !== 'object'  || !('startDate' in sickLeave) || !('endDate' in sickLeave) ) {
    throw new Error('No correct sickLeave information found');
  } 

  if(!isString((sickLeave as SickLeave).startDate) || !isString((sickLeave as SickLeave).endDate)) {
    throw new Error('No correct sickLeave information found');
  }

  return sickLeave as SickLeave;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing name');
  }

  return specialist;
};

const parseHealthCheckRating = (healthCheckRating: unknown): number => {
  if (!healthCheckRating) {
    throw new Error('Missing healthCheckRating');
  }
  if(isNaN(Number(healthCheckRating))) {
    throw new Error('Incorrect healthCheckRating');
  }

  return Number(healthCheckRating);
};



const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
      throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }

  return occupation;
};

const parseEntries = (entries: Entry[]): Entry[] => {

  if(entries && Array.isArray(entries) ) {
    for( const entry of entries ) {
      if(!isEntry(entry)) {
        throw new Error('Incorrect or missing occupation');
      }
    }
  }

  return entries;
};

function isEntry(entry: Entry): entry is Entry {
  return entry.type !== undefined;
}

const parseSsn = (ssn: unknown): string | undefined => {
  if(!ssn) {
    return undefined;
  }
  if (!isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }

  return ssn;
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string';
};

/*
const isStringArray = (array : unknown): array is string[] => {
  if(!Array.isArray(array)) {
    return false;
  } else {
    return (array.filter(a => (!isString(a.string))).length > 0 ? false : true);
  }
};
*/

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (str: string): str is Gender => {
  return ['male', 'female', 'other'].includes(str);
};

export { toNewPatient, toNewEntry };