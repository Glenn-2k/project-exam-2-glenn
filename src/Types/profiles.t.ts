interface UserProfileResponse {
  data: {
    name: string;
    email: string;
    bio: string;
    avatar: {
      url: string;
      alt: string;
    } | null;
    banner: {
      url: string;
      alt: string;
    } | null;
    venueManager: boolean;
    _count: {
      venues: number;
      bookings: number;
    };
  };
  meta: Record<string, unknown>;
}

export type { UserProfileResponse };
