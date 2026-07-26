export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  profileImage: string | null;
  language: string;
  status: string;
  orderUpdatesEnabled: boolean;
  marketingNotificationsEnabled: boolean;
  roles: string[];
  createdAt: string;
};

export type AuthResult = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
};
