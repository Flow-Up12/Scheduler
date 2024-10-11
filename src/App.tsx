import { ScheduleProvider } from "./context/ScheduleContextProvider";
import Sidebar from "./components/Sidebar";
import EditEventModal from "./components/EditEventModal";
import Calendar from "./components/Calendar";
import CreateEventModal from "./components/CreateEventModal";
import Header from "./components/Header";

const App = () => {
  return (
    <ScheduleProvider>
      <div className="relative">
        {/* Header */}
        <Header />

        {/* Main content below the header */}
        <div
          className="flex pt-16" // Ensure padding for the fixed header
        >
          <Sidebar />
          <Calendar />
        </div>

        {/* Modals */}
        <EditEventModal />
        <CreateEventModal />
      </div>
    </ScheduleProvider>
  );
};

export default App;