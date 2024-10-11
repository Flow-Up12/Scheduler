import React, { createContext, useContext, useState } from "react";
import {
  DateSelectArg,
  EventApi,
  EventClickArg,
  EventInput,
} from "@fullcalendar/core";
import { INITIAL_EVENTS, createEventId } from "../event-utils";



interface CreateEventPayload {
  title: string;
  description: string;
  image: File | null;
}

interface ScheduleContextType {
  weekendsVisible: boolean;
  toggleWeekends: () => void;
  events: EventApi[];
  setEvents: (events: EventApi[]) => void;
  handleEvents: (events: EventApi[]) => void;
  handleEventClick: (clickInfo: EventClickArg) => void;
  handleDateSelect: (selectInfo: DateSelectArg) => void;
  isEditEventModalOpen: boolean;
  setIsEditEventModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEvent: EventApi | null;
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventApi | null>>;
  handleEditEvent: (updatedEvent: Partial<EventInput>) => void;
  handleCreateEvent: (title: CreateEventPayload) => void;
  isCreateEventModalOpen: boolean;
  setIsCreateEventModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteEvent: () => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error(
      "useScheduleContext must be used within a ScheduleProvider"
    );
  }
  return context;
};

export const ScheduleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [events, setEvents] = useState<EventApi[]>(
    INITIAL_EVENTS as EventApi[]
  );
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  const toggleWeekends = () => {
    setWeekendsVisible(!weekendsVisible);
  };

  const [newEventDateRange, setNewEventDateRange] =
    useState<DateSelectArg | null>(null);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setNewEventDateRange(selectInfo); // Store selected date range
    setIsCreateEventModalOpen(true); // Open create event modal
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setIsEditEventModalOpen(true);
    setSelectedEvent(clickInfo.event);
  };

  // Function to handle editing events
  const handleEditEvent = (updatedEvent: Partial<EventInput>) => {
    if (selectedEvent) {
      if (updatedEvent.title)
        selectedEvent.setProp("title", updatedEvent.title);
      if (updatedEvent.start) selectedEvent.setStart(updatedEvent.start);
      if (updatedEvent.end) selectedEvent.setEnd(updatedEvent.end);

      setIsEditEventModalOpen(false);
      setSelectedEvent(null); // Close modal after saving
    }
  };

  const handleEvents = (events: EventApi[]) => {
    setEvents(events);
  };

  const handleCreateEvent = ({title, description, image}: CreateEventPayload) => {
    if (newEventDateRange) {
      let calendarApi = newEventDateRange.view.calendar;
  
      calendarApi.unselect(); // Clear date selection after use
  
      // Add the new event to the calendar
      calendarApi.addEvent({
        id: createEventId(),
        title,
        description,
        image,
        start: newEventDateRange.startStr,
        end: newEventDateRange.endStr,
        allDay: newEventDateRange.allDay,
      });
  
      // Close the modal and reset the selected date range
      setIsCreateEventModalOpen(false);
      setNewEventDateRange(null);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      selectedEvent.remove();
      setIsEditEventModalOpen(false);
      setSelectedEvent(null);
    }
  }

  return (
    <ScheduleContext.Provider
      value={{
        weekendsVisible,
        toggleWeekends,
        events,
        handleDateSelect,
        handleEventClick,
        setEvents,
        handleEvents,
        isEditEventModalOpen,
        setIsEditEventModalOpen,
        selectedEvent,
        setSelectedEvent,
        handleEditEvent,
        handleCreateEvent,
        isCreateEventModalOpen,
        setIsCreateEventModalOpen,
        handleDeleteEvent
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
