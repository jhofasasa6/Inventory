import {
  GET_ITEMS_CATEGORY,
  ADD_ITEM_CATEGORY,
  DELETE_ITEM_CATEGORY
} from "../actions/types";

const initialState = {
  items: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ITEMS_CATEGORY:
      return {
        ...state,
        items: action.payload
      };
    case ADD_ITEM_CATEGORY:
      return {
        ...state,
        items: [action.payload, ...state.items]
      };
    case DELETE_ITEM_CATEGORY:
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };
    default:
      return state;
  }
}
