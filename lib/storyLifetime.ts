export const STORY_LIFETIME_MS = 24 * 60 * 60 * 1000;
export function activeStoryWhere(now = new Date()) {
  return { published: true, createdAt: { gt: new Date(now.getTime() - STORY_LIFETIME_MS), lte: now } };
}
