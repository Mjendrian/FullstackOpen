import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField, TypeSelectField, HealthCheckRatingSelectField, HealthCheckRatingOption, TypeOption, DiagnosisSelection } from "./FormField";
import { NewEntry, EntryType, HealthCheckRating } from "../types";
import { useStateValue } from "../state";

/*
 * use type Entry, but omit id,
 * because this are irrelevant for new entry object.
 */
export type EntryFormValues = NewEntry;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const typeOptions: TypeOption[] = [
  { value: EntryType.HealthCheck, label: "Health Check" },
  { value: EntryType.Hospital, label: "Hospital" },
  { value: EntryType.OccupationalHealthcare , label: "Occupational Healthcare" }
];

const healthCheckRatingOptions: HealthCheckRatingOption[] = [
  { value: HealthCheckRating.Healthy , label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "Low Risk" },
  { value: HealthCheckRating.HighRisk , label: "High Risk" },
  { value: HealthCheckRating.CriticalRisk , label: "Critical Risk" }
];

export const AddEntryForm = ({ onSubmit, onCancel } : Props ) => {
  const [{ diagnosis }] = useStateValue();
  const [entryType, setEntryType] = React.useState<EntryType>(EntryType.HealthCheck);

  const setNewEntryType = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = (e ? e.currentTarget.value as EntryType :  EntryType.HealthCheck);
    setEntryType(newValue);
  };

  return (
    <Formik
      initialValues={{
        description: '',
        type : EntryType.HealthCheck,
        date: '',
        specialist: '',
        healthCheckRating: 1,
        diagnosisCodes : []
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const dateFormatError = "The Date must be entered in format : YYYY-MM-DD";
        const errors: { [field: string]: string } = {};
        console.log(values);
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.type) {
          errors.type = requiredError;
        }
        if (values.type === EntryType.HealthCheck &&  !values.healthCheckRating) {
          errors.healthCheckRating = requiredError;
        }
        if (values.type === EntryType.Hospital && values.discharge && !values.discharge.criteria ) {
          errors.dischargeCriteria = requiredError;
        }
        if (values.type === EntryType.Hospital && values.discharge && !values.discharge.date ) {
          errors.dischargeCriteria = requiredError;
        }
        if (values.type === EntryType.Hospital && values.discharge && Boolean(values.discharge.date) === false) {
          errors.dischargeCriteria = dateFormatError;
        }
        if (values.type === EntryType.OccupationalHealthcare &&  !values.employerName) {
          errors.employerName = requiredError;
        }
        if (values.type === EntryType.OccupationalHealthcare && values.sickLeave && Boolean(values.sickLeave.startDate) === false) {
          errors.sickLeave = dateFormatError;
        }
        if (values.type === EntryType.OccupationalHealthcare && values.sickLeave && Boolean(values.sickLeave.endDate) === false) {
          errors.sickLeave = dateFormatError;
        }
        
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if(Boolean(Date.parse(values.date)) === false) {
          errors.date = dateFormatError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <TypeSelectField
              label="Entry Type"
              name="type"
              onChange={setNewEntryType}
              options={typeOptions}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Occupation"
              placeholder="Occupation"
              name="occupation"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}            
              diagnoses={Object.values(diagnosis)}
            />    
            {(entryType === EntryType.HealthCheck) ?
            (
            <HealthCheckRatingSelectField
              label="Health Check Rating"
              name="healthCheckRating"
              options={healthCheckRatingOptions}
            />  
            ) :
             ''
            }
          {(entryType === EntryType.Hospital) ?
            (<span>
              <Field
              label="Discharge Date"
              placeholder="YYYY-MM-DD"
              name="discharge['date']"
              component={TextField}
            />
            <Field
              label="Discharge Criteria"
              placeholder="Discharge Criteria"
              name="discharge['criteria']"
              component={TextField}
            />
            </span>
            ) :
             ''
            }
            {(entryType === EntryType.OccupationalHealthcare) ?
            (<span>
              <Field
              label="Employer"
              placeholder="Employer"
              name="employerName"
              component={TextField}
            />
            <Field
              label="Sick Leave Start"
              placeholder="YYYY-MM-DD"
              name="sickLeave['startDate']"
              component={TextField}
            />
            <Field
              label="Sick Leave End"
              placeholder="YYYY-MM-DD"
              name="sickLeave['endDate']"
              component={TextField}
            />
            </span>
            ) :
             ''
            }
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
