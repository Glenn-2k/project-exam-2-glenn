import { bookingsUrl } from "./constants";
import { fetchFn } from "./http";

interface BookingResponse {
  data: Array<{
    dateFrom: string;
    dateTo: string;
  }>;
}

export const fetchBookedDates = async (venueId: string) => {
  const venueBookingsUrl = `${bookingsUrl}?_venue=${venueId}`;

  try {
    const response = (await fetchFn({
      queryKey: [venueBookingsUrl, venueId],
    })) as BookingResponse;

    if (!response || !response.data) {
      console.warn("No booking data received");
      return [];
    }

    const dateIntervals = response.data.map((booking) => {
      const start = new Date(booking.dateFrom);
      const end = new Date(booking.dateTo);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      return { start, end };
    });

    console.log("Processed date intervals:", dateIntervals);
    return dateIntervals;
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    return [];
  }
};
