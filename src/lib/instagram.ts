/**
 * Instagram Graph API client stub.
 * TODO: Implement OAuth flow and metric fetching via the Instagram Basic Display API
 * and Graph API (for Business/Creator accounts).
 */

export interface InstagramProfile {
  id: string
  username: string
  name: string
  biography: string
  followers_count: number
  follows_count: number
  media_count: number
  profile_picture_url: string
  website: string
}

export interface InstagramMediaInsights {
  reach: number
  impressions: number
  engagement: number
  saved: number
}

/**
 * Fetches the Instagram profile for a given user access token.
 * TODO: Replace stub with real API call.
 */
export async function getInstagramProfile(
  accessToken: string
): Promise<InstagramProfile | null> {
  // TODO: GET https://graph.instagram.com/me?fields=id,username,name,biography,...
  void accessToken
  return null
}

/**
 * Fetches recent media insights for a creator.
 * TODO: Replace stub with real API call.
 */
export async function getMediaInsights(
  mediaId: string,
  accessToken: string
): Promise<InstagramMediaInsights | null> {
  // TODO: GET https://graph.instagram.com/{media-id}/insights?metric=reach,impressions,...
  void mediaId
  void accessToken
  return null
}

/**
 * Exchanges an auth code for a long-lived access token.
 * TODO: Implement the OAuth token exchange flow.
 */
export async function exchangeCodeForToken(code: string): Promise<string | null> {
  // TODO: POST https://api.instagram.com/oauth/access_token
  void code
  return null
}
