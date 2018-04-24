import Types from '../../types';
const initialState = [];

export default(state = initialState, action) => {
  switch(action.type){
    case Types.PULL_MEMBERS_FROM_GITHUB: {
      const members = [].concat(action.data)
      return members;
    }
    case Types.REMOVE_GITHUB_MEMBER: {
      return state.filter(member => member != action.data);
    }
    default:
      return state;
  }
}
