import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();

import cors from 'cors';

interface BmiResponse {
  weight : number;
  height : number;
  bmi : string;
}

interface RequestInterface {
  daily_exercises : number[];
  target : number;
}

app.use(cors());

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.post('/exercise', (req, res ) => {

  console.log(req.body);

  const body = req.body as RequestInterface;

  if(!body || !body.daily_exercises || !body.target) {
    res.status(500).send("parameters missing");
  }

  const cleanExercises : number[] = body.daily_exercises.map(a => Number(a));

  const target = Number(body.target);
  const dailyExercises = cleanExercises; 

  const exerciseResponse =  calculateExercises(dailyExercises, target);

  res.status(200).send(exerciseResponse);
});

app.get('/bmi', (req, res) => {

  if(!req.query.weight  || !req.query.height) {
    res.status(500).send("parameters missing");
  }

  const weight  = Number(req.query.weight);
  const height  = Number(req.query.height);

  if(isNaN(weight) || isNaN(height)) {
    res.status(500).send("malformatted parameters");
  }

  const bmiResponse : BmiResponse = {
    weight: weight,
    height: height,
    bmi: calculateBmi(height, weight)
  };

  res.send(bmiResponse);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});