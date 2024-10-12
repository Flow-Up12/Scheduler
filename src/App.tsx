import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ScheduleProvider } from "./context/ScheduleContextProvider";
import Sidebar from "./components/Sidebar";
import EditEventModal from "./components/EditEventModal";
import Calendar from "./components/Calendar";
import CreateEventModal from "./components/CreateEventModal";
import Header from "./components/Header";
import Login from "./pages/Login";
import { NotifyProvider } from "mj-react-form-builder";
import Organization from "./pages/Organization";
import ProfilePage from "./pages/Profile";
import { UserProvider } from "./context/UserContextProvider";
import { AuthProvider } from "./context/AuthProvider";
import JoinOrganization from "./pages/JoinOrganization";

const App = () => {
  return (
    <Router>
      <NotifyProvider>
        <AuthProvider>
          <UserProvider>
            <ScheduleProvider>
              <div className="relative">
                {/* Header */}
                <Header />

                {/* Main Routes */}
                <div className="min-h-screen">
                  <Routes>
                    <Route path="/login" element={<Login />} />

                    {/* Wrap protected routes with UserProvider */}
                    <Route
                      path="/schedule"
                      element={
                        <div className="flex my-16">
                          <Sidebar />
                          <Calendar />
                        </div>
                      }
                    />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/organization" element={<Organization />} />
                    <Route
                      path="/join-organization"
                      element={<JoinOrganization />}
                    />
                  </Routes>
                </div>
                {/* Modals */}
                <EditEventModal />
                <CreateEventModal />
              </div>
            </ScheduleProvider>
          </UserProvider>
        </AuthProvider>
      </NotifyProvider>
    </Router>
  );
};

export default App;
