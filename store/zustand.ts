import { resizeAssets } from "@/utils/constants";
import * as MediaLibrary from "expo-media-library";
import { create } from "zustand";
// Define a proper type based on what MediaLibrary returns

export type ImageAsset = MediaLibrary.AssetInfo & { uri: string };

export type ImageState = {
  curImage: ImageAsset | null;
  setCurImage: (img: ImageAsset | null) => void;
  images: ImageAsset[];
  appendImages: (newImages: ImageAsset[]) => void;
  removeImage: (index: number) => void;
  clearImages: () => void;
  trimImages: (curIndex: number) => void;
  deleteImages: (imgs: ImageAsset[]) => void;
  deletedImages: ImageAsset[];
};

export const useImage = create<ImageState>((set) => ({
  curImage: null,
  setCurImage: (newImage) => set({ curImage: newImage }),
  images: [],
  appendImages: (newImages) =>
    set((state) => {
      const combined = [...state.images, ...newImages];
      return { images: combined.slice(-50) };
    }),
  removeImage: (index: number) =>
    set((state) => {
      const newImages = [...state.images];
      if (index >= 0 && index < newImages.length) newImages.splice(index, 1);
      return { images: newImages };
    }),
  clearImages: () => set({ images: [], curImage: null }),
  trimImages: (curIdx: number) =>
    set((state) => ({ images: state.images.slice(curIdx) })),
  deleteImages: (imgs: ImageAsset[]) => {
    set({ deletedImages: [...imgs] });
  },
  deletedImages: [],
}));

type DefaultFeedState = {
  endCursor: string | null;
  hasMore: boolean;
  isFetching: boolean;
  fetchPhotos: (options?: Partial<MediaLibrary.AssetsOptions>) => Promise<void>;
  reset: () => void;
};

type AlbumState = {
  photos: MediaLibrary.Asset[];
  fetchAlbumPhotos: (albumId: string) => Promise<void>;
  albums: MediaLibrary.Album[];
  fetchAlbums: () => Promise<void>;
};

export const useAlbumFeed = create<AlbumState>((set, get) => ({
  photos: [],
  albums: [],
  fetchAlbums: async () => {
    if (get().albums.length > 0) return;
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") return;

    // Fetch all albums, including smart albums (like Camera Roll)
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    const allAlbums = await Promise.all(
      fetchedAlbums?.map(async (abm) => {
        const asset = await MediaLibrary.getAssetsAsync({
          album: abm,
          first: 1,
          resolveWithFullInfo: true,
          mediaType: ["photo"],
        });
        console.log(abm, asset, "###################");
        return { ...abm, firstPhoto: await resizeAssets(asset.assets) };
      }) || [],
    );

    set({ albums: allAlbums });
  },
  fetchAlbumPhotos: async (albumId: string) => {
    useImage.getState().clearImages();
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") return;
    const { endCursor } = useDefaultFeed.getState();
    // 2. Fetch assets from the specific album ID
    const fetchedAssets = await MediaLibrary.getAssetsAsync({
      album: albumId, // Pass the ID here
      first: 20, // Limit the number of photos
      after: endCursor ?? undefined,
      mediaType: [MediaLibrary.MediaType.photo],
    });
    if (fetchedAssets.assets?.length < 20) {
      useDefaultFeed.setState({ hasMore: false });
    } else {
      useDefaultFeed.setState({ hasMore: true });
    }
    useDefaultFeed.setState({
      endCursor: fetchedAssets.endCursor,
      hasMore: fetchedAssets.hasNextPage,
    });

    useImage.getState().appendImages(await resizeAssets(fetchedAssets.assets));
    set({ photos: await resizeAssets(fetchedAssets.assets) });
  },
}));

export const useDefaultFeed = create<DefaultFeedState>((set, get) => ({
  endCursor: null,
  hasMore: true,
  isFetching: false,

  reset: () => set({ endCursor: null, hasMore: true, isFetching: false }),

  fetchPhotos: async (options = {}) => {
    if (get().isFetching || !get().hasMore) return;
    set({ isFetching: true });

    try {
      const { endCursor } = get();
      const result = await MediaLibrary.getAssetsAsync({
        first: 10,
        after: endCursor ?? undefined,
        mediaType: ["photo"],
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        ...options,
      });

      const formatted = await resizeAssets(result.assets);
      useImage.getState().appendImages(formatted);
      set({ endCursor: result.endCursor, hasMore: result.hasNextPage });
    } finally {
      set({ isFetching: false });
    }
  },
}));

type RandomFeedState = {
  isFetching: boolean;
  seenOffsets: Set<number>;
  fetchRandom: (batchSize?: number) => Promise<void>;
  reset: () => void;
};

export const useRandomFeed = create<RandomFeedState>((set, get) => ({
  isFetching: false,
  seenOffsets: new Set(),

  reset: () => set({ isFetching: false, seenOffsets: new Set() }),

  fetchRandom: async (batchSize = 10) => {
    useImage.getState().clearImages();
    if (get().isFetching) return;
    set({ isFetching: true });

    try {
      // Fetch all IDs in one go (lightweight, no URIs)
      const { endCursor } = useDefaultFeed.getState();
      const assets = await MediaLibrary.getAssetsAsync({
        first: 500,
        after: endCursor ?? undefined,
        mediaType: ["photo"],
      });

      const { seenOffsets } = get();
      const unseen = assets.assets.filter((_, i) => !seenOffsets.has(i));
      const picks = unseen.sort(() => Math.random() - 0.5).slice(0, batchSize);
      const newSeen = new Set([...seenOffsets, ...picks.map((_, i) => i)]);
      set({ seenOffsets: newSeen });

      const formatted = await resizeAssets(picks);
      useDefaultFeed.setState({
        endCursor: assets.endCursor,
        hasMore: assets.hasNextPage,
      });
      useImage.getState().appendImages(formatted);
    } finally {
      set({ isFetching: false });
    }
  },
}));
