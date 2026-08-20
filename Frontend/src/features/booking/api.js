import { apiFetch } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../shared/config/api';

export async function getBookingsByUserId() {
  return apiFetch(API_ENDPOINTS.booking, 'getallbyuserid');
}

export async function getAll() {
  return apiFetch(API_ENDPOINTS.booking, 'getall');
}

export const createBooking = (payload) => {
  return apiFetch(API_ENDPOINTS.booking, 'booking', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
