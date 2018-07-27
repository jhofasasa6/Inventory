import axios from "axios";
import {
  GET_ITEMS,
  ADD_ITEM,
  DELETE_ITEM,
  UPDATE_ITEM
} from "./types";

export const getItems = resource => dispatch => {
  axios.get(resource).then(res =>    
    dispatch({
      type: GET_ITEMS,
      payload: res.data
    })
  );
};
export const addItem = (item, resource) => dispatch => {
  axios.post(resource, item).then(res =>
    dispatch({
      type: ADD_ITEM,
      payload: res.data
    })
  );
};
export const updateItem = (_id, item, resource) => dispatch => {
  axios.put(`${resource}/${_id}`, item).then(res =>
    dispatch({
      type: UPDATE_ITEM,
      payload: res.data
    })
  );
};
export const deleteItem = (id, resource) => dispatch => {
  axios.delete(`${resource}/${id}`).then(res =>
    dispatch({
      type: DELETE_ITEM,
      payload: id
    })
  );
};


