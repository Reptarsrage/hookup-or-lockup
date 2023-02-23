import Axios from "axios";
import type { AxiosInstance } from "axios";
import invariant from "tiny-invariant";

// Wordpress API responses
interface WordpressHTMLContent {
  rendered: string;
  protected?: boolean;
}

interface WordpressPost {
  id: number;
  status: "publish" | "future" | "draft" | "pending" | "private";
  type: string;
  title: WordpressHTMLContent;
  content: WordpressHTMLContent;
  excerpt: WordpressHTMLContent;
  featured_media: number;
  categories: number[];
}

interface WordpressMedia {
  id: number;
  post: number;
  source_url: string;
}

// App API responses
export interface Post {
  id: number;
  title: string;
  description: string;
  imageId: number;
  lockedUp: boolean;
}

export interface Posts {
  total: number;
  totalPages: number;
  posts: Post[];
}

export interface Media {
  id: number;
  postId: number;
  sourceUrl: string;
}

const JAIL_CATEGORY = 2;

// Shared Axios instance
let instance: AxiosInstance;
function getInstance() {
  if (instance) {
    return instance;
  }

  instance = Axios.create({ baseURL: process.env.API_BASE_URL });
  return instance;
}

// see: https://developer.wordpress.org/rest-api/reference/posts/#list-posts
export async function fetchPosts(
  page: number = 1,
  perPage: number = 10
): Promise<Posts> {
  const axios = getInstance();

  const url = "/stage/wp-json/wp/v2/posts";
  const params = new URLSearchParams();
  params.set("status", "publish");
  params.set("page", page.toString());
  params.set("per_page", perPage.toString());
  params.set("orderby", "title");
  params.set("order", "asc");

  const response = await axios.get<WordpressPost[]>(
    `${url}?${params.toString()}`
  );

  const posts = response.data.map(
    ({ id, title, content, featured_media, categories }) => ({
      id,
      title: title.rendered,
      description: content.rendered,
      imageId: featured_media,
      lockedUp: categories.includes(JAIL_CATEGORY),
    })
  );

  const headersTotal = response.headers["x-wp-total"];
  const headersTotalPages = response.headers["x-wp-totalpages"];

  invariant(headersTotal, "Missing header: x-wp-total");
  invariant(headersTotalPages, "Missing header: x-wp-totalpages");

  const total = parseInt(headersTotal, 10);
  const totalPages = parseInt(headersTotalPages, 10);
  return { total, totalPages, posts };
}

// see: https://developer.wordpress.org/rest-api/reference/media/#list-media
export async function fetchMedias(mediaIds: number[]): Promise<Media[]> {
  const axios = getInstance();

  const url = "/stage/wp-json/wp/v2/media";
  const params = new URLSearchParams();
  params.set("page", "1");
  params.set("per_page", mediaIds.length.toString());
  params.set("include", mediaIds.join(","));

  const response = await axios.get<WordpressMedia[]>(
    `${url}?${params.toString()}`
  );
  return response.data.map(({ id, post, source_url }) => ({
    id,
    postId: post,
    sourceUrl: source_url,
  }));
}
