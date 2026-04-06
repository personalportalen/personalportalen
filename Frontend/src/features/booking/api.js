import { apiFetch } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../shared/config/api';

export async function getBookingsByUserId() {
  console.log('getBookings');
  return apiFetch(API_ENDPOINTS.booking, 'getallbyuserid');
}

export const createBooking = (payload) => {
  return apiFetch(API_ENDPOINTS.booking, 'create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
