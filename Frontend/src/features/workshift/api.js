import { apiFetch } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../shared/config/api';

export const getWorkshifts = () => {
  return apiFetch(API_ENDPOINTS.workshift, 'getall');
};

export const getWorkshift = (workshiftId) => {
  console.log('workshiftId', workshiftId);
  return apiFetch(API_ENDPOINTS.workshift, workshiftId);
};

export const createWorkshift = (payload) => {
  return apiFetch(API_ENDPOINTS.workshift, 'create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateWorkshift = (payload, id) => {
  const normalizedPayload = {
    ...payload,
    starttime: `${payload.starttime}:00`,
    endtime: `${payload.endtime}:00`,
  };

  console.log('payload:', normalizedPayload);

  return apiFetch(API_ENDPOINTS.workshift, id, {
    method: 'PUT',
    body: normalizedPayload,
  });
};

export const deleteWorkshift = (id) => {
  return apiFetch(API_ENDPOINTS.workshift, `${id}`, {
    method: 'DELETE',
  });
};
