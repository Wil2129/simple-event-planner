import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useContext, useState, useCallback } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { eventCategories, type EventCategory } from "@/utils/types";
import { Picker } from "@react-native-picker/picker";
import { capitalize } from "@/utils/utils";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedButton } from "@/components/ThemedButton";
import { Collapsible } from "@/components/Collapsible";
import { EventsContext } from "@/features/events/eventsContext";
import { router } from "expo-router";

export default function CreateEventScreen() {
  const { events, createEvent, isLoading, error } = useContext(EventsContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(1);

  const [datetime, setDatetime] = useState(new Date());
  const [showDatetimePicker, setShowDatetimePicker] = useState(false);
  const [datetimePickerMode, setDatetimePickerMode] = useState<"date" | "time">(
    "date"
  );
  const [selectedCategory, setSelectedCategory] =
    useState<EventCategory | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const onChangeDatetime = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate;
    setShowDatetimePicker(false);
    if (currentDate) {
      setDatetime(currentDate);
    }
  };

  const showDatetimePickerMode = (currentMode: "date" | "time") => {
    Keyboard.dismiss();
    setShowDatetimePicker(true);
    setDatetimePickerMode(currentMode);
  };

  const showDatepicker = () => {
    showDatetimePickerMode("date");
  };

  const showTimepicker = () => {
    showDatetimePickerMode("time");
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ThemedView style={styles.flexOne}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="defaultSemiBold">Event Title *</ThemedText>
        <ThemedTextInput
          placeholder="Enter event title"
          placeholderTextColor={colors.disabledText}
          style={styles.flexOne}
          value={title}
          onChangeText={setTitle}
        />
        <ThemedText type="defaultSemiBold">Description *</ThemedText>
        <ThemedTextInput
          placeholder="Enter event description"
          placeholderTextColor={colors.disabledText}
          style={{ flex: 1 }}
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
        <ThemedText type="defaultSemiBold">Date *</ThemedText>
        <ThemedTextInput
          placeholder="dd/MM/yyyy"
          placeholderTextColor={colors.disabledText}
          style={styles.flexOne}
          onFocus={showDatepicker}
          value={datetime.toLocaleDateString("en-CM")}
        />
        <ThemedText type="defaultSemiBold">Time *</ThemedText>
        <ThemedTextInput
          placeholder="HH:mm"
          placeholderTextColor={colors.disabledText}
          style={styles.flexOne}
          onFocus={showTimepicker}
          value={datetime.toLocaleTimeString("en-CM", { timeStyle: "short" })}
        />
        <ThemedText type="defaultSemiBold">Location *</ThemedText>
        <ThemedTextInput
          placeholder="Enter event location"
          placeholderTextColor={colors.disabledText}
          style={styles.flexOne}
          value={location}
          onChangeText={setLocation}
        />
        <ThemedText type="defaultSemiBold">Capacity *</ThemedText>
        <ThemedTextInput
          placeholder="Number of spots"
          placeholderTextColor={colors.disabledText}
          style={styles.flexOne}
          keyboardType="numeric"
          value={capacity.toString()}
          onChangeText={(text) => {
            setCapacity(parseInt(text));
          }}
        />
        <Collapsible title="Advanced Options">
          <ThemedView style={styles.additional}>
            <ThemedText type="defaultSemiBold">Category</ThemedText>
            <ThemedView
              style={{
                borderColor: colors.disabledText,
                borderWidth: 1,
                borderRadius: 8,
              }}
            >
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                mode="dropdown"
              >
                {[
                  <Picker.Item
                    key="null"
                    label="Select category (optional)"
                    value={null}
                  />,
                  ...eventCategories.map((category) => (
                    <Picker.Item
                      key={category}
                      label={capitalize(category)}
                      value={category}
                    />
                  )),
                ]}
              </Picker>
            </ThemedView>
            <ThemedText type="defaultSemiBold">Image</ThemedText>
            <Pressable
              style={{
                borderColor: colors.disabledText,
                height: 120,
                borderWidth: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
                gap: 8,
              }}
              onPress={pickImage}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <>
                  <MaterialIcons
                    size={16}
                    name="image"
                    color={colors.disabledText}
                  />
                  <ThemedText>Pick image (optional)</ThemedText>
                </>
              )}
            </Pressable>
          </ThemedView>
        </Collapsible>
        <ThemedButton
          style={styles.button}
          title="Create Event"
          disabled={isLoading}
          icon={isLoading ? "refresh" : undefined}
          onPress={async () => {
            Keyboard.dismiss();
            try {
              await createEvent({
                title,
                description,
                location,
                capacity,
                dateTime: datetime,
                category: selectedCategory ?? undefined,
                imageUrl: image ?? undefined,
              });
              if (!error) {
                router.dismissTo(
                  `./${parseInt(events[events.length - 1].id) + 1}`
                );
              }
            } catch (e) {
              console.error(e);
            }
          }}
        />
      </ScrollView>
      {showDatetimePicker && (
        <DateTimePicker
          minimumDate={new Date()}
          value={datetime}
          mode={datetimePickerMode}
          is24Hour={true}
          onChange={onChangeDatetime}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  scroll: {
    gap: 8,
    padding: 24,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    marginTop: 32,
  },
  additional: {
    gap: 8,
  },
});
