import { GET_INVOICES, ADD_INVOICE } from "../actions/types";

const initialState = {
  items: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_INVOICES:
      return {
        ...state,
        items: action.payload
      };
    case ADD_INVOICE:
      return {
        ...state,
        items: [action.payload, ...state.items]
      };
    default:
      return state;
  }
}
