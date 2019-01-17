export default function landerReducer(state = { // eslint-disable-line max-lines-per-function
  currentListIndex: 0,
}, action) {
  switch (action.type) {
    case 'LANDER_CLEAR':
      return {
        currentListIndex: 0,
      };
    case 'LANDER_LIST_INDEX':
      return {
        ...state,
        currentListIndex: action.payload,
      };
    default:
      return state;
  }
}
