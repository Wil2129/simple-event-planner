import { StyleSheet, Image, type ViewProps } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { UpcomingEvent } from "@/utils/types";
import { capitalize } from "@/utils/utils";
import { useEventBookingsCount } from "@/hooks/useAppState";

export type EventDetailProps = ViewProps & {
  event: UpcomingEvent;
};

export default function EventDetail({
  event: {
    id,
    title,
    category,
    description,
    imageUrl,
    dateTime,
    location,
    capacity,
  },
  children,
  ...otherProps
}: EventDetailProps) {
  const bookingsCount = useEventBookingsCount(id);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image source={{ uri: imageUrl }} style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{title}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.detail}>
        <MaterialIcons size={18} name="event" color={colors.disabledText} />
        <ThemedText>{dateTime.toLocaleDateString("en-CM")}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.detail}>
        <MaterialIcons size={18} name="alarm" color={colors.disabledText} />
        <ThemedText>
          {dateTime.toLocaleTimeString("en-CM", { timeStyle: "short" })}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.detail}>
        <MaterialIcons
          size={18}
          name="location-pin"
          color={colors.disabledText}
        />
        <ThemedText>{location}</ThemedText>
      </ThemedView>
      <ThemedText type="subtitle">Description</ThemedText>
      <ThemedText>{description}</ThemedText>
      {category && (
        <>
          <ThemedText type="subtitle">Category</ThemedText>
          <ThemedText>{capitalize(category)}</ThemedText>
        </>
      )}
      <ThemedText type="subtitle">Capacity</ThemedText>
      <ThemedView style={styles.detail}>
        <MaterialIcons size={18} name="group" color={colors.disabledText} />
        <ThemedText>
          {bookingsCount}/{capacity} spots filled
        </ThemedText>
      </ThemedView>
      <ThemedView
        style={{
          backgroundColor: colors.disabledText,
          height: 12,
          width: "100%",
          borderRadius: 8,
        }}
      >
        <ThemedView
          style={{
            backgroundColor:
              capacity > bookingsCount
                ? bookingsCount < capacity * 0.75
                  ? "green"
                  : "orange"
                : "red",
            height: 12,
            width: `${(bookingsCount * 100) / capacity}%`,
            borderRadius: 12,
          }}
        ></ThemedView>
        <ThemedText
          style={{
            textAlign: "right",
            color: colors.disabledText,
            fontSize: 12,
            lineHeight: 16,
            height: 24,
            textAlignVertical: "top",
          }}
        >
          {capacity - bookingsCount} spots left
        </ThemedText>
      </ThemedView>
      {children}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  detail: {
    gap: 8,
    textAlignVertical: "center",
    flexDirection: "row",
    alignItems: "center",
  },
});
