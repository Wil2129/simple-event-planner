# Simple Event Planning Portal (React Native / Expo)

## Objective

This application is a take-home assessment project demonstrating skills in React Native and Expo development. It provides a basic portal for administrators to manage events (Create, Read, Update, Delete) and for clients to browse, view details, and book available events.

## Features Implemented

### Core Requirements:
*   **Admin Event Management:**
    *   View list of all events.
    *   Create new events with details (title, description, date/time, location, capacity, optional category/image).
    *   Edit existing event details.
    *   Delete events.
    *   (Implicitly covered by data structure) View basic booking information per event.
*   **Client Event Listing:**
    *   Display upcoming events (title, date, time, location).
*   **Client Event Details:**
    *   View full details of a selected event.
*   **Client Event Booking:**
    *   Book available spots for an event.
    *   Handles fully booked events (disables booking).
*   **State/Data Management:** Implemented using React Context API with `useReducer` and Expo SQLite for persistence.
*   **UI/Styling:** Clean, functional UI with basic theming (Light/Dark mode support).
*   **Platform Flexibility:** Architecture separates concerns (UI, state logic, data access) allowing potential adaptation for web/mobile (primarily mobile-focused implementation).
*   **Code Quality:** TypeScript used for type safety, consistent conventions, reusable components, basic commenting.
*   **Documentation:** This README file.

### Bonus Challenges Implemented:
*   **User Authentication (Basic):** Simple email/password login (stored locally in SQLite, session in SecureStore). Differentiates between 'admin' and 'client' roles. Includes a 'Continue as Guest' option.
*   **Filtering/Sorting:** Clients can filter events by date range, location, capacity, and category. Events can be sorted by various fields.
*   **Search Functionality:** Basic text search across event title, description, location, and category on the client event list.
*   **Client Booking History:** Clients can view a list of events they have booked on the "My Bookings" tab.
*   **Data Persistence:** Uses Expo SQLite to store event, user, and booking data locally on the device. Includes basic database migration.
*   **Testing:** Basic unit tests for utility functions and reducers, and integration tests for key components (e.g., `EventCard`) using Jest and `@testing-library/react-native`.

## Setup Instructions

**Prerequisites:**
*   Node.js (LTS version recommended)
*   npm or yarn
*   Expo CLI: `npm install -g expo-cli`
*   Development Environment:
    *   Android Studio & Emulator (for Android development)
    *   Xcode & Simulator (for iOS development - macOS required)
    *   Web browser (for web development)

**Steps:**
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Wil2129/simple-event-planner.git
    cd simple-event-planner
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Prepare Development Build (if running on native device/emulator):**
    Since this project uses native modules like `expo-sqlite`, Expo Go is *not* sufficient for native development. You need a development build:
    *   Configure `eas.json` if you plan to use EAS Build, OR
    *   Build and run directly:
        ```bash
        # For Android (ensure emulator is running or device connected)
        npx expo run:android

        # For iOS (ensure simulator is running or device connected - macOS required)
        npx expo run:ios
        ```

## Running the Application

1.  **Start the Metro Bundler / Development Server:**
    ```bash
    npm start
    # or
    yarn start
    ```
2.  **Choose your platform:**
    *   **Web:** Press `w` in the terminal where Metro is running.
    *   **Android:**
        *   If you created a development build using `npx expo run:android`, it should launch automatically or you can open the installed "dev client" app on your device/emulator.
        *   If Metro is running, press `a` (only works if a compatible dev build is already installed and running).
    *   **iOS:**
        *   If you created a development build using `npx expo run:ios`, it should launch automatically or you can open the installed "dev client" app on your device/simulator.
        *   If Metro is running, press `i` (only works if a compatible dev build is already installed and running).
3.  **Authentication:**
    Authentication is not mandatory to use the application, but is required to book events.
    *   **Client:**
        *   Email: `guillaume.mpouli@kolagroup.io`
		*   Password: `password`
    *   **Admin:**
        *   Email: `teddy.baha@admin.com`
		*   Password: `password`

**Running Tests:**
```bash
npm test
# or
yarn test
```

## Architectural Decisions

*   **Framework & Routing:** Built using **Expo (React Native)** for efficient cross-platform mobile development. **Expo Router** provides file-based routing, enabling a clear separation between authentication (`/app/(auth)`), client (`/app/(app)/(client)`), and admin (`/app/(app)/admin`) sections. Nested layouts (`_layout.tsx`) manage screen structure, shared UI, and authentication/role checks.
*   **State Management:** Leverages **React Context API** combined with the **`useReducer` hook** for managing global state (authentication, events, bookings).
    *   *Reasoning:* This approach provides a structured way to handle state transitions (via reducers) without adding external libraries like Redux or Zustand, which were deemed overkill for this project's scale. State is modularized into features (`/features/*`) with dedicated contexts (`AuthContext`, `EventsContext`, `BookingsContext`). A custom hook `useAppState` aggregates these contexts for convenient access in components.
*   **Data Persistence:** **Expo SQLite** is used for local on-device data storage (users, events, bookings).
    *   *Reasoning:* Meets the requirement for data persistence without needing a backend. A simple migration strategy (`utils/database.ts -> migrateDbIfNeeded`) initializes the schema and seeds data on first launch. This choice reflects a common approach for offline-first or demo applications. A real-world application would typically involve a remote API and database.
