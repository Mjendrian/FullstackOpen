import {  CoursePart } from '../types';

const Content = ({ courseParts } : { courseParts : CoursePart[] }) : JSX.Element => {     
     
  return (
    <div>
      {courseParts.map((coursePart : CoursePart) => {
        return <Part coursePart={coursePart} />
      })}
    </div>
  )
}

const Part = ({ coursePart } : { coursePart : CoursePart }) : JSX.Element => {
  
  switch(coursePart.type) {
    case 'normal' :
      return (
        <div>
          <p>
            <b>{ coursePart.name } { coursePart.exerciseCount }</b>
            <br /><i>{ coursePart.description }</i>
          </p>
        </div>
      );
    case 'groupProject' :
        return (
          <div>
          <p>
            <b>{ coursePart.name } { coursePart.exerciseCount }</b>
            <br />Project exercises : { coursePart.exerciseCount }
          </p>
        </div>
        );
    case 'submission' :
        return (
          <div>
          <p>
            <b>{ coursePart.name } { coursePart.exerciseCount }</b>
            <br /><i>{ coursePart.description }</i>
            <br />submit to  { coursePart.exerciseSubmissionLink }
          </p>
        </div>
        );
    case 'special' :
        return (
          <div>
          <p>
            <b>{ coursePart.name } { coursePart.exerciseCount }</b>
            <br /><i>{ coursePart.description }</i>
            <br />required skills : { coursePart.requirements.join(', ') }
          </p>
        </div>
          );
    default :
        assertNever(coursePart)
        return (
          <p>
            failed to parse the Course
          </p>
        );
  }
}

/**
 * Helper function for exhaustive type checking
 */
 const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export default Content;