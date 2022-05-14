import { Post } from "Interfaces";

export function sortByRecent(timeline: Post[], myPosts: Post[]): Post[] {
  const allPosts = [...timeline, ...myPosts];

  return allPosts.sort((a, b) => b.timestamp - a.timestamp);
}

export function sortByTrending(timeline: Post[], myPosts: Post[]): Post[] {
  const allPosts = [...timeline, ...myPosts];

  return allPosts.sort((a, b) => b.likes.length - a.likes.length);
}

export function sortByOlderFirst(timeline: Post[], myPosts: Post[]): Post[] {
  const allPosts = [...timeline, ...myPosts];

  return allPosts.sort((a, b) => a.timestamp - b.timestamp);
}
