import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Ticket,
  CheckCircle,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  UserPlus,
  UserCog,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Card from "../Card/Card";
import { CreateTicketForm } from "../Create-Ticket/CreateTicketForm";
import StatsCard from "../StatsCard/StatsCard";
import ActivityItem from "../ActivityItem/ActivityItem";
import PriorityItem from "../PriorityItem/PriorityItem";
import PerformanceBar from "../PerformanceBar/PerformanceBar";
import InfoCard from "../InfoCard/InfoCard";
import ActivityLogItem from "../ActivityLogItem/ActivityLogItem";
import statusColors from "../Colors/StatusColors";
import priorityColors from "../Colors/priorityColors";
import tickets from "../SampleTickets/Tickets";
import ViewUsers from "../ViewUsers/ViewUsers";
import CreateUser from "../CreateUser/CreateUser";
import UserProfile from "../Profile/UserProfile";
import TicketDetails from "../TicketDetails/TicketDetails"; // Assuming TicketDetails is in a separate file
import withRoleAccess from "../../hoc/withRoleAccess";
import actionColors from "../Colors/actionColors";

const TicketDetailsWithRole = withRoleAccess(TicketDetails);


const Dashboard = ({ userRole }) => {
  const [activeView, setActiveView] = useState("dashboard");
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [role, setUserRole] = useState(localStorage.getItem("userRole"))


  // For sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Added missing state declarations
  const [ticketStats, setTicketStats] = useState({
    open: { value: "0", trend: "0 from yesterday", trendUp: false },
    closed: { value: "0", trend: "0 from last week", trendUp: false },
    resolved: { value: "0", trend: "0 from last week", trendUp: false }
  });
  const [priorityIssues, setPriorityIssues] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState([]);

  const API_GET_TICKET = import.meta.env.VITE_GET_TICKET;


  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  // Helper function to generate activity description
  const getActivityDescription = (ticket) => {
    if (ticket.lastAction === 'assignment') {
      return `Assigned to ${ticket.assignedTo}`;
    } else if (ticket.lastAction === 'status_change') {
      return `Status changed to ${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}`;
    } else if (ticket.lastAction === 'comment') {
      return 'New comment added';
    }
    return 'Updated';
  };

  // Helper function to calculate relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const ticketTime = new Date(timestamp);
    const diffMinutes = Math.floor((now - ticketTime) / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffMinutes / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  // fetch ticket status
  // const fetchTicketStats = async () => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);

  //     const token = localStorage.getItem("userToken");
  //     if (!token) throw new Error("Unauthorized: No token found");

  //     const response = await axios.get("http://localhost:4000/api/ticket/fetch-ticket-details", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     console.log("API Response:", response.data); // Debugging: Check API response

  //     if (!response.data || typeof response.data !== "object" || Array.isArray(response.data)) {
  //       throw new Error("Invalid API response: Expected an object but got an array.");
  //     }

  //     const {
  //       stats = {}, 
  //       priorityIssues = [], 
  //       recentActivities = [], 
  //       tickets = [] 
  //     } = response.data;

  //     setTicketStats({
  //       open: {
  //         value: stats.openTickets?.toString() || "0",
  //         trend: stats.openTrend ? `${stats.openTrend > 0 ? "+" : ""}${stats.openTrend} from yesterday` : "N/A",
  //         trendUp: stats.openTrend < 0
  //       },
  //       closed: {
  //         value: stats.closedTickets?.toString() || "0",
  //         trend: stats.closedTrend ? `${stats.closedTrend > 0 ? "+" : ""}${stats.closedTrend} from last week` : "N/A",
  //         trendUp: stats.closedTrend > 0
  //       },
  //       resolved: {
  //         value: stats.resolvedThisWeek?.toString() || "0",
  //         trend: stats.resolvedTrend ? `${stats.resolvedTrend > 0 ? "+" : ""}${stats.resolvedTrend} from last week` : "N/A",
  //         trendUp: stats.resolvedTrend > 0
  //       }
  //     });

  //     setPriorityIssues(Array.isArray(priorityIssues) ? priorityIssues : []);
  //     setRecentActivity(
  //       Array.isArray(recentActivities)
  //         ? recentActivities.map(ticket => ({
  //             title: ticket?.title || "No title",
  //             description: ticket?.description || "No details",
  //             time: ticket?.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : "Unknown time",
  //           }))
  //         : []
  //     );
  //     setTickets(Array.isArray(tickets) ? tickets : []);

  //   } catch (error) {
  //     console.error("Error fetching ticket stats:", error.message);
  //     setError("Failed to load ticket statistics. Please try again later.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // Add useEffect to fetch ticket stats when component mounts
  // useEffect(() => {
  //   fetchTicketStats();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const fetchTickets = async () => {
    try {
      // Get the auth token from wherever you store it (localStorage, context, etc.)
      const authToken = localStorage.getItem('userToken'); // Or use your auth management system

      const response = await axios.get(API_GET_TICKET, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  };

  useEffect(() => {
    const getTickets = async () => {
      try {
        setIsLoading(true);
        const ticketData = await fetchTickets();

        console.log("Fetched Tickets:", ticketData); // Debugging log

        // Extract the tickets array correctly
        setTickets(ticketData.tickets || []);

        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else {
          setError('Failed to load tickets. Please try again later.');
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };



    getTickets();

    // Optional: Set up polling for real-time updates
    // const pollingInterval = setInterval(getTickets, 30000); // Poll every 30 seconds
    // return () => clearInterval(pollingInterval);
  }, []);

  const [activeViewLocal, setActiveViewLocal] = useState("dashboard");

  // Handler to update both local and parent state
  const handleTicketSelect = (ticketId) => {
    setActiveViewLocal(ticketId);
    setActiveView(ticketId);
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <p className="text-gray-500">Loading tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative`}>
        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-16 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 z-10"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ?
            <ChevronRight size={16} className="text-gray-600" /> :
            <ChevronLeft size={16} className="text-gray-600" />
          }
        </button>

        <div className="p-4 border-b border-gray-200 flex items-center">
          <h1 className={`text-xl font-bold text-indigo-700 ${isCollapsed ? 'hidden' : 'block'}`}>StackIT</h1>
          {isCollapsed && <h1 className="text-xl font-bold text-indigo-700">S</h1>}
        </div>

        {/* Create Ticket Button */}
        <div className="p-4">
          <button
            onClick={() => setActiveView("createTicket")}
            className={`w-full bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center`}
          >
            <Plus size={16} className={isCollapsed ? '' : 'mr-2'} />
            {!isCollapsed && "Create Ticket"}
          </button>
        </div>

        {/* User Management Menu */}
        <div className="px-4 mb-2">
          <button
            onClick={toggleUserMenu}
            className={`w-full text-left ${isCollapsed ? 'justify-center' : 'justify-between'} flex items-center px-2 py-2 rounded-md hover:bg-gray-100 text-gray-700`}
          >
            {isCollapsed ? (
              <Users size={16} className="text-gray-600" />
            ) : (
              <>
                <div className="flex items-center">
                  <Users size={16} className="text-gray-600 mr-2" />
                  <span className="font-medium">User Management</span>
                </div>
                {isUserMenuOpen ?
                  <ChevronUp size={16} className="text-gray-600" /> :
                  <ChevronDown size={16} className="text-gray-600" />
                }
              </>
            )}
          </button>

          {/* Dropdown menu */}
          {(isUserMenuOpen || isCollapsed) && (
            <div className={`${isCollapsed ? 'px-1 pt-1' : 'pl-6 pb-2'} space-y-2`}>
              {(role === "admin" || role === "agent") &&
                <>
                  <button
                    onClick={() => setActiveView("ViewUsers")}
                    className={`w-full text-left ${isCollapsed ? 'justify-center' : ''} flex items-center px-2 py-2 rounded-md hover:bg-gray-100 text-gray-700`}
                  >
                    <Users size={16} className={`text-gray-600 ${isCollapsed ? '' : 'mr-2'}`} />
                    {!isCollapsed && <span className="text-sm">View Users</span>}
                  </button>
                  <button
                    onClick={() => setActiveView("CreateUser")}
                    className={`w-full text-left ${isCollapsed ? 'justify-center' : ''} flex items-center px-2 py-2 rounded-md hover:bg-gray-100 text-gray-700`}
                  >
                    <UserPlus size={16} className={`text-gray-600 ${isCollapsed ? '' : 'mr-2'}`} />
                    {!isCollapsed && <span className="text-sm">Create User</span>}
                  </button>

                </>
              }

              <button
                onClick={() => setActiveView("UserProfile")}
                className={`w-full text-left ${isCollapsed ? 'justify-center' : ''} flex items-center px-2 py-2 rounded-md hover:bg-gray-100 text-gray-700`}
              >
                <UserCog size={16} className={`text-gray-600 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && <span className="text-sm">See Your Profile</span>}
              </button>
            </div>
          )}
        </div>
        <hr className="mb-3 border border-[#432dd7]" />

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="px-4 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Minimized Search */}
        {isCollapsed && (
          <div className="px-4 mb-4">
            <button className="w-full p-2 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50">
              <Search size={16} className="text-gray-400" />
            </button>
          </div>
        )}

        {/* Ticket List */}
        <div className="flex-grow overflow-y-auto">
          {!isCollapsed && (
            <h2 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              All Tickets
            </h2>
          )}
          {tickets.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No tickets found</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <li key={ticket.ticket_id}>
                  <button
                    onClick={() => handleTicketSelect(ticket.ticket_id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${activeView === ticket.ticket_id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                      }`}
                  >
                    {isCollapsed ? (
                      <div className="flex flex-col items-center">
                        <span
                          className={`h-2 w-2 rounded-full ${statusColors[ticket.status].replace('text-', 'bg-')}`}
                        ></span>
                        <span className="text-xs font-semibold text-gray-500 mt-1">
                          {ticket.ticket_id.substring(0, 3)}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-500">{ticket.ticket_id}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[ticket.status]}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 truncate">{ticket.subject}</p>
                        <div className="mt-1 flex justify-between items-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[ticket.priority]}`}>
                            {ticket.priority}
                          </span>
                          {ticket.last_action && (
                            <span className={`text-xs px-2 py-1 rounded-full ${actionColors[ticket.last_action] || 'text-gray-600 bg-gray-100'}`}>
                              {ticket.last_action}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeView === "dashboard" && (
          <>
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              {error && <div className="text-red-500">{error}</div>}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard
                icon={<Ticket className="text-indigo-600" />}
                title="Open Tickets"
                value={ticketStats?.open?.value || "0"}
                trend={ticketStats?.open?.trend || "N/A"}
                trendUp={ticketStats?.open?.trendUp || false}
                isLoading={isLoading}
              />
              <StatsCard
                icon={<Clock className="text-blue-600" />}
                title="Closed Tickets"
                value={ticketStats?.closed?.value || "0"}
                trend={ticketStats?.closed?.trend || "N/A"}
                trendUp={ticketStats?.closed?.trendUp || false}
                isLoading={isLoading}
              />
              <StatsCard
                icon={<CheckCircle className="text-green-600" />}
                title="Resolved This Week"
                value={ticketStats?.resolved?.value || "0"}
                trend={ticketStats?.resolved?.trend || "N/A"}
                trendUp={ticketStats?.resolved?.trendUp || false}
                isLoading={isLoading}
              />
            </div>

            {/* Recent Activity & Priority Issues */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card title="Recent Activity" isLoading={isLoading}>
                {recentActivity.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {recentActivity.map((activity, index) => (
                      <ActivityItem
                        key={index}
                        title={activity.title}
                        description={activity.description}
                        time={activity.time}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 p-4">No recent activity found.</p>
                )}
              </Card>

              <Card title="Priority Issues" isLoading={isLoading}>
                {priorityIssues.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {priorityIssues.map((issue) => (
                      <PriorityItem
                        key={issue.id}
                        id={issue.id}
                        title={issue.title}
                        department={issue.department}
                        priority={issue.priority}
                        onClick={() => setActiveView(String(issue.id))}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 p-4">No priority issues found.</p>
                )}
              </Card>
            </div>

            {/* Support Team Performance */}
            <Card title="Support Team Performance">
              <div className="space-y-4">
                <PerformanceBar team="Network Team" value={85} color="bg-indigo-500" />
                <PerformanceBar team="Software Support" value={92} color="bg-green-500" />
                <PerformanceBar team="Hardware Support" value={78} color="bg-blue-500" />
              </div>
            </Card>
          </>
        )}

        {/* Conditional Views */}
        {activeView === "createTicket" && <CreateTicketForm setActiveView={setActiveView} />}
        {activeView === "ViewUsers" && <ViewUsers setActiveView={setActiveView} />}
        {activeView === "CreateUser" && <CreateUser setActiveView={setActiveView} />}
        {activeView === "UserProfile" && <UserProfile setActiveView={setActiveView} />}

        {tickets?.some(t => t.ticket_id === activeView) && (
          <TicketDetailsWithRole
            ticket={tickets.find(t => t.ticket_id === activeView)}
            userRole={userRole || localStorage.getItem('userRole')} // Add fallbacks
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;