export interface StoreReview {
  id: string;
  orderId?: string;
  userId?: string;
  userFullName?: string;
  organizationId?: string;
  organizationName?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customerName?: string;
}

export interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ReviewsStats {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution;
  positivePercentage: number;
  withCommentsCount: number;
}

export type ReviewSortOption = "newest" | "highest" | "lowest";
export type ReviewRatingFilter = "all" | 5 | 4 | 3 | 2 | 1 | "with_comment";
