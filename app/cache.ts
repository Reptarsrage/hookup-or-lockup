import { LRUCache } from "lru-cache";

const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 5,
});

export default cache;
