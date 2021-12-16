interface DefExerciseAnalysis { 
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number; 
}

interface DefCalculateExercises {
  value1: number;
  value2: number[];
}

const parseArgumentsExercise = (args: Array<string>): DefCalculateExercises => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const cleanedArgs = args.map(a => Number(a));

  if (!isNaN(cleanedArgs[2]) && !cleanedArgs.slice(3).some(isNaN)) {
    return {
      value1: cleanedArgs[2],
      value2: cleanedArgs.slice(3)
    };
  } else {
    throw new Error('Please only enter number values!');
  }
};

export const calculateExercises = (dailyExerciseHours : number[], targetAverageHours : number) : DefExerciseAnalysis => {

  const average = (arr : number[]) => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

  const rating : number = (average(dailyExerciseHours) > targetAverageHours ) ? 3 : (average(dailyExerciseHours) === targetAverageHours ) ? 2 : 1;
  const ratingDescription : string = (average(dailyExerciseHours) > targetAverageHours ) ? "Great !" : (average(dailyExerciseHours) === targetAverageHours ) ? "Good" : "You can do better";


  const exerciseAnalysis : DefExerciseAnalysis = 
  {
    periodLength: dailyExerciseHours.length,
    trainingDays: dailyExerciseHours.filter(a => a !== 0).length,
    success: (targetAverageHours > average(dailyExerciseHours) ? false : true),
    rating: rating,
    ratingDescription: ratingDescription,
    target: targetAverageHours,
    average: average(dailyExerciseHours)
  };

  return exerciseAnalysis;
};

try {
  const { value1, value2 } = parseArgumentsExercise(process.argv);
  console.log(calculateExercises(value2, value1));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}