import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useContext, useState } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import { EventsContext } from "@/features/events/eventsContext";
import { Collapsible } from "@/components/Collapsible";
import { parse } from "@babel/core";
import { useEventBookingsCount } from "@/hooks/useAppState";

export default function EditEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { events, editEvent, isLoading, error } = useContext(EventsContext);
  const upcomingEvent = events.find((e) => e.id === id);

  const [title, setTitle] = useState(upcomingEvent?.title);
  const [description, setDescription] = useState(upcomingEvent?.description);
  const [location, setLocation] = useState(upcomingEvent?.location);
  const [capacity, setCapacity] = useState(upcomingEvent?.capacity?.toString());

  const [datetime, setDatetime] = useState(
    new Date(upcomingEvent?.dateTime ?? "")
  );
  const [showDatetimePicker, setShowDatetimePicker] = useState(false);
  const [datetimePickerMode, setDatetimePickerMode] = useState<"date" | "time">(
    "date"
  );
  const [selectedCategory, setSelectedCategory] =
    useState<EventCategory | null>(upcomingEvent?.category ?? null);
  const [image, setImage] = useState<string | null>(
    upcomingEvent?.imageUrl ?? null
  );

  const bookingsCount = useEventBookingsCount(id as string);
  const [capacityError, setError] = useState<string>();

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
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="defaultSemiBold">Event Title *</ThemedText>
        <ThemedTextInput
          placeholder="Enter event title"
          placeholderTextColor={colors.disabledText}
          style={{ flex: 1 }}
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
          style={{ flex: 1 }}
          onFocus={showDatepicker}
          value={datetime.toLocaleDateString("en-CM")}
        />
        <ThemedText type="defaultSemiBold">Time *</ThemedText>
        <ThemedTextInput
          placeholder="HH:mm"
          placeholderTextColor={colors.disabledText}
          style={{ flex: 1 }}
          onFocus={showTimepicker}
          value={datetime.toLocaleTimeString("en-CM", { timeStyle: "short" })}
        />
        <ThemedText type="defaultSemiBold">Location *</ThemedText>
        <ThemedTextInput
          placeholder="Enter event location"
          placeholderTextColor={colors.disabledText}
          style={{ flex: 1 }}
          value={location}
          onChangeText={setLocation}
        />
        <ThemedText type="defaultSemiBold">Capacity *</ThemedText>
        <ThemedTextInput
          placeholder="Number of spots"
          placeholderTextColor={colors.disabledText}
          style={{ flex: 1 }}
          keyboardType="numeric"
          value={capacity}
          error={capacityError}
          // onEndEditing={}
          onChangeText={(text) => {
            setCapacity(text);
            if (parseInt(text) < bookingsCount) {
              Keyboard.dismiss();
              setError(
                "The event capacity must be greater than the number of spots filled"
              );
              // setCapacity(upcomingEvent?.capacity?.toString() ?? "1");
            } else {
              setError(undefined);
            }
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
          title="Update Event"
          disabled={isLoading}
          icon={isLoading ? "refresh" : undefined}
          onPress={async () => {
            Keyboard.dismiss();
            try {
              console.log("update");
              console.log(
                getDiff(upcomingEvent ?? {}, {
                  id,
                  title,
                  description,
                  location,
                  capacity: parseInt(capacity ?? "0"),
                  dateTime: datetime,
                  category: selectedCategory,
                  imageUrl: image,
                })
              );
              await editEvent(
                id,
                getDiff(upcomingEvent ?? {}, {
                  id,
                  title,
                  description,
                  location,
                  capacity: parseInt(capacity ?? "0"),
                  dateTime: datetime,
                  category: selectedCategory,
                  imageUrl: image,
                })
              );
              if (!error && router.canGoBack()) {
                router.back();
              }
            } catch (e) {
              console.error(e);
            }
          }}
        />
      </ScrollView>
      {showDatetimePicker && (
        <DateTimePicker
          value={datetime}
          mode={datetimePickerMode}
          is24Hour={true}
          onChange={onChangeDatetime}
          minimumDate={new Date()}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
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

function getDiff<T extends Record<string, any>>(old: T, newObj: T): Partial<T> {
  const diff: Partial<T> = {};
  for (const oldKey in old) {
    const newVal = newObj[oldKey];
    if (old[oldKey] !== newVal) {
      diff[oldKey] = newVal;
    }
  }
  for (const newKey in newObj) {
    const newVal = newObj[newKey];
    if (old[newKey] !== newVal) {
      diff[newKey] = newVal;
    }
  }
  return diff;
}