*   **Authentication & Session:** Basic email/password authentication logic interacts directly with the local SQLite database. The user session (a simple user object) is stored securely using **Expo Secure Store**. Role-based access control is implemented via redirects in Expo Router layouts and conditional logic within components/contexts based on the user's role.
*   **Admin/Client Separation:** Primarily achieved through distinct route groups in Expo Router (`(client)` vs `admin`). Layout files within `(app)` and `(client)` check the user's authentication status and role, redirecting unauthorized users appropriately (e.g., non-admins accessing `/admin` are redirected, clients accessing `/admin` are redirected). Context providers also contain checks (e.g., `isAdmin`) to prevent unauthorized data manipulation actions.
*   **UI Components:** Custom `Themed` components (`ThemedView`, `ThemedText`, `ThemedButton`, etc.) are created for UI consistency and easier theming (supporting light/dark modes via `useColorScheme`).

## Assumptions and Simplifications

*   **Local Data Only:** The application operates entirely locally using SQLite. There is no backend API for data synchronization or real-time updates across multiple users/devices.
*   **Basic Authentication:** User authentication is basic (plaintext password check against local DB - **NOT SUITABLE FOR PRODUCTION**). Session management relies on storing the user object in Secure Store; no JWTs, refresh tokens, or proper session invalidation mechanisms are implemented.
*   **Error Handling:** Basic global error display (`ErrorModal`) via context state. Production apps would require more granular and user-friendly error handling and reporting.
*   **Image Handling:** Images selected via `expo-image-picker` are only referenced by their local URI. No image upload or persistent storage mechanism is implemented.
*   **Testing:** Tests cover core utilities, state reducers, and basic component rendering/interaction. Test coverage is not exhaustive, particularly around database interactions within integration tests.
*   **Scalability:** While Context/Reducer is suitable here, extremely large applications might benefit from more specialized state management libraries (Redux, Zustand) or data-fetching libraries (React Query, SWR). SQLite performance might degrade with very large datasets on mobile.
*   **Concurrency:** No specific handling for race conditions (e.g., two users trying to book the last spot simultaneously). This would typically be handled by a backend.
*   **UI/UX:** Styling is functional and clean but basic. No complex animations or advanced UX patterns were prioritized.

## Libraries and Tools Used

*   **Expo SDK 52:** Core framework for building and running the React Native application.
*   **React (v18) & React Native (v0.76):** Foundation UI library and native runtime.
*   **TypeScript:** For static typing and improved code quality/maintainability.
*   **Expo Router:** File-based routing and navigation.
*   **Expo SQLite:** Local SQL database storage.
*   **Expo Secure Store:** Securely storing sensitive data (like session info).
*   **Expo Font, Vector Icons, Status Bar, Splash Screen, etc.:** Standard Expo modules for core functionalities.
*   **Expo Image Picker:** Selecting images from the device library.
*   **Expo Checkbox:** Checkbox UI component.
*   **@react-native-community/datetimepicker:** Native date/time picker UI.
*   **react-native-ui-datepicker:** Alternative/customizable date picker UI, for date ranges selection (Used for events filtering).
*   **@react-native-picker/picker:** Dropdown picker component.
*   **@react-native-community/slider:** Slider UI component.
*   **Jest & Jest-Expo:** Testing framework and Expo preset.
*   **@testing-library/react-native:** Utilities for testing components in a user-centric way.

## Seniority Level & Justification

**Assessed Level:** Senior developer

**Justification:**

1.  **Architecture & Structure:** The project demonstrates a solid understanding of structuring a React Native application using established patterns. The use of Expo Router for clear route separation (Auth/Client/Admin), Context API with `useReducer` for organized state management (beyond basic `useState`), and modularization (components, hooks, features, utils) indicates experience beyond a Junior level.
2.  **Feature Completeness:** Successfully implemented all core requirements and bonus challenges (Authentication, Persistence, Filtering/Sorting, Search, History, Testing). This shows the ability to handle a reasonably complex feature set.
3.  **Data Management:** The implementation of data persistence using SQLite, including a basic migration strategy and interaction via a context layer, demonstrates understanding of handling data beyond in-memory structures, considering aspects relevant to real-world (albeit local) applications. The rationale for choosing Context/Reducer over simpler or more complex solutions is considered.
4.  **Code Quality & TypeScript:** The use of TypeScript for type safety and the creation of reusable, themed components suggest an emphasis on maintainability and code quality expected at senior level.
5.  **Problem Solving:** The solution effectively addresses the core requirements of the event planning portal within the specified constraints.
6.  **Testing:** Inclusion of unit and basic integration tests shows an understanding of testing principles and practices, which becomes increasingly important at higher seniority levels.

While certain production-level considerations (robust auth, advanced error handling, backend integration, exhaustive testing) are simplified as noted above, the overall architecture, feature implementation, and use of relevant technologies align well with the expectations for a Senior developer. The choices made (e.g., Context/Reducer, SQLite) are justifiable for the scope of this specific take-home test.
