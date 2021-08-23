import * as yup from 'yup';
import {useState, useEffect} from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { schema as questionSchema, baseQuestionsSchema, createPetFields } from './questionSchema';

const sendToApi = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {resolve(data)}, 1000)
  })
}

function generateValidationSchema(schema) {
  const result = {}
  schema.forEach(field => {
      result[field.name] = field.validation
  })
  return result
}

const onSubmit = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, 2000)
  })
};

function App() {
  const [current, setCurrent] = useState(0)
  const [questions, setQuestions] = useState(questionSchema);
  const [validation, setValidation] = useState(
    yup.object().shape(
      generateValidationSchema(questions)
    )
  );

  useEffect(() => {
    setValidation(yup.object().shape(generateValidationSchema(questions)))
  }, [questions])

  // register make value available for both the form validation and submission.
  const { register, handleSubmit, watch, formState, getValues, trigger } = useForm({
    resolver: yupResolver(validation)
  });
  const {errors, isSubmitting, isSubmitSuccessful} = formState;

  const renderInput = (item) => {
    if(item.inputFieldType === 'select') {
      return <select {...register(item.name, {...item.validation })}>
        {item.options.map(option => <option key={option}>{option}</option>)}
      </select>
    }
    return (
      <input 
        {...register(item.name, {...item.validation })} 
        type={item.inputFieldType} 
      /> 
    )
  }

  function regenerateQuestions(num) {
    const questions = [...baseQuestionsSchema]
    for(let i=0; i<num; i++) {
      questions.push(...createPetFields(i))
    }
    setQuestions(questions)
  }

  const nextCard = async () => {
    const field = questions[current].name;
    const val = getValues(field)
    const valid = await trigger(field)
    
    // this should be triggered by the result an of api request?
    if(field === "numPets") {
      regenerateQuestions(val);
    }

    if(valid) {
      void sendToApi({[field]: val})
      setCurrent(current + 1)
    }
  }

  const prevCard = () => {
    setCurrent(current - 1)
  }

  return (
    <div style={{padding: '2rem'}}>
      <form onSubmit={handleSubmit(onSubmit)} style={{margin: '2rem 0'}}>

        {questions.map(item => {
            const [beforeText, afterText] = item.display.split('<input>')
            return (
              <div 
                key={item.name} 
                style={{display: questions[current].name === item.name ? 'block' : 'none'}}
              >
                {/* <label htmlFor={item.name}>{item.label}</label> */}
                <span>{beforeText}</span>
                {renderInput(item)}
                <span>{afterText}</span>
                {errors[item.name]?.message && (
                  <span style={{color: 'red'}}>
                    {errors[item.name].message}
                  </span>
                )}
              </div>
            )
          })}

        {current === questions.length - 1 && <button type="submit" disabled={isSubmitting}>submit</button>}
        {isSubmitSuccessful && <p style={{color: 'green'}}>Successfully submitted</p>}
      </form>
      {current > 0 && <button onClick={prevCard}>prev</button>}
      {current <  questions.length - 1 && (
        <button onClick={nextCard}>next</button>
      )}
      <hr />
      <p>total questions: {questions.length}</p>
      <p>current: {current + 1} ({questions[current].name})</p>
      <pre>values: {JSON.stringify(watch(), null, 2)}</pre>
      {Object.entries(errors).map(([field, val]) => {
        return (<div key={field}>errors: <pre>{JSON.stringify({field, message: val.message}, null, 2)}</pre></div>)
      })}
    </div>
  );
}

export default App;


// questions
// can add register prop to corgi component? or forwardRef (forwards props of register)?
// how to retrieve progress? useForm's defaultValues props?
// display text from server schema? (hard to dynamically update narrative e.g. he/she, pet names)
// validation rules / schema on server? 

// TODO:
// onBlur validate example
// multiple fields in one card example
// async validation example
// how to store progress
// conditionally render fields/narrative based on answer
// try unregister field to update progress

// advantages:
// handle form values states
// handle form states e.g. isDirty, isTouched
// plug in 3rd party validation 
