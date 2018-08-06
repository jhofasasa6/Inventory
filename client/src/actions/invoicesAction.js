import axios from "axios";
import { GET_INVOICES, ADD_INVOICE } from "./types";

export const getInvoices = resource => dispatch => {
  axios.get(resource).then(res =>
    dispatch({
      type: GET_INVOICES,
      payload: res.data
    })
  );
};
export const addInvoice = (item, resource) => dispatch => {
  axios.post(resource, item).then(res =>
    dispatch({
      type: ADD_INVOICE,
      payload: res.data
    })
  );
};
