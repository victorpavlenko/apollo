import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      validate: {
        validator: email => User.doesntExist({ email }),
        message: () => 'Email has already been taken.'
      }
    },
    name: {
      type: String,
      validate: {
        validator: username => User.doesntExist({ username }),
        message: () => 'Username has already been taken.'
      }
    }
  },
  {
    timestamps: true
  }
);

userSchema.statics.doesntExist = async function(options) {
  return (await this.where(options).countDocuments()) === 0;
};

const User = model('User', userSchema);

export default User;
