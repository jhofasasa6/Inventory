import axios from "axios";
import {
  GET_CUSTOMERS,
  ADD_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER
} from "./types";

export const getCustomers = resource => dispatch => {
  axios.get(resource).then(res =>
    dispatch({
      type: GET_CUSTOMERS,
      payload: res.data
    })
  );
};
export const addCustomer = (item, resource) => dispatch => {
  axios.post(resource, item).then(res =>
    dispatch({
      type: ADD_CUSTOMER,
      payload: res.data
    })
  );
};
export const updateCustomer = (_id, item, resource) => dispatch => {
  axios.put(`${resource}/${_id}`, item).then(res =>
    dispatch({
      type: UPDATE_CUSTOMER,
      payload: res.data
    })
  );
};
export const deleteCustomer = (id, resource) => dispatch => {
  axios.delete(`${resource}/${id}`).then(res =>
    dispatch({
      type: DELETE_CUSTOMER,
      payload: id
    })
  );
};
