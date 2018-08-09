import { GET_CUSTOMERS, ADD_CUSTOMER, DELETE_CUSTOMER } from "../actions/types";

const initialState = {
  customers: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload
      };
    case ADD_CUSTOMER:
      return {
        ...state,
        customers: [action.payload, ...state.customers]
      };
    case DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(customer => customer._id !== action.payload)
      };
    default:
      return state;
  }
}
