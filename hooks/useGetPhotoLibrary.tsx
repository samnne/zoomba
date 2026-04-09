
export const useGetPhotoLibrary = async (cursor = null) => {

  const getPhotos = async (cursor) => {

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      const albumAssets = await MediaLibrary.getAssetsAsync({
        first: 10,
        after: cursor,
        mediaType: ['photo'],
        sortBy: [[MediaLibrary.SortBy.creationTime, false]]
      })
      if (!albumAssets.assets) {
        return
      }
      const resolved = await Promise.all(
        albumAssets.assets.map(asset => MediaLibrary.getAssetInfoAsync(asset))
      );

      const image = resolved[0]
      return {
        fetch: getPhotos, hasMore: albumAssets.hasNextPage, endCursor: albumAssets.endCursor,
        image: { ...image, uri: image.localUri || image.uri }, images: resolved.map(res => ({ ...res, uri: res.localUri || res.uri }))
      }
    }
    return { image: null, images: null }
  }
  return await getPhotos(cursor)
}
