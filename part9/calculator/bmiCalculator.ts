interface CalculateBmi {
  value1: number;
  value2: number;
}

const parseArgumentsBmi = (args: Array<string>): CalculateBmi => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateBmi = ( height : number, weight : number) : string => {

  const bmi : number = (weight / (height/100 * height/100));

  if (bmi < 24.5) {
    return "Underweight";
  } else if (bmi < 30) {
    return "Normal (healthy weight)";
  }  else if (bmi < 35) {
    return "Overweight (Pre-obese)";
  }else {
    return "Obese";
  }

};

try {
  const { value1, value2 } = parseArgumentsBmi(process.argv);
  console.log(calculateBmi(value1, value2));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}