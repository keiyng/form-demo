import * as yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const breedWeights = {
    "Chihuahua": {min: 5, max: 20},
    "German Shepherd": {min: 20, max: 100}, 
    "Golden Retriever": {min: 20, max: 100},
    "Corgi": {min: 10, max: 40},
    "Australian Shepherd": {min: 20, max: 100}
  }
  

export const schema = {
    name: yup.string().required(),
    email: yup.string().required().email("invalid email"),
    phone: yup.string().matches(phoneRegExp, "invalid phone"),
    numPets: yup.number().required().positive().integer(),
    petAge: yup.number().required().positive().integer(),
    petAgeAccuracy: yup.string().required(),
    breed: yup.string().required(),
    weight: (position) => {
        return yup.number().positive().when(`breed-${position}`, (breed) => {
            return yup.number().min(breedWeights[breed].min).max(breedWeights[breed].max)
        })
    },
    activity: yup.string().required(),
}

export function generateValidationSchema(schema) {
    const result = {}
    schema.forEach(field => {
        result[field.name] = field.validation
    })
    return result
}

