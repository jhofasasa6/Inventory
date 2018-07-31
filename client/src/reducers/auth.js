import { SET_CURRENT_USER } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {},
  messageError: ""
};

export default function(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CURRENT_USER:      
      return {
        isAuthenticated: action.payload.user !== undefined ? true : false,
        user: action.payload.user !== undefined ? action.payload.user : null,
        messageError:
          action.payload.message !== "" ? action.payload.message : ""
      };
    default:
      return state;
  }
}
