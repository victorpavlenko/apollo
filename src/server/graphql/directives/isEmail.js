import Joi from 'joi'
import { UserInputError } from 'apollo-server-express'
import { SchemaDirectiveVisitor } from 'graphql-tools'
import { defaultFieldResolver } from 'graphql';


const validation = (validate) => {
  return class EmailDirective extends SchemaDirectiveVisitor {
    visitInputFieldDefinition(field) {
      const { resolve = defaultFieldResolver } = field;

      field.resolve = async (source, args, context, info) => {
        const value = source[field.name];

        const errorMessage = await validate(value);
        if (errorMessage) {
          throw new UserInputError(errorMessage, {
            fields: [field.name],
          })
        }

        return resolve.apply(this, source, args, context, info);
      };

      return field
    }
  }
}

export const isEmail = validation(async (value) => {
  const { error, errors } = Joi.string().email().validate(value)
  if (error || errors) return "Invalid Email"
  return
})
