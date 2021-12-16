import React from "react";
import axios from "axios";
import { Container, Button, Icon, Card  } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";

import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import AddEntryModal from "../AddEntryModal";
import HealthRatingBar from "../components/HealthRatingBar";
import { Patient, Gender, Diagnosis, Entry, HealthCheckEntry } from "../types";
import { useStateValue } from "../state";
import { setPatientDetail, setDiagnosisList } from "../state/reducer";

const PatientDetailPage = () : JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [{ patient, diagnosis }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const fetchDiagnosis = async () => {
    try {
      if(diagnosis.length === 0) {
        const { data: diagnosisFromApi } = await axios.get<Diagnosis[]>(
            `${apiBaseUrl}/diagnoses`
          );
          dispatch(setDiagnosisList(diagnosisFromApi));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };


  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      console.log(values);
      switch(values.type) {
        case "HealthCheck" : {
          const cleanValues =  {
            description : values.description,
            date : values.date, 
            diagnosisCodes : values.diagnosisCodes, 
            specialist : values.specialist, 
            type : values.type, 
            healthCheckRating : values.healthCheckRating
          };
          const { data: newEntry } = await axios.post<Patient>(
            `${apiBaseUrl}/patients/${patient.id}/entries`,
            {  ...cleanValues }
          );
          dispatch(setPatientDetail(newEntry));
          closeModal();
          return;
        }
        case "Hospital" : {
          const cleanValues =  {
            description : values.description,
            date : values.date, 
            diagnosisCodes : values.diagnosisCodes, 
            specialist : values.specialist, 
            type : values.type, 
            discharge : values.discharge
          };
          const { data: newEntry } = await axios.post<Patient>(
            `${apiBaseUrl}/patients/${patient.id}/entries`,
            { ...cleanValues }
          );
          dispatch(setPatientDetail(newEntry));
          closeModal();
          return;
        }
        case "OccupationalHealthcare" : {
          const cleanValues =  {
            description : values.description,
            date : values.date, 
            diagnosisCodes : values.diagnosisCodes, 
            specialist : values.specialist, 
            type : values.type, 
            sickLeave : values.sickLeave,
            employerName : values.employerName
          };
          const { data: newEntry } = await axios.post<Patient>(
              `${apiBaseUrl}/patients/${patient.id}/entries`,
              { ...cleanValues }
            );
            dispatch(setPatientDetail(newEntry));
            closeModal();
          return;
        }
        default :
            console.log("Unknown Entry Type");
        }
      
    } catch (e : any) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

  const fetchPatientDetail = async () => {
    try {

      if(id && id !== patient.id) {
        const { data: patientDetailFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(setPatientDetail(patientDetailFromApi));
        }
    } catch (e) {
      console.error(e);
    }
  };


  if(id) {
    void fetchPatientDetail();
    void fetchDiagnosis();
  }

  if(!id) {
    return (
      <div className="App">
        <Container>Chargement en cours</Container>
    </div>
    );
  }

  return (
    <div className="App">
      <Container>
        <h2>Patient details : {patient.name} <Icon name={(patient.gender === Gender.Male ? 'mars' : ( patient.gender === Gender.Female ? 'venus' : 'genderless' ) )} /></h2>
        <p />ssn: {patient.ssn}
        <br />occupation: {patient.occupation}
        <h3>Entries :</h3> 
        {patient.entries.map(entry => (
            <div key={entry.id}>
              <Card.Group>
              <EntryDetails entry={entry} />
              </Card.Group>
            </div>
          ))}
            <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
      </Container>
    </div>
  );
};

const EntryDetails: React.FC<{ entry : Entry }> = ({ entry }) => {
  switch(entry.type) {
    case 'HealthCheck' :
      return <HealthCheckEntryField entry={ entry }/>;
    case 'Hospital' :
      return<HospitalEntry entry={ entry }/>;
    case 'OccupationalHealthcare' :
      return<OccupationalHealthcareEntry entry={ entry }/>;
    default : 
      return assertNever(entry as never);
  }
};

const HealthCheckEntryField: React.FC<{ entry : HealthCheckEntry }> = ({ entry }) => {
  const [{ diagnosis }, ] = useStateValue();
  const diagnosisCodes = (entry.diagnosisCodes ? entry.diagnosisCodes : []);
  return (
    <Card fluid ><Icon name="heartbeat" />
      <p><b>{ entry.date } : </b> { entry.description }</p>
      <p /><HealthRatingBar showText={false} rating={entry.healthCheckRating} />
        <ul>
          {diagnosisCodes.map(diagnosecode => (
          <li key={diagnosecode}>{ diagnosecode } : { diagnosis.find(d => d.code === diagnosecode)?.name}</li>
          ))}
        </ul>
    </Card>

  );
};

const HospitalEntry: React.FC<{ entry : Entry }> = ({ entry }) => {
  const [{ diagnosis }, ] = useStateValue();
  return (
    <Card fluid ><Icon name="ambulance" />
    <p><b>{ entry.date } : </b> { entry.description }</p>
    <ul>
    {entry.diagnosisCodes?.map(diagnosecode => (
    <li key={diagnosecode}>{ diagnosecode } : { diagnosis.find(d => d.code === diagnosecode)?.name}</li>
    ))}
  </ul>
  </Card>
  );
};

const OccupationalHealthcareEntry: React.FC<{ entry : Entry }> = ({ entry }) => {
  const [{ diagnosis }, ] = useStateValue();
  return (
    <Card fluid><Icon name="hospital" />
    <p><b>{ entry.date } : </b> { entry.description }</p>
    <ul>
    {entry.diagnosisCodes?.map(diagnosecode => (
    <li key={diagnosecode}>{ diagnosecode } : { diagnosis.find(d => d.code === diagnosecode)?.name}</li>
    ))}
  </ul>
  </Card>
  );
};


/**
 * Helper function for exhaustive type checking
 */
 const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export default PatientDetailPage;