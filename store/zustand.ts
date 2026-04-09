import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { create } from "zustand";
// Define a proper type based on what MediaLibrary returns
type ImageAsset = MediaLibrary.AssetInfo & { uri: string };

type ImageState = {
  curImage: ImageAsset | null; // Changed from {uri: string}
  setCurImage: (img: ImageAsset | null) => void;
  images: ImageAsset[];
  endCursor: string | null;
  hasMore: boolean;
  setEndCursor: (cursor: string | null) => void;
  setHasMore: (val: boolean) => void;
  appendImages: (newImages: ImageAsset[]) => void;
  removeImage: (index: number) => void;
  fetchPhotos: () => Promise<void>;
  trimImages: (curIndex: number) => void;
};

export const useImage = create<ImageState>((set, get) => {
  let isFetching = false;

  return {
    curImage: null,
    setCurImage: (newImage) => set({ curImage: newImage }),
    images: [],
    endCursor: null,
    hasMore: true,
    setEndCursor: (cursor) => set({ endCursor: cursor }),
    setHasMore: (val) => set({ hasMore: val }),
    appendImages: (newImages) =>
      set((state) => {
        const combined = [...state.images, ...newImages];
        return {
          images: combined.slice(-50), // keep only last 100
        };
      }),
    removeImage: (index: number) =>
      set((state) => {
        const newImages = [...state.images];
        if (index >= 0 && index < newImages.length) {
          newImages.splice(index, 1);
        }
        return { images: newImages };
      }),

    fetchPhotos: async () => {
      if (isFetching) return;
      isFetching = true;

      try {
        const { endCursor, hasMore } = get();
        if (!hasMore) return;

        const albumAssets = await MediaLibrary.getAssetsAsync({
          first: 10,
          after: endCursor || undefined,
          mediaType: ["photo"],
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        });

        const formattedAssets: ImageAsset[] = await Promise.all(
          albumAssets.assets.map(async (info) => {
            const resized = await ImageManipulator.manipulateAsync(
              info.uri,
              [{ resize: { width: 800 } }],
              { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
            );

            return {
              ...info,
              uri: resized.uri,
            };
          }),
        );

        get().appendImages(formattedAssets);
        get().setEndCursor(albumAssets.endCursor);
        get().setHasMore(albumAssets.hasNextPage);
      } finally {
        isFetching = false;
      }
    },
    trimImages: (curIdx: number) =>
      set((state) => ({
        images: state.images.slice(curIdx),
      })),
  };
});
