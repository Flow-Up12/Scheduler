import React, { createContext, useContext, useState } from "react";
import {
  DateSelectArg,
  EventApi,
  EventClickArg,
  EventInput,
} from "@fullcalendar/core";
import FirestoreController from "../helpers/FirebaseController";
import { useUserContext } from "./UserContextProvider";
import { createEventId } from "../event-utils";
import { useNotify } from "mj-react-form-builder";

interface CreateEventPayload {
  title: string;
  description: string;
  // image: File | null;
  location: string;
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
  const [events, setEvents] = useState<EventApi[]>([]); // Initialize with an empty array
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  const { user } = useUserContext();
  const organizationController = new FirestoreController("organizations");
  const { notify } = useNotify();

  const toggleWeekends = () => {
    setWeekendsVisible(!weekendsVisible);
  };

  const [newEventDateRange, setNewEventDateRange] =
    useState<DateSelectArg | null>(null);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setNewEventDateRange(selectInfo);
    setIsCreateEventModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setIsEditEventModalOpen(true);
    setSelectedEvent(clickInfo.event);
  };

  const handleEditEvent = (updatedEvent: Partial<EventInput>) => {
    if (selectedEvent) {
      if (updatedEvent.title)
        selectedEvent.setProp("title", updatedEvent.title);
      if (updatedEvent.start) selectedEvent.setStart(updatedEvent.start);
      if (updatedEvent.end) selectedEvent.setEnd(updatedEvent.end);
      if (updatedEvent.extendedProps) {
        if (updatedEvent.extendedProps.description)
          selectedEvent.setExtendedProp(
            "description",
            updatedEvent.extendedProps.description
          );
        if (updatedEvent.extendedProps.image)
          selectedEvent.setExtendedProp(
            "image",
            updatedEvent.extendedProps.image
          );
        if (updatedEvent.extendedProps.location)
          selectedEvent.setExtendedProp(
            "location",
            updatedEvent.extendedProps.location
          );
      }

      console.log("Updated event", selectedEvent.toPlainObject());

      setIsEditEventModalOpen(false);
      setSelectedEvent(null); // Close modal after saving
    }
  };

  const handleEvents = async (newEvents: EventApi[]) => {
    setEvents(newEvents); // Update local events
    // Format the events before saving to Firestore
    const formattedEvents = newEvents.map((event) => event.toPlainObject());
    try {
      // Update Firestore with the new events array
      await organizationController.update(user?.organizationId, {
        events: formattedEvents,
      });
    } catch (error) {
      notify("Failed to update events in Firestore", "error");
    }
  };

  const handleCreateEvent = async ({
    title,
    description,
    // image,
    location,
  }: CreateEventPayload) => {
    if (newEventDateRange) {
      let calendarApi = newEventDateRange.view.calendar;
      calendarApi.unselect(); // Clear date selection after use

      // Add the new event to the calendar
      calendarApi.addEvent({
        id: createEventId(),
        title,
        description,
        // image,
        location,
        start: newEventDateRange.startStr,
        end: newEventDateRange.endStr,
        allDay: newEventDateRange.allDay,
      });

      const events = calendarApi.getEvents().map((event) => {
        return event.toPlainObject();
      });

      try {
        await organizationController.update(user?.organizationId, { events });
        notify("Event created successfully", "success");
      } catch (error) {
        notify(`Failed to create event: ${error}`, "error");
      }

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
  };

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
        handleDeleteEvent,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
