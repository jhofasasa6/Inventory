import {
  GET_ITEMS_PRESENTATION,
  ADD_ITEM_PRESENTATION,
  DELETE_ITEM_PRESENTATION
} from "../actions/types";

const initialState = {
  items: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ITEMS_PRESENTATION:
      return {
        ...state,
        items: action.payload
      };
    case ADD_ITEM_PRESENTATION:
      return {
        ...state,
        items: [action.payload, ...state.items]
      };
    case DELETE_ITEM_PRESENTATION:
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };
    default:
      return state;
  }
}
