export interface LINEPage {
  pageId: string;
  pageType: string;
  modules: Module[];
  data: PageData;
  shareProperties: ShareProperties;
}

interface Module {
  id: string;
  type: string;
  name: string;
  source: string;
  inStreamInventoryKey?: InStreamInventoryKey;
  enableSubscribe?: boolean;
  enableCp?: boolean;
  subscribable?: boolean;
  adRatio?: AdRatio;
  lazyLoadingOn?: boolean;
  lazyLoadingBuffer?: number;
  startDateTime?: number;
  endDateTime?: number;
  metaData?: MetaData;
  gptInventoryKey?: string;
  lapInventoryKey?: string;
  lapRsid?: string;
  gfpInventoryKey?: string;
  adId?: string;
  lapCtid?: string;
  adModuleType?: string;
  containerStyle?: string;
  header?: Header;
  showDuration?: boolean;
  order?: string;
  adModule?: AdModule;
  adStartPosition?: number;
  adOffset?: number;
  maxAdCount?: number;
  style?: string;
  searchTarget?: string;
  listings?: Listing[];
  showPublisher?: boolean;
  showPlayCount?: boolean;
  tabs?: string[];
  actions?: string[];
  sns?: string[];
}

interface InStreamInventoryKey {
  keyType: string;
  value: string;
}

interface AdRatio {
  gpt: number;
  lap: number;
  gfp: number;
}

interface MetaData {
  isDesktopOn: string;
}

interface Header {
  title: string;
  hasCompositeTitle: boolean;
  subTitle: string;
}

interface AdModule {
  id: string;
  type: string;
  name: string;
  source: string;
  adRatio: AdRatio;
  lazyLoadingOn: boolean;
  lazyLoadingBuffer: number;
  startDateTime: number;
  endDateTime: number;
  metaData: MetaData;
  gptInventoryKey: string;
  lapInventoryKey: string;
  lapRsid: string;
  gfpInventoryKey: string;
  adId: string;
  lapCtid: string;
  adModuleType: string;
}

interface Listing {
  id: string;
  offset: number;
  length: number;
  target: string;
  urlPath: string;
  params: Params;
}

interface Params {
  excludeNoThumbnail: number;
  containMainSnapshot: number;
  articleId: string;
}

interface PageData {
  id: string;
  title: string;
  publisher: string;
  publisherId: string;
  publishTimeUnix: number;
  contentType: string;
  thumbnail: Thumbnail;
  url: Url;
  categoryId: number;
  categoryName: string;
  media: Media;
  shortDescription: string;
  categoryPageUrlPath: string;
  categoryPageLink: CategoryPageLink;
  playCount: number;
  language: string;
  content: string;
  publishTime: string;
  updateTimeUnix: number;
  displayStatus: string;
  commentSetting: string;
  movie: Movie;
  exploreLinks: ExploreLink[];
  brandSafetyCategories: any[];
  publisherBlockAds: boolean;
  aiTags: string;
}

interface Thumbnail {
  type: string;
  hash: string;
}

interface Url {
  hash: string;
  url: string;
}

interface Media {
  type: string;
  hash: string;
  thumbnailHash: string;
  profile: string;
  duration: number;
  width: number;
  height: number;
  meta: Meta;
}

interface Meta {
  SOURCE_LINK_TYPE: string;
  MOVIE_ARTICLE_HASH: string;
}

interface Movie {
  id: string;
  title: string;
  articleId: number;
  articleHash: string;
}

interface ExploreLink {
  name: string;
  pageLink: PageLink;
  tagType: string | null;
}

interface PageLink {
  pageType: string;
  tag?: string;
  hash?: string;
  id?: string;
  urlPath?: string;
  type?: string;
}

interface ShareProperties {
  title: string;
  image: Image;
  allowSEO: boolean;
}

interface Image {
  hash: string;
}

interface CategoryPageLink {
  pageType: string;
  page: {
    id: string;
    urlPath: string;
    type: string;
  };
}
