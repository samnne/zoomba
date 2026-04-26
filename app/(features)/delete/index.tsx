import { useImage } from "@/store/zustand";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const Delete = () => {
  const { deletedImages, deleteImages } = useImage();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (deletedImages.length === 0) return;

    Alert.alert(
      "Delete Images",
      `Are you sure you want to delete ${deletedImages.length} image(s)? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);

              const ids = deletedImages.map((img) => img.id);

              await MediaLibrary.deleteAssetsAsync(ids);

              deleteImages([]); // clear deleted list
              //   clearImages(); // optional: clear main images

              Alert.alert("Success", "Images deleted successfully.");
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to delete images.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }) => (
    <Image source={{ uri: item.uri }} style={styles.image} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Preview</Text>

      {deletedImages.length === 0 ? (
        <Text style={styles.emptyText}>No images selected.</Text>
      ) : (
        <>
          <FlatList
            data={deletedImages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={3}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancel]}
              onPress={() => deleteImages([])}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.delete]}
              onPress={handleConfirmDelete}
              disabled={isDeleting}
            >
              <Text style={styles.buttonText}>
                {isDeleting ? "Deleting..." : "Delete All"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default Delete;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 50,
  },
  image: {
    width: "32%",
    aspectRatio: 1,
    margin: "1%",
    borderRadius: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancel: {
    backgroundColor: "#444",
  },
  delete: {
    backgroundColor: "#ff3b30",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
