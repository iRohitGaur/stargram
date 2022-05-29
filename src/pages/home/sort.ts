import { Post } from "Interfaces";

export function sortByRecent(timeline: Post[]): Post[] {
  const allPosts = [...timeline];

  return allPosts.sort((a, b) => b.timestamp - a.timestamp);
}

export function sortByTrending(timeline: Post[]): Post[] {
  const allPosts = [...timeline];

  return allPosts.sort((a, b) => b.likes.length - a.likes.length);
}

export function sortByOlderFirst(timeline: Post[]): Post[] {
  const allPosts = [...timeline];

  return allPosts.sort((a, b) => a.timestamp - b.timestamp);
}
