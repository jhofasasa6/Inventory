import {
  GET_ITEMS_PRODUCT,
  ADD_ITEM_PRODUCT,
  DELETE_ITEM_PRODUCT
} from "../actions/types";

const initialState = {
  items: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ITEMS_PRODUCT:
      return {
        ...state,
        items: action.payload
      };
    case ADD_ITEM_PRODUCT:
      return {
        ...state,
        items: [action.payload, ...state.items]
      };
    case DELETE_ITEM_PRODUCT:
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };
    default:
      return state;
  }
}
