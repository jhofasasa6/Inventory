import axios from "axios";
import { SET_CURRENT_USER } from "./types";

export function login(data, resorce) {
  return dispatch => {
    return axios.post(resorce, data).then(res => {
      if (res !== null && res.data.success)
        localStorage.setItem("user", JSON.stringify(res.data.user));

      dispatch({
        type: SET_CURRENT_USER,
        payload: res.data
      });
    });
  };
}

export function logout() {
  return dispatch => {
    localStorage.removeItem("user");
    dispatch({
      type: SET_CURRENT_USER,
      payload: {
        success: false,
        message: ""
      }
    });
  };
}
