import { post as abandonAdultingClub } from "./abandon-adulting-club/post";

// Every published post, newest first. This is the whole "database": the
// index, the feed and the blog's JSON-LD read this list, and a new post is
// added by importing its post.ts and putting it at the top.
export const posts = [abandonAdultingClub];
