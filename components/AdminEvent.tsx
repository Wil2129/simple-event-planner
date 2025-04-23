import {
  StyleSheet,
  View,
  Image,
  type TextStyle,
  TouchableHighlight,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView, type ThemedViewProps } from "./ThemedView";
import { UpcomingEvent } from "@/utils/types";
import { ThemedText } from "./ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedButton } from "./ThemedButton";
import { Link } from "expo-router";
import { capitalize } from "@/utils/utils";
import { useEventBookingsCount } from "@/hooks/useAppState";
import { useContext } from "react";
import { EventsContext } from "@/features/events/eventsContext";

export type AdminEventProps = ThemedViewProps & {
  event: UpcomingEvent;
};

export function AdminEvent({
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
}: AdminEventProps) {
  const { deleteEvent } = useContext(EventsContext);

  const bookingsCount = useEventBookingsCount(id);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const detailTextStyle: TextStyle = {
    color: colors.disabledText,
    textAlignVertical: "center",
  };

  const capacityColor =
    capacity > bookingsCount
      ? bookingsCount < capacity * 0.75
        ? "green"
        : "orange"
      : "red";

  return (
    <Link
      key={id}
      style={styles.card}
      href={{
        pathname: "/admin/events/[id]",
        params: { id },
      }}
      asChild
    >
      <TouchableHighlight style={styles.border}>
        <ThemedView style={styles.border}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <ThemedText style={styles.title} numberOfLines={1}>
                {title}
              </ThemedText>
              {category && (
                <ThemedText type="chip">{capitalize(category)}</ThemedText>
              )}
            </View>
            <ThemedText
              style={[detailTextStyle, styles.description]}
              numberOfLines={2}
            >
              {description}
            </ThemedText>
            <View style={styles.detail}>
              <MaterialIcons
                size={18}
                name="calendar-today"
                color={colors.disabledText}
              />
              <ThemedText style={detailTextStyle}>
                {dateTime.toLocaleString("en-CM", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </ThemedText>
            </View>
            <View style={styles.detail}>
              <MaterialIcons
                size={18}
                name="location-pin"
                color={colors.disabledText}
              />
              <ThemedText style={detailTextStyle}>{location}</ThemedText>
            </View>
            <View style={styles.detail}>
              <MaterialIcons size={18} name="group" color={capacityColor} />
              <ThemedText style={{ color: capacityColor }}>
                {capacity - bookingsCount}/{capacity} spots left
              </ThemedText>
            </View>
            <View style={styles.footer}>
              <ThemedButton
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: pressed ? "darkred" : "crimson",
                  },
                ]}
                textStyle={styles.buttonText}
                title="Delete"
                onPress={() => {
                  deleteEvent(id);
                }}
              />
              <Link
                href={{
                  pathname: "/admin/events/[id]/edit",
                  params: { id },
                }}
                asChild
              >
                <ThemedButton
                  style={styles.button}
                  textStyle={styles.buttonText}
                  title="Edit"
                />
              </Link>
            </View>
          </View>
        </ThemedView>
      </TouchableHighlight>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 24,
    elevation: 4,
    // height: 420,
    borderRadius: 8,
    boxShadow: "0 4px 4px #40404040",
  },
  border: { borderRadius: 8 },
  image: {
    width: "100%",
    height: 160,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: "black",
  },
  content: {
    padding: 16,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    textAlign: "justify",
    marginBottom: 8,
  },
  detail: {
    gap: 8,
    textAlignVertical: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  footer: {
    marginTop: 8,
    gap: 16,
    textAlignVertical: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 8,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 20,
  },
});
