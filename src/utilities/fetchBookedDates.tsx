import { bookingsUrl } from "./constants";
import { fetchFn } from "./http";

interface Booking {
  dateFrom: string;
  dateTo: string;
  venueId: string;
}

interface DateInterval {
  start: Date;
  end: Date;
}

export const fetchBookedDates = async (
  venueId: string
): Promise<DateInterval[]> => {
  const venueBookingsUrl = `${bookingsUrl}?_venue=${venueId}`;

  try {
    console.log("Fetching bookings for venue:", venueId);

    const response = await fetchFn({ queryKey: [venueBookingsUrl, "GET"] });

    console.log("Raw API response:", response);

    if (!response?.data) {
      console.warn("No booking data received");
      return [];
    }

    // Filter bookings by venueId and process valid date intervals
    const dateIntervals: DateInterval[] = response.data
      .filter(
        (booking: Booking): booking is Booking => booking.venueId === venueId
      ) // Filter out other venues
      .map((booking: Booking): DateInterval | null => {
        const start: Date = new Date(booking.dateFrom);
        const end: Date = new Date(booking.dateTo);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.warn("Invalid date found:", booking);
          return null;
        }

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return { start, end };
      })
      .filter(
        (interval: DateInterval | null): interval is DateInterval =>
          interval !== null
      ); // Remove invalid intervals

    console.log("Processed booked date intervals:", dateIntervals);
    return dateIntervals;
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    return [];
  }
};
