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
    console.log("Fetching bookings for venue:", venueId);
    console.log("API Request URL:", venueBookingsUrl);

    const response = await fetchFn({
      queryKey: [venueBookingsUrl, "GET"],
    });

    console.log("Raw API response:", response);

    if (!response?.data || !response.data.bookings) {
      console.warn("No valid booking data received");
      return [];
    }

    // Extract only the `bookings` array from `data`
    const bookings = response.data.bookings;

    const dateIntervals: DateInterval[] = bookings
      .map((booking: Booking) => {
        const start = new Date(booking.dateFrom);
        const end = new Date(booking.dateTo);

        // Validate date objects
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.warn("Invalid date detected:", { booking });
          return null;
        }

        // Ensure full-day exclusion
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return { start, end };
      })
      .filter(Boolean); // Remove null values

    console.log("Processed booked date intervals:", dateIntervals);
    return dateIntervals;
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    return [];
  }
};
