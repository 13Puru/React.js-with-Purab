import React, { useState } from "react";
import Card from "../Card/Card";
import InfoCard from "../InfoCard/InfoCard";
import ActivityLogItem from "../ActivityLogItem/ActivityLogItem";

const TicketDetails = ({ ticket, onAssign, onSelfAssign, onResolve, onClose }) => {
  // State for modal visibility
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  // Sample agents data (replace with actual data in your application)
  const agents = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Mike Johnson" },
    { id: 4, name: "Sara Williams" }
  ];
  
  // Handle undefined or null ticket
  if (!ticket) return <p className="text-gray-500">No ticket selected</p>;

  // Ensure responses and replies exist
  const responses = ticket.responses || [];
  const replies = ticket.replies || [];

  // Handle agent assignment
  const handleAssign = (agentId) => {
    onAssign && onAssign(ticket.ticket_id, agentId);
    setIsAssignModalOpen(false);
  };

  // Handle self assignment
  const handleSelfAssign = () => {
    onSelfAssign && onSelfAssign(ticket.ticket_id);
  };

  // Handle mark as resolved
  const handleResolve = () => {
    onResolve && onResolve(ticket.ticket_id);
  };

  // Handle close ticket
  const handleClose = () => {
    onClose && onClose(ticket.ticket_id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{ticket.subject}</h1>
        <div className="flex items-center gap-2">
          <span className={`text-sm px-3 py-1 rounded-full ${
            ticket.status === "resolved"
              ? "bg-green-100 text-green-800"
              : ticket.status === "in_progress"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {ticket.status}
          </span>
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
          >
            Assign Ticket
          </button>
          <button
            onClick={handleSelfAssign}
            className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded hover:bg-indigo-200"
          >
            Self Assign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <InfoCard label="Ticket ID" value={ticket.ticket_id} />
        <InfoCard
          label="Priority"
          value={ticket.priority}
          className={
            ticket.priority === "high"
              ? "text-red-600"
              : ticket.priority === "medium"
              ? "text-orange-600"
              : "text-gray-600"
          }
        />
        <InfoCard label="Category" value={ticket.category || "N/A"} />
        <InfoCard
          label="Created"
          value={ticket.created_at ? new Date(ticket.created_at).toLocaleString() : "N/A"}
        />
        <InfoCard label="Created By" value={ticket.created_by || "Unknown"} />
        <InfoCard label="Assigned To" value={ticket.assigned_to || "Unassigned"} />
      </div>

      <Card title="Description">
        <p className="text-sm text-gray-700">{ticket.issue || "No description available."}</p>
      </Card>

      <div className="mt-6">
        <Card title="Responses">
          {responses.length > 0 ? (
            responses.map((response) => (
              <ActivityLogItem
                key={response.response_id}
                user={response.responder || "Unknown"}
                action={response.response}
                time={response.created_at ? new Date(response.created_at).toLocaleString() : "N/A"}
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
                user={reply.replier || "Unknown"}
                action={reply.reply}
                time={reply.created_at ? new Date(reply.created_at).toLocaleString() : "N/A"}
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
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-indigo-700 rounded-md text-sm font-medium text-white hover:bg-indigo-800"
            >
              Post Comment
            </button>
            <button
              onClick={handleResolve}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
            >
              Mark as Resolved
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700"
            >
              Close Ticket
            </button>
          </div>
        </Card>
      </div>

      {/* Agent Assignment Modal with semi-transparent background */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Assign Ticket</h3>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {agents.map(agent => (
                  <li key={agent.id} className="py-2">
                    <button
                      onClick={() => handleAssign(agent.id)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      {agent.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;