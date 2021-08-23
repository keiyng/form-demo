import {schema as validationSchema} from './validation';

export const baseQuestionsSchema = [
  {
    name: "name",
    label: "Name",
    display: "My name is <input>",
    inputFieldType: "text",
    validation: validationSchema.name

  },
  {
    name: "email",
    label: "Email",
    display: "My email is <input>",
    inputFieldType: "email",
    validation: validationSchema.email

  },
  {
    name: "phone",
    label: "Phone",
    display: "My phone no. is <input>",
    inputFieldType: "tel",
    validation: validationSchema.phone
  },
  {
    name: "numPets",
    label: "No. of Pets",
    display: "I have <input> dog",
    inputFieldType: "select",
    multi: false,
    options: [1, 2, 3, 4, 5, 6, 7, 8], // render differently if > 8 
    validation: validationSchema.numPets
  }
]

export const createPetFields = (position) => {
  return [
  {
    name: `petAge-${position}`,
    label: "Age",
    display: "He is <input>",
    inputFieldType: "number",
    validation: validationSchema.petAge
  },
  {
    name: `petAgeAccuracy-${position}`,
    label: "Accuracy",
    display: "<input> old",
    inputFieldType: "select",
    multi: false,
    options: ["years", "months", "weeks"],
    // inline: ["petAge"],
    validation: validationSchema.petAgeAccuracy
  },
  {
    name: `breed-${position}`,
    label: "Breed",
    display: "He is a <input>",
    inputFieldType: "select",
    multi: true,
    options: ["Chihuahua", "German Shepherd", "Golden Retriever", "Corgi", "Australian Shepherd"], // how to handle unknown mix
    validation: validationSchema.breed
  },
  {
    name: `weight-${position}`,
    label: "Weight",
    display: "He weighs <input> lbs",
    inputFieldType: "text",
    validation: validationSchema.weight(position)
  },
  {
    name: `activity-${position}`,
    label: "Activity Level",
    display: "He is <input>",
    inputFieldType: "select",
    multi: false,
    options: ["active", "not active"],
    validation: validationSchema.activity
  }
]}


export const schema = [
   ...baseQuestionsSchema,
    ...createPetFields(0)  
]
