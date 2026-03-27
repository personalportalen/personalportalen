import { API_ENDPOINTS } from "../../services/config";
import { apiFetch } from "../../services/apiClient";

export const getWorkshifts = () => {
  return apiFetch(API_ENDPOINTS.workshift, "getall");
};

export const getWorkshift = (workshiftId) => {
  console.log("workshiftId", workshiftId);
  return apiFetch(API_ENDPOINTS.workshift, workshiftId);
};

export const createWorkshift = ({ payload }) => {
  return apiFetch(API_ENDPOINTS.workshift, "create", payload);
};

export const updateWorkshift = (payload, id) => {
  console.log("id", id);
  return apiFetch(API_ENDPOINTS.workshift, id, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteWorkshift = (payload) => {
  return apiFetch(API_ENDPOINTS.workshift, "delete", payload);
};
