import { venuesUrl } from "./constants";
import { fetchFn } from "./http";

interface Booking {
  dateFrom: string;
  dateTo: string;
}

interface DateInterval {
  start: Date;
  end: Date;
}

export const fetchBookedDates = async (
  venueId: string
): Promise<DateInterval[]> => {
  const venueBookingsUrl = `${venuesUrl}/${venueId}?_bookings=true`;

  try {
    const response = await fetchFn({
      queryKey: [venueBookingsUrl, "GET"],
    });

    if (!response?.data || !response.data.bookings) {
      console.warn("No valid booking data received");
      return [];
    }

    const bookings = response.data.bookings;

    const dateIntervals: DateInterval[] = bookings
      .map((booking: Booking) => {
        const start = new Date(booking.dateFrom);
        const end = new Date(booking.dateTo);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.warn("Invalid date detected:", { booking });
          return null;
        }

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return { start, end };
      })
      .filter(Boolean);

    return dateIntervals;
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    return [];
  }
};
