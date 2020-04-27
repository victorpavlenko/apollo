import { User } from '../../models';
import { ApolloError } from 'apollo-server-express'


export default {
  Query: {
    users: async (root, args, context, info) => {
      try{
        const user = await User.find({}).limit(args.limit).skip(args.skip);
        return user
      } catch (e) {
        throw new ApolloError('An error occured during loading users', e)
      }
    },
    user: async (root, args, context, info) => {
      try{
        let user = await User.findById(args.id);
        return user
      } catch (e) {
        throw new ApolloError('An error occured during loading user', e)
      }
    }
  },
  Mutation: {
    createUser: async (root, { input }, context, info) => {
      try{
        let user = await User.create(input);
        return user
      } catch (e) {
        throw new ApolloError('An error occured during create user', e)
      }
    },
    deleteUser: async (root, { id }, context, info) => {
      try{
        let user = await User.findByIdAndRemove({ _id: id });
        return user
      } catch (e) {
        throw new ApolloError('An error occured during delete user', e)
      }
    },
    updateUser: async (root, { id, input }, context, info) => {
      try{
        const user = await User.findOneAndUpdate({ _id: id }, input, { new: true });
        return user
      } catch (e) {
        throw new ApolloError('An error occured during update user', e)
      }
    }
  }
};
