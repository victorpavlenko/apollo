import * as yup from 'yup';

const validMessage = `Please provide a valid email and name`;

const requiredMessage = field => `${field} is required`;
const minMessage = min => `Must have at least ${min} characters`;
const maxMessage = max => `Cannot have more than ${max} characters`;

export const userSchema = yup.object().shape({
  email: yup
    .string(validMessage)
    .min(3, minMessage(3))
    .max(255, maxMessage(255))
    .email('Must be a valid email')
    .required(requiredMessage('Email')),
  name: yup
    .string(validMessage)
    .min(8, minMessage(8))
    .max(50, maxMessage(50))
    .required(requiredMessage('Name'))
});
