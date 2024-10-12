import React, { useState, useEffect } from 'react';
import { useScheduleContext } from '../context/ScheduleContextProvider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Sidebar: React.FC = () => {
  const { weekendsVisible, toggleWeekends, events } = useScheduleContext();

  const [isDragging, setIsDragging] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(350); // Default width of the sidebar
  const [initialWidth, setInitialWidth] = useState(350); // Width of sidebar when drag starts
  const [startX, setStartX] = useState(0); // Track where drag starts
  const [isCollapsed, setIsCollapsed] = useState(false); // Track if the sidebar is collapsed
  const [previousWidth, setPreviousWidth] = useState(400); // To track previous width

  const MIN_WIDTH = 30; // Minimum width of the sidebar to keep handle visible

  // Mouse down handler to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX); // Store where the drag starts (X position)
    setInitialWidth(sidebarWidth); // Store the sidebar's initial width
  };

  // Mouse move handler to drag the sidebar
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - startX; // Difference between current mouse position and starting point
      const newWidth = initialWidth + deltaX; // Adjust the sidebar width relative to where drag started
      const clampedWidth = Math.max(MIN_WIDTH, Math.min(newWidth, 350)); // Keep the sidebar above MIN_WIDTH and limit max width to 400px
      setSidebarWidth(clampedWidth);

      // Determine if it's collapsed based on width
      if (clampedWidth <= MIN_WIDTH) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    }
  };

  // Mouse up handler to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    setPreviousWidth(sidebarWidth);
  };

  // Add event listeners for mouse move and mouse up
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Function to toggle sidebar open/close with the arrow icon
  const toggleSidebar = () => {
    if (isCollapsed) {
      setSidebarWidth(previousWidth); // Restore the previous width when expanding
      setIsCollapsed(false);
    } else {
      setPreviousWidth(sidebarWidth); // Store the current width before collapsing
      setSidebarWidth(MIN_WIDTH); // Collapse to MIN_WIDTH to keep the handle visible
      setIsCollapsed(true);
    }
  };

  return (
    <div
      className="bg-gray-100 border-r border-gray-300"
      style={{
        width: `${sidebarWidth}px`, // Apply the calculated width to the sidebar
        transition: isDragging ? 'none' : 'width 0.3s ease',
        padding: sidebarWidth > 50 ? 20 : '0px', // Adjust padding to prevent content overflow
        overflow: 'hidden',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      }}
    >
      {/* Sidebar Content */}
      {sidebarWidth > MIN_WIDTH && (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-2">Instructions</h2>
            <hr className="border-gray-300 mb-4" />
            <ul className="list-disc list-inside text-gray-600">
              <li>Select dates and you will be prompted to create a new event</li>
              <li>Drag, drop, and resize events</li>
              <li>Click an event to edit it</li>
            </ul>
          </div>

          <div className="mb-6 px-5">
            <label className="flex items-center space-x-2 text-gray-700">
              <input
                type="checkbox"
                checked={weekendsVisible}
                onChange={toggleWeekends}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>Weekends</span>
            </label>
          </div>

          <div className="flex-1 overflow-auto px-5">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Events</h3>
            <ul className="space-y-2">
              {events.sort((a, b) => {
                  return a.startStr < b.startStr ? -1 : 1;
              }).map((event) => {
                const startDate = event.startStr ? new Date(event.startStr) : null;
                const endDate = event.endStr ? new Date(event.endStr) : null;
                
                const formattedStartDate = startDate?.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                });

                const formattedEndDate = endDate?.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                });

                return (
                  <li
                    key={event.id}
                    className="text-sm text-gray-600 border-b pb-2 border-gray-300 -ml-5"
                  >
                    <span>{event.title}</span>
                    <br />
                    <span className="text-xs text-gray-400">
                      {formattedStartDate} {formattedEndDate ? `- ${formattedEndDate }` : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}

      <div
        className="absolute right-0 top-0 h-full w-8 bg-gray-300 cursor-col-resize flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onClick={toggleSidebar} // Allow clicking the handle to toggle open/close
      >
        <ChevronRightIcon
          className="h-6 w-6 text-gray-600"
          style={{
            transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', // Rotate the icon based on sidebar state
            transition: 'transform 0.3s ease', // Smooth rotation animation
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;