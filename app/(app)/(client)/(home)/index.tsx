import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedButton } from "@/components/ThemedButton";
import { type UpcomingEvent } from "@/utils/types";
import { EventCard } from "@/components/EventCard";
import { useAppState } from "@/hooks/useAppState";
import GoToSignIn from "@/components/GoToSignIn";
import Logout from "@/components/Logout";
import Slider from "@react-native-community/slider";
import { Collapsible } from "@/components/Collapsible";
import Checkbox from "expo-checkbox";
import { capitalize } from "@/utils/utils";
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";
import { MaterialIcons } from "@expo/vector-icons";

const KEYS = ["title", "dateTime", "location", "capacity", "category"] as const;
const invalid = [Infinity, -Infinity, NaN, null, undefined];

export default function EventsScreen() {
  const [search, onSearch] = useState("");

  const { events, user } = useAppState();
  const [ids, setIds] = useState(events.map((e) => e.id));

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const renderItem = useCallback(({ item }: { item: UpcomingEvent }) => {
    return <EventCard event={item} />;
  }, []);

  const [filterVisible, setFilterVisible] = useState(false);

  const capacities = events.map((e) => e.capacity);
  const maxCapacity = Math.max(...capacities);
  const [slider, setSlider] = useState(maxCapacity);

  const categories = [
    ...new Set(
      events.map((e) => capitalize(e.category ?? "")).filter((c) => c)
    ),
  ];
  const [selectedCategories, setCategories] = useState(categories);

  const locations = [
    ...new Set(events.map((e) => e.location).filter((c) => c)),
  ];
  const [selectedLocations, setLocations] = useState(locations);

  const defaultStyles = useDefaultStyles();
  const dates = events.map((e) => e.dateTime.valueOf());
  const initialDates = [Math.min(...dates), Math.max(...dates)];
  const [dateRange, setDateRange] = useState<DateType[]>(initialDates);

  const [order, setOrder] = useState<(typeof KEYS)[number]>();
  const [sortVisible, setSortVisible] = useState(false);

  useEffect(() => {
    if (events.length > 0) {
      if (!ids.length) {
        setCategories(categories);
        setLocations(locations);
        setIds(events.map((e) => e.id));
      }
      if (invalid.includes(slider)) {
        setSlider(maxCapacity);
      }
      if (invalid.includes(Number(dateRange[0]?.valueOf()))) {
        setDateRange(initialDates);
      }
    }
  }, [events]);

  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title}>
              Upcoming Events
            </ThemedText>
            {user?.role === "guest" ? <GoToSignIn small /> : <Logout />}
          </ThemedView>
          <ThemedView style={styles.searchBar}>
            <ThemedTextInput
              onChangeText={onSearch}
              value={search}
              placeholder="Search events..."
              placeholderTextColor={colors.disabledText}
              style={{ flex: 1 }}
            />
            <ThemedButton
              icon="filter-list-alt"
              type="outlined"
              onPress={() => setFilterVisible(true)}
            />
            <ThemedButton
              icon="sort"
              type="outlined"
              onPress={() => setSortVisible(true)}
            />
          </ThemedView>
        </ThemedView>
        <FlatList
          data={events.filter(
            ({
              title,
              description,
              category,
              location,
              capacity,
              dateTime,
            }) => {
              const s = search.toLowerCase();
              return (
                (title.toLowerCase().includes(s) ||
                  description.toLowerCase().includes(s) ||
                  location.toLowerCase().includes(s) ||
                  category?.toLowerCase().includes(s)) &&
                (selectedCategories.includes(capitalize(category ?? "")) ||
                  (!category &&
                    categories.length === selectedCategories.length)) &&
                selectedLocations.includes(location) &&
                slider >= capacity &&
                dateTime.valueOf() >= Number(dateRange[0]?.valueOf()) &&
                dateTime.valueOf() <= Number(dateRange[1]?.valueOf())
              );
            }
          )}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 16, paddingBottom: 32 }}
        />
      </ThemedView>
      <Modal
        transparent={true}
        animationType="slide"
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <ThemedView style={styles.modal}>
          <ThemedView style={styles.dialog}>
            <ThemedText type="title">Filter</ThemedText>
            <ThemedView style={styles.content}>
              <Collapsible title="Date">
                <DateTimePicker
                  mode="range"
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  onChange={({ startDate, endDate }) =>
                    setDateRange([startDate, endDate])
                  }
                  styles={defaultStyles}
                />
              </Collapsible>
              <Collapsible title="Location">
                <ScrollView contentContainerStyle={styles.collapsible}>
                  {locations.map((c) => (
                    <ThemedView style={styles.picker} key={c}>
                      <Checkbox
                        value={selectedLocations.includes(c)}
                        onValueChange={(checked) => {
                          if (checked) {
                            setLocations((prev) => [...prev, c]);
                          } else {
                            setLocations((prev) =>
                              prev.filter((cat) => cat !== c)
                            );
                          }
                        }}
                      />
                      <ThemedText>{c}</ThemedText>
                    </ThemedView>
                  ))}
                </ScrollView>
              </Collapsible>
              <Collapsible title="Capacity">
                <ThemedView style={styles.slider}>
                  <Slider
                    style={{ flex: 1 }}
                    onSlidingComplete={(value) => setSlider(value)}
                    // onValueChange={(value) => setSlider(value)}
                    minimumValue={0}
                    maximumValue={maxCapacity}
                    value={slider}
                  />
                  <ThemedText style={{}}>0 - {Math.floor(slider)}</ThemedText>
                </ThemedView>
              </Collapsible>
              <Collapsible title="Category">
                <ScrollView contentContainerStyle={styles.collapsible}>
                  {categories.map((c) => (
                    <ThemedView style={styles.picker} key={c}>
                      <Checkbox
                        value={selectedCategories.includes(c)}
                        onValueChange={(checked) => {
                          if (checked) {
                            setCategories((prev) => [...prev, c]);
                          } else {
                            setCategories((prev) =>
                              prev.filter((cat) => cat !== c)
                            );
                          }
                        }}
                      />
                      <ThemedText>{c}</ThemedText>
                    </ThemedView>
                  ))}
                </ScrollView>
              </Collapsible>
            </ThemedView>
            <ThemedView style={styles.buttonContainer}>
              <ThemedButton
                title="Reset"
                onPress={() => {
                  setCategories(categories);
                  setLocations(locations);
                  setSlider(maxCapacity);
                  setDateRange(initialDates);
                  setFilterVisible(false);
                }}
                type="outlined"
                style={({ pressed }) => [
                  styles.button,
                  pressed && { backgroundColor: "lightpink" },
                ]}
                textStyle={styles.cancel}
              />
              <ThemedButton
                title="Apply"
                onPress={() => {
                  setFilterVisible(false);
                }}
                style={styles.button}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
      <Modal
        transparent={true}
        animationType="slide"
        visible={sortVisible}
        onRequestClose={() => setSortVisible(false)}
      >
        <ThemedView style={styles.modal}>
          <ThemedView style={styles.dialog}>
            <ThemedText type="title">Sort by</ThemedText>
            <ThemedView style={styles.content}>
              {[undefined, ...KEYS].map((key) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.pickerItem,
                    pressed && { backgroundColor: "#c0c0c0" },
                  ]}
                  onPress={() => {
                    setOrder(key);
                    events.sort((a, b) => {
                      if (key) {
                        const val1 = a[key] ?? Infinity;
                        const val2 = b[key] ?? Infinity;
                        return val1 < val2 ? -1 : val1 > val2 ? 1 : 0;
                      } else {
                        return 0;
                      }
                    });
                    setSortVisible(false);
                  }}
                  key={`${key}`}
                >
                  {order === key && <MaterialIcons size={18} name="check" />}
                  <ThemedText type="defaultSemiBold">
                    {capitalize(key ?? "(None)")}
                  </ThemedText>
                </Pressable>
              ))}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    marginTop: 16,
    gap: 16,
    overflow: "hidden",
  },
  header: {
    paddingBottom: 16,
    gap: 16,
    elevation: 1,
    boxShadow: "0 1px 1px #80808080",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 24,
    paddingRight: 16,
  },
  searchBar: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
  },
  modal: {
    flex: 1,
    backgroundColor: "#00000080",
  },
  dialog: {
    width: 280,
    margin: "auto",
    borderRadius: 24,
    padding: 24,
    gap: 24,
  },
  button: {
    flex: 1,
    borderColor: "crimson",
  },
  content: {
    marginTop: -16,
    maxHeight: 400,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
  },
  cancel: {
    color: "crimson",
  },
  slider: {
    flexDirection: "row",
    gap: 8,
  },
  collapsible: {
    maxHeight: 180,
    gap: 12,
  },
  picker: {
    flexDirection: "row",
    gap: 8,
  },
  pickerItem: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    padding: 8,
  },
});
