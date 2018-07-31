import axios from "axios";
import {
  GET_ITEMS_CATEGORY,
  ADD_ITEM_CATEGORY,
  DELETE_ITEM_CATEGORY,
  UPDATE_ITEM_CATEGORY
} from "./types";

export const getItemsCategories = resource => dispatch => {
  axios.get(resource).then(res =>    
    dispatch({
      type: GET_ITEMS_CATEGORY,
      payload: res.data
    })
  );
};
export const addItem = (item, resource) => dispatch => {
  axios.post(resource, item).then(res =>
    dispatch({
      type: ADD_ITEM_CATEGORY,
      payload: res.data
    })
  );
};
export const updateItem = (_id, item, resource) => dispatch => {
  axios.put(`${resource}/${_id}`, item).then(res =>
    dispatch({
      type: UPDATE_ITEM_CATEGORY,
      payload: res.data
    })
  );
};
export const deleteItem = (id, resource) => dispatch => {
  axios.delete(`${resource}/${id}`).then(res =>
    dispatch({
      type: DELETE_ITEM_CATEGORY,
      payload: id
    })
  );
};


