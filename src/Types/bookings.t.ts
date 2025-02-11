interface BookingResponse {
  data: Array<{
    id: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    created: string;
    updated: string;
    venue: { name: string; media: Array<{ url: string; alt: string }> };
  }>;
  meta: {
    isFirstPage: boolean;
    isLastPage: boolean;
    currentPage: number;
    previousPage: number | null;
    nextPage: number | null;
    pageCount: number;
    totalCount: number;
  };
}

export type { BookingResponse };
