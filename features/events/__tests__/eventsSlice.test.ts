import eventsReducer, {
    addEvent,
    removeEvent,
    updateEvent,
    listEvents,
    eventsLoading,
    eventsSuccess,
    eventsError,
    EventState,
  } from '../eventsSlice';
  import { UpcomingEvent } from '@/utils/types';
  
  const initialState: EventState = {
    events: [],
    isLoading: false,
    error: undefined,
  };
  
  const sampleEvent1: UpcomingEvent = {
    id: '1',
    title: 'Test Event 1',
    description: 'Desc 1',
    dateTime: new Date('2025-10-01T10:00:00Z'),
    location: 'Location 1',
    capacity: 10,
  };
  
  const sampleEvent2: UpcomingEvent = {
    id: '2',
    title: 'Test Event 2',
    description: 'Desc 2',
    dateTime: new Date('2025-11-01T12:00:00Z'),
    location: 'Location 2',
    capacity: 20,
  };
  
  describe('Events Reducer', () => {
    it('should return the initial state', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(eventsReducer(initialState, {} as any)).toEqual(initialState);
    });
  
    it('should handle listEvents', () => {
      const state = eventsReducer(initialState, listEvents([sampleEvent1, sampleEvent2]));
      expect(state.events).toHaveLength(2);
      expect(state.events).toEqual([sampleEvent1, sampleEvent2]);
    });
  
    it('should handle addEvent', () => {
      const state = eventsReducer(initialState, addEvent(sampleEvent1));
      expect(state.events).toHaveLength(1);
      expect(state.events[0]).toEqual(sampleEvent1);
    });
  
    it('should handle removeEvent', () => {
      const stateWithEvents = { ...initialState, events: [sampleEvent1, sampleEvent2] };
      const state = eventsReducer(stateWithEvents, removeEvent('1'));
      expect(state.events).toHaveLength(1);
      expect(state.events[0]).toEqual(sampleEvent2);
    });
  
    it('should handle updateEvent', () => {
      const stateWithEvent = { ...initialState, events: [sampleEvent1] };
      const updates: Partial<UpcomingEvent> & { id: string } = {
        id: '1',
        title: 'Updated Title',
        capacity: 15,
      };
      const state = eventsReducer(stateWithEvent, updateEvent(updates));
      expect(state.events).toHaveLength(1);
      expect(state.events[0].title).toBe('Updated Title');
      expect(state.events[0].capacity).toBe(15);
      expect(state.events[0].description).toBe(sampleEvent1.description); // Ensure other fields remain
    });
  
    it('should handle eventsLoading', () => {
      const state = eventsReducer(initialState, eventsLoading());
      expect(state.isLoading).toBe(true);
    });
  
    it('should handle eventsSuccess', () => {
      const loadingState = { ...initialState, isLoading: true, error: 'Some error' };
      const state = eventsReducer(loadingState, eventsSuccess());
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeUndefined();
    });
  
    it('should handle eventsError', () => {
      const loadingState = { ...initialState, isLoading: true };
      const errorMessage = 'Failed to fetch';
      const state = eventsReducer(loadingState, eventsError(errorMessage));
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });