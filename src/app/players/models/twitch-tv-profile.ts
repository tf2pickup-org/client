export interface TwitchTvProfile {
  provider: 'twitch.tv';
  player: string;
  userId: string;
  login: string;
  displayName?: string;
  profileImageUrl?: string;
}
