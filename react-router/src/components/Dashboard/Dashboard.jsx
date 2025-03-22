import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // For sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
  };

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
        <hr className="mb-3 border border-[#432dd7]"/>

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
              Recent Tickets
            </h2>
          )}
          <ul className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <button
                  onClick={() => setActiveView(ticket.id)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${activeView === ticket.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                    }`}
                >
                  {isCollapsed ? (
                    <div className="flex flex-col items-center">
                      <span className={`h-2 w-2 rounded-full ${statusColors[ticket.status].replace('text-', 'bg-')}`}></span>
                      <span className="text-xs font-semibold text-gray-500 mt-1">{ticket.id.substring(0, 3)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-500">{ticket.id}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[ticket.status]}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 truncate">{ticket.subject}</p>
                      <div className="mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[ticket.priority]}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeView === "dashboard" && (
          <>
            {/* Header with Dashboard Title & Logout Button */}
            <div className="w-full flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard
                icon={<Ticket className="text-indigo-600" />}
                title="Open Tickets"
                value="12"
                trend="+2 from yesterday"
                trendUp={false}
              />
              <StatsCard
                icon={<Clock className="text-blue-600" />}
                title="Closed Tickets"
                value="42"
                trend="+21 from last week"
                trendUp={true}
              /> 
              <StatsCard
                icon={<CheckCircle className="text-green-600" />}
                title="Resolved This Week"
                value="24"
                trend="+5 from last week"
                trendUp={true}
              />
            </div>

            {/* Recent Activity & Priority Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card title="Recent Activity">
                <ul className="divide-y divide-gray-200">
                  <ActivityItem
                    title="Network connectivity issue"
                    description="Assigned to Network Team"
                    time="10 minutes ago"
                  />
                  <ActivityItem
                    title="Email not syncing on mobile"
                    description="Status changed to In Progress"
                    time="1 hour ago"
                  />
                  <ActivityItem
                    title="Printer configuration needed"
                    description="New comment added"
                    time="3 hours ago"
                  />
                </ul>
              </Card>

              <Card title="Priority Issues">
                <ul className="divide-y divide-gray-200">
                  <PriorityItem
                    id="TK-1001"
                    title="Network connectivity issue"
                    department="Network"
                    priority="high"
                  />
                  <PriorityItem
                    id="TK-1005"
                    title="New laptop setup required"
                    department="Hardware"
                    priority="high"
                  />
                </ul>
              </Card>
            </div>

            {/* Performance Card */}
            <Card title="Support Team Performance">
              <div className="space-y-4">
                <PerformanceBar
                  team="Network Team"
                  value={85}
                  color="bg-indigo-500"
                />
                <PerformanceBar
                  team="Software Support"
                  value={92}
                  color="bg-green-500"
                />
                <PerformanceBar
                  team="Hardware Support"
                  value={78}
                  color="bg-blue-500"
                />
              </div>
            </Card>
          </>
        )}

        {activeView === "createTicket" && <CreateTicketForm setActiveView={setActiveView} />}
        {activeView === "ViewUsers" && <ViewUsers setActiveView={setActiveView} />}
        {activeView === "CreateUser" && <CreateUser setActiveView={setActiveView} />}
        {activeView === "UserProfile" && <UserProfile setActiveView={setActiveView} />}

        {tickets.some(t => t.id === activeView) && (
          <TicketDetails ticket={tickets.find(t => t.id === activeView)} />
        )}
      </div>
    </div>
  );
};

const TicketDetails = ({ ticket }) => {
  // Ensure responses and replies exist
  const responses = ticket.responses || [];
  const replies = ticket.replies || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{ticket.subject}</h1>
        <span className={`text-sm px-3 py-1 rounded-full ${ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
          ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
          {ticket.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <InfoCard label="Ticket ID" value={ticket.ticket_id} />
        <InfoCard
          label="Priority"
          value={ticket.priority}
          className={
            ticket.priority === 'high' ? 'text-red-600' :
              ticket.priority === 'medium' ? 'text-orange-600' :
                'text-gray-600'
          }
        />
        <InfoCard label="Category" value={ticket.category} />
        <InfoCard label="Created" value={new Date(ticket.created_at).toLocaleString()} />
        <InfoCard label="Created By" value={ticket.created_by} />
        <InfoCard label="Assigned To" value={ticket.assigned_to || "Unassigned"} />
      </div>

      <Card title="Description">
        <p className="text-sm text-gray-700">{ticket.issue}</p>
      </Card>

      <div className="mt-6">
        <Card title="Responses">
          {responses.length > 0 ? (
            responses.map((response) => (
              <ActivityLogItem
                key={response.response_id}
                user={response.responder}
                action={response.response}
                time={new Date(response.created_at).toLocaleString()}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">No responses yet.</p>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Replies">
          {replies.length > 0 ? (
            replies.map((reply) => (
              <ActivityLogItem
                key={reply.reply_id}
                user={reply.replier}
                action={reply.reply}
                time={new Date(reply.created_at).toLocaleString()}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">No replies yet.</p>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Add Comment">
          <textarea
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            placeholder="Add your comment..."
          ></textarea>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-indigo-700 rounded-md text-sm font-medium text-white hover:bg-indigo-800"
            >
              Post Comment
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;