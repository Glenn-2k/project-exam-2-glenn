import { fetchFn } from "../../utilities/http";
import { bookingsUrl } from "../../utilities/constants";
import { loadLocal } from "../../utilities/localStorage";

const getBookingsByUser = async (userId: string) => {
  const storedUser = loadLocal("user");

  if (!storedUser || !storedUser.data?.name) {
    throw new Error("No user data found");
  }

  const token = loadLocal("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const url = `${bookingsUrl}${storedUser.data.name}?_bookings=true`;
  const response = await fetchFn({ queryKey: [url, userId] });
  return response.data;
};

export default getBookingsByUser;
