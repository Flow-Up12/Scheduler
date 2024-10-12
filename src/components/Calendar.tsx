import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useScheduleContext } from "../context/ScheduleContextProvider";
import { EventContentArg, EventInput } from "@fullcalendar/core/index.js";
import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContextProvider";
import FirestoreController from "../helpers/FirebaseController";
import Loading from "../components/Loading"; 

const Calendar = () => {
  const { weekendsVisible, handleDateSelect, handleEventClick, handleEvents } =
    useScheduleContext();

  const { user } = useUserContext();
  const [initialEvents, setInitialEvents] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const organizationController = new FirestoreController("organizations");

  function renderEventContent(eventContent: EventContentArg) {
    return (
      <>
        <b>{eventContent.timeText}</b>
        <i>{eventContent.event.title}</i>
      </>
    );
  }

  const fetchOrganizationEvents = async () => {
    if (user?.organizationId) {
      try {
        const organizationData = await organizationController.getById(
          user.organizationId
        );
        if (organizationData?.events) {
          return organizationData.events;
        } else {
          return [];
        }
      } catch (error) {
        console.error("Failed to fetch organization events", error);
        return [];
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrganizationEvents()
        .then((events) => {
          setInitialEvents(events);
        })
        .finally(() => setLoading(false)); // Stop loading after events are fetched
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="main">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        weekends={weekendsVisible}
        initialView="timeGridWeek"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={initialEvents} // Use the organization's events
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventsSet={handleEvents}
      />
    </div>
  );
};

export default Calendar;
