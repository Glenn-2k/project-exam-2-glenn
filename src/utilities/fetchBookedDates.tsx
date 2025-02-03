import { bookingsUrl } from "./constants";
import { fetchFn } from "./http";

interface Booking {
  venueId: string;
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
  const venueBookingsUrl = `${bookingsUrl}`;

  try {
    console.log("🔍 Fetching bookings for venue:", venueId);
    console.log("🌍 API Request URL:", venueBookingsUrl);

    const response = await fetchFn({
      queryKey: [venueBookingsUrl, "GET"],
    });

    console.log("📦 Raw API response:", response);

    if (!response?.data || !Array.isArray(response.data)) {
      console.warn("⚠️ No valid booking data received");
      return [];
    }

    // ✅ **Filter bookings only for this venue**
    const venueBookings = response.data.filter(
      (booking: Booking) => booking.venueId === venueId
    );

    console.log("🏨 Filtered bookings for venue:", venueId, venueBookings);

    // Convert API dates to local Date objects and format properly
    const dateIntervals: DateInterval[] = venueBookings
      .map((booking: Booking) => {
        const start = new Date(booking.dateFrom);
        const end = new Date(booking.dateTo);

        // Validate date objects before setting time
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.warn("❌ Invalid date detected:", { booking });
          return null;
        }

        console.log("✅ Valid Booking Found:", booking);

        // Set hours to full-day exclusion
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return { start, end };
      })
      .filter(Boolean); // Remove null values

    console.log("✅ Final Processed Booked Date Intervals:", dateIntervals);
    return dateIntervals;
  } catch (error) {
    console.error("❌ Error fetching booked dates:", error);
    return [];
  }
};
