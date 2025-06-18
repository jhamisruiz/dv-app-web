
export interface FinderCacheStore {
  id: string;
  key: string;
  data: any;
}

export interface CacheState {
  finder: FinderCacheStore[];
}
