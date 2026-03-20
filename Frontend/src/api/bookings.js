import { apiFetch, BOOKING_API_URL } from "./config";

export async function getBookingsByUserId() {
  console.log("getBookings");
  return apiFetch(BOOKING_API_URL, "getallbyuserid");
}

export const createBooking = (payload) => {
  return apiFetch(BOOKING_API_URL, "create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
