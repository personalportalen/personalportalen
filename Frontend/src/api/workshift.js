import { apiFetch, WORKSHIFT_API_URL } from "./config";

export const getWorkshifts = () => {
  return apiFetch(WORKSHIFT_API_URL, "getall");
};

export const getWorkshift = (workshiftId) => {
  console.log("workshiftId", workshiftId);
  return apiFetch(WORKSHIFT_API_URL, workshiftId);
};

export const createWorkshift = ({ payload }) => {
  return apiFetch(WORKSHIFT_API_URL, "create", payload);
};

export const updateWorkshift = (payload, id) => {
  console.log("id", id);
  return apiFetch(WORKSHIFT_API_URL, id, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteWorkshift = (payload) => {
  return apiFetch(WORKSHIFT_API_URL, "delete", payload);
};
