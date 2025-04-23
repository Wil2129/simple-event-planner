import {
  StyleSheet,
  TouchableHighlight,
  Image,
  View,
  type TextStyle,
} from "react-native";
import { ThemedView, type ThemedViewProps } from "./ThemedView";
import { Link } from "expo-router";
import { UpcomingEvent } from "@/utils/types";
import { ThemedText } from "./ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ThemedButton } from "./ThemedButton";
import { capitalize } from "@/utils/utils";
import { useAppState } from "@/hooks/useAppState";

export type BookedEventProps = ThemedViewProps & {
  event: UpcomingEvent;
};

export default function BookedEvent({
  event: { id, title, category, description, imageUrl, dateTime, location },
}: BookedEventProps) {
  const { cancelBooking, user } = useAppState();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const detailTextStyle: TextStyle = {
    flex: 1,
    color: colors.disabledText,
    textAlignVertical: "center",
    fontSize: 14,
    lineHeight: 16,
  };

  return (
    <Link
      key={id}
      style={styles.container}
      href={{
        pathname: "/events/[id]",
        params: { id },
      }}
      asChild
    >
      <TouchableHighlight style={{ borderRadius: 8 }}>
        <ThemedView style={styles.innerContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <ThemedText style={styles.title} numberOfLines={2}>
                {title}
              </ThemedText>
              {category && (
                <ThemedText type="chip">{capitalize(category)}</ThemedText>
              )}
            </View>
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
                size={16}
                name="location-pin"
                color={colors.disabledText}
              />
              <ThemedText style={detailTextStyle}>{location}</ThemedText>
            </View>
            <ThemedText
              style={[detailTextStyle, styles.description]}
              numberOfLines={2}
            >
              {description}
            </ThemedText>
            <View style={styles.buttonContainer}>
              <ThemedButton
                icon="delete"
                style={({ pressed }) => ({
                  padding: 12,
                  backgroundColor: pressed ? "darkred" : "crimson",
                })}
                textStyle={styles.buttonText}
                onPress={() => {
                  cancelBooking({ eventId: id, userId: user?.id as string });
                }}
                // disabled={isBookingsLoading}
              />
            </View>
          </View>
        </ThemedView>
      </TouchableHighlight>
    </Link>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 24,
    elevation: 4,
    borderRadius: 8,
    boxShadow: "0 4px 4px #40404040",
  },
  innerContainer: {
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "stretch",
  },
  image: {
    width: "33%",
    height: "100%",
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: "black",
  },
  content: {
    flex: 1,
    padding: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detail: {
    gap: 8,
    textAlignVertical: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    textAlign: "justify",
    marginTop: 8,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 20,
  },
});
