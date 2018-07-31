import axios from "axios";
import {
  GET_ITEMS_PRESENTATION,
  ADD_ITEM_PRESENTATION,
  DELETE_ITEM_PRESENTATION,
  UPDATE_ITEM_PRESENTATION
} from "./types";

export const getItemsPresentations = resource => dispatch => {
  axios.get(resource).then(res =>    
    dispatch({
      type: GET_ITEMS_PRESENTATION,
      payload: res.data
    })
  );
};
export const addItem = (item, resource) => dispatch => {
  axios.post(resource, item).then(res =>
    dispatch({
      type: ADD_ITEM_PRESENTATION,
      payload: res.data
    })
  );
};
export const updateItem = (_id, item, resource) => dispatch => {
  axios.put(`${resource}/${_id}`, item).then(res =>
    dispatch({
      type: UPDATE_ITEM_PRESENTATION,
      payload: res.data
    })
  );
};
export const deleteItem = (id, resource) => dispatch => {
  axios.delete(`${resource}/${id}`).then(res =>
    dispatch({
      type: DELETE_ITEM_PRESENTATION,
      payload: id
    })
  );
};


