import userMutations from './mutations/user';
import userQueries from './queries/user';

export default {
  mutations: {
    ...userMutations
  },
  queries: {
    ...userQueries
  }
}