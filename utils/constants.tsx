import { ImageAsset } from "@/store/zustand";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";

export type CatType = {
  id: string;
  subtitle: string;
  icon: string;
  accent: boolean;
  label: string;
};
export const CATEGORIES: CatType[] = [
  {
    id: "date",
    label: "Date",
    subtitle: "Browse by month & year",
    icon: "calendar",
    accent: true,
  },
  {
    id: "album",
    label: "Album",
    subtitle: "Browse by photo album",
    icon: "image",
    accent: true,
  },
  {
    id: "sort",
    label: "Sort",
    subtitle: "Create albums & sort manually",
    icon: "list",
    accent: true,
  },
  {
    id: "random",
    label: "Random",
    subtitle: "Surprise shuffle through photos",
    icon: "shuffle",
    accent: false,
  },
];
export async function resizeAssets(
  assets: MediaLibrary.Asset[],
): Promise<ImageAsset[]> {
  const results = await Promise.allSettled(
    assets.map(async (info) => {
      console.log("1. starting asset:", info.id);

      const assetInfo = await MediaLibrary.getAssetInfoAsync(info.id);
      console.log("2. got assetInfo, localUri:", assetInfo.localUri);

      const uri = assetInfo.localUri ?? info.uri;
      if (!uri) throw new Error(`No URI for asset ${info.id}`);

      console.log("3. resizing:", uri);
      const resized = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1080, height: 1440 } }],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG },
      );
      console.log("4. done:", resized.uri);

      return { ...info, uri: resized.uri };
    }),
  );

  return results
    .filter((r): r is PromiseFulfilledResult<ImageAsset> => {
      if (r.status === "rejected") console.warn("asset failed:", r.reason);
      return r.status === "fulfilled";
    })
    .map((r) => r.value);
}
