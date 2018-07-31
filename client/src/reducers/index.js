import { combineReducers } from "redux";
import presentationReducer from "./presentationReducer";
import categoryReducer from "./categoryReducer";
import productReducer from "./productReducer";
import auth from "./auth";

export default combineReducers({
  item: presentationReducer,
  auth: auth,
  category: categoryReducer,
  product: productReducer
});
