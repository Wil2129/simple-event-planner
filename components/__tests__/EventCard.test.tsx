import { render, screen, fireEvent } from "@testing-library/react-native";
import { EventCard } from "../EventCard";
import { UpcomingEvent, User } from "@/utils/types";
import { useAppState, useEventBookingsCount } from "@/hooks/useAppState"; // We will mock this
import { useColorScheme } from "@/hooks/useColorScheme"; // We will mock this

// --- Mocks ---
// Mock useAppState hook
jest.mock("@/hooks/useAppState");
const mockUseAppState = useAppState as jest.MockedFunction<typeof useAppState>;
const mockUseBookingsCount = useEventBookingsCount as jest.MockedFunction<typeof useEventBookingsCount>;

// Mock useColorScheme hook
jest.mock("@/hooks/useColorScheme");
const mockUseColorScheme = useColorScheme as jest.MockedFunction<
  typeof useColorScheme
>;

// Mock expo-font to prevent icon errors in tests
jest.mock("expo-font", () => ({
  useFonts: jest.fn().mockReturnValue([true]), // Mock that fonts are loaded
  isLoaded: jest.fn().mockReturnValue(true),
  loadAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock expo-router
jest.mock("expo-router", () => {
  const React = require("react");
  return {
    Link: jest.fn(({ children, ...props }) =>
      React.cloneElement(children, props)
    ),
    useLocalSearchParams: jest.fn(),
    router: {
      navigate: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      canGoBack: jest.fn(() => true),
      setParams: jest.fn(),
      dismissTo: jest.fn(), // Make sure this is included
    },
  };
});

// Mock icons
jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: "Icon", // Simple string mock
}));
// --- End Mocks ---

const mockEvent: UpcomingEvent = {
  id: "evt1",
  title: "Sample Tech Talk",
  description: "A talk about cool tech.",
  dateTime: new Date("2025-12-15T18:00:00Z"),
  location: "Online",
  capacity: 50,
  category: "webinar",
  imageUrl: "https://example.com/image.jpg",
};

const mockClientUser: User = {
  id: "usr1",
  name: "Test User",
  email: "test@test.com",
  role: "client",
};
const mockGuestUser: User = {
  id: "usr0",
  name: "Guest",
  email: "guest@local",
  role: "guest",
};

const mockBookEvent = jest.fn();
const mockCancelBooking = jest.fn();

describe("<EventCard />", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue("light"); // Default color scheme
    // Default state mock - client user, not booked, event available
    mockUseBookingsCount.mockReturnValue(0); // No bookings by default
    mockUseAppState.mockReturnValue({
      user: mockClientUser,
      events: [mockEvent],
      bookings: [],
      bookEvent: mockBookEvent,
      cancelBooking: mockCancelBooking,
      isLoading: false,
      isUserLoading: false,
      isEventsLoading: false,
      isBookingsLoading: false,
      error: undefined,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      continueAsGuest: jest.fn(),
      reset: jest.fn(),
      createEvent: jest.fn(),
      editEvent: jest.fn(),
      deleteEvent: jest.fn(),
      users: [],
    });
  });

  it("renders event details correctly", () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText(mockEvent.title)).toBeTruthy();
    expect(screen.getByText(mockEvent.description)).toBeTruthy();
    expect(screen.getByText(mockEvent.location)).toBeTruthy();
    expect(screen.getByText("webinar", { exact: false })).toBeTruthy(); // Category chip
    // Check for formatted date/time (adjust format based on your implementation)
    expect(screen.getByText(/15\/12\/2025/)).toBeTruthy(); // Date part
    expect(screen.getByText(/19:00/i)).toBeTruthy(); // Time part (adjust regex as needed)
    // Capacity check (e.g., "50/50 spots left")
    expect(screen.getByText(/50\/50 spots left/i)).toBeTruthy();
  });

  it('shows "Book Now" button for available event and logged-in client', () => {
    render(<EventCard event={mockEvent} />);
    const button = screen.getByRole("button", { name: /Book Now/i });
    expect(button).toBeTruthy();
    expect(button).not.toBeDisabled();
  });

  it('calls bookEvent when "Book Now" is pressed', () => {
    render(<EventCard event={mockEvent} />);
    const button = screen.getByRole("button", { name: /Book Now/i });
    fireEvent.press(button);
    expect(mockBookEvent).toHaveBeenCalledTimes(1);
    expect(mockBookEvent).toHaveBeenCalledWith({
      eventId: mockEvent.id,
      userId: mockClientUser.id,
    });
    expect(mockCancelBooking).not.toHaveBeenCalled();
  });

  it('shows "Booked" button for a booked event', () => {
    // Override mock state for this test
    mockUseAppState.mockReturnValue({
      ...useAppState(), // Spread previous default mock
      bookings: [
        {
          eventId: mockEvent.id,
          userId: mockClientUser.id,
          dateTime: new Date(),
        },
      ],
    });
    render(<EventCard event={mockEvent} />);
    const button = screen.getByRole("button", { name: /Booked/i });
    expect(button).toBeTruthy();
    // Button might still be enabled to allow cancellation
  });

  it('calls cancelBooking when "Booked" button is pressed', () => {
    mockUseAppState.mockReturnValue({
      ...useAppState(),
      bookings: [
        {
          eventId: mockEvent.id,
          userId: mockClientUser.id,
          dateTime: new Date(),
        },
      ],
    });
    render(<EventCard event={mockEvent} />);
    const button = screen.getByRole("button", { name: /Booked/i });
    fireEvent.press(button);
    expect(mockCancelBooking).toHaveBeenCalledTimes(1);
    expect(mockCancelBooking).toHaveBeenCalledWith({
      eventId: mockEvent.id,
      userId: mockClientUser.id,
    });
    expect(mockBookEvent).not.toHaveBeenCalled();
  });

  it("does not show booking button for guest user", () => {
    mockUseAppState.mockReturnValue({
      ...useAppState(),
      user: mockGuestUser, // Set user to guest
    });
    render(<EventCard event={mockEvent} />);
    expect(screen.queryByRole("button", { name: /Book Now/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /Booked/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /Fully Booked/i })).toBeNull();
  });
});
