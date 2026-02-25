import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function App() {
  const showActionMsg = (type, text) => {
  setActionMsg({ type, text });

  // auto-hide after 3 seconds
  setTimeout(() => {
    setActionMsg(null);
  }, 3000);
};
  const [schoolId, setSchoolId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");


  const [conversations, setConversations] = useState([]);

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [actionMsg, setActionMsg] = useState(null);
// actionMsg will be like: { type: "success", text: "Invoice marked as sent" }


  const loadConversations = async () => {
    setError("");
    setMessagesError("");

    if (!schoolId.trim()) {
      setError("Enter a schoolId first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
  `${API_BASE}/admin/conversations/${schoolId}`,
  {
    headers: {
      "x-admin-key": import.meta.env.VITE_ADMIN_API_KEY,
    },
  }
);

const data = await res.json();

if (!res.ok || data.success === false) {
  throw new Error(data.message || data.error || "Failed to load conversations");
}

setConversations(data.conversations || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    setSelectedConversationId(conversationId);
    setMessages([]);
    setMessagesError("");
    setMessagesLoading(true);

   try {
    const res = await fetch(
    `${API_BASE}/admin/conversation/${conversationId}/messages`,
    {
      headers: {
        "x-admin-key": import.meta.env.VITE_ADMIN_API_KEY,
      },
    }
    );

  const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || data.error || "Failed to load messages");
      }

      setMessages(data.messages || []);
    } catch (e) {
      setMessagesError(e.message);
    } finally {
      setMessagesLoading(false);
    }
  };
    const reloadAfterAction = async (conversationId) => {
    await loadConversations();      // refresh left list
    await loadMessages(conversationId); // refresh right messages
  };

    const markSent = async (id) => {
    showActionMsg("info", "Working... marking invoice as sent");

    try {
      const res = await fetch(`${API_BASE}/admin/invoice/${id}/mark-sent`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setActionMsg(`❌ Failed: ${data.message || data.error || "Unknown error"}`);
        return;
      }

      showActionMsg("success", data.message);
      await reloadAfterAction(id);

    } catch (err) {
      setActionMsg(`❌ Network error: ${err.message}`);
    }
  };

  const markPaid = async (id) => {
    showActionMsg("info", "Working... marking invoice as paid");

    try {
      const res = await fetch(`${API_BASE}/admin/invoice/${id}/mark-paid`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        showActionMsg("error", data.message || data.error || "Unknown error");
        return;
      }

      showActionMsg("success", data.message);
      await reloadAfterAction(id);

    } catch (err) {
      showActionMsg("error", data.message || data.error || "Unknown error");
    }
  };

  const resetConversation = async (id) => {
    showActionMsg("info", "Working... resetting conversation");

    try {
      const res = await fetch(`${API_BASE}/admin/conversation/${id}/reset`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        showActionMsg("error", data.message || data.error || "Unknown error");
        return;
      }

      showActionMsg("success", data.message);
      await reloadAfterAction(id);

    } catch (err) {
      setActionMsg(`❌ Network error: ${err.message}`);
    }
  };
  const filteredConversations =
    filter === "all"
      ? conversations
      : conversations.filter((c) => c.invoiceStatus === filter);

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Schools Agent Admin</h2>

      {/* Top Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          placeholder="Enter schoolId (e.g. 1)"
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={loadConversations} style={{ padding: "10px 16px" }}>
          {loading ? "Loading..." : "Load Conversations"}
        </button>
      </div>

      {error && (
        <div style={{ background: "#ffe5e5", padding: 10, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Main layout: left = conversations, right = messages */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Conversations */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Conversations</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
          <button onClick={() => setFilter("sent")}>Sent</button>
          <button onClick={() => setFilter("paid")}>Paid</button>
          </div>


          {conversations.length === 0 && !loading ? (
            <p>No conversations loaded yet.</p>
          ) : (
            <ul style={{ paddingLeft: 16 }}>
             {filteredConversations.map((c) => {
                const isSelected = c.id === selectedConversationId;

                return (
                  <li key={c.id} style={{ marginBottom: 10 }}>
                    <button
                      onClick={() => loadMessages(c.id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: 10,
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        fontWeight: isSelected ? "bold" : "normal",
                      }}
                    >
                      <div>
                        <b>ID:</b> {c.id} &nbsp; <b>Status:</b> {c.status}
                      </div>
                      <div>
                        <b>Invoice:</b> {c.invoiceStatus} &nbsp; <b>Parent:</b>{" "}
                        {c.Parent?.phone || "N/A"}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Messages */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>
            Messages {selectedConversationId ? `(Conversation ${selectedConversationId})` : ""}
          </h3>
          {actionMsg && (
  <div
    style={{
      marginBottom: 12,
      padding: 12,
      borderRadius: 8,
      border: "1px solid #ddd",
      background:
        actionMsg.type === "success"
          ? "#e7f7ed"
          : actionMsg.type === "error"
          ? "#fde8e8"
          : "#eef2ff",
      color:
        actionMsg.type === "success"
          ? "#065f46"
          : actionMsg.type === "error"
          ? "#7f1d1d"
          : "#1e3a8a",
      fontWeight: 600,
    }}
  >
    {actionMsg.text}
  </div>
)}


          {selectedConversationId && (
        <div style={{ marginBottom: 12, display: "flex", gap: 10 }}>
          <button onClick={() => markSent(selectedConversationId)}>
            Mark Sent
          </button>
          <button onClick={() => markPaid(selectedConversationId)}>
            Mark Paid
          </button>
          <button onClick={() => resetConversation(selectedConversationId)}>
            Reset
          </button>
        </div>
      )}

          {!selectedConversationId ? (
            <p>Click a conversation to view messages.</p>
          ) : messagesLoading ? (
            <p>Loading messages...</p>
          ) : messagesError ? (
            <div style={{ background: "#ffe5e5", padding: 10 }}>
              {messagesError}
            </div>
          ) : messages.length === 0 ? (
            <p>No messages found.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    padding: 10,
                    border: "1px solid #eee",
                    borderRadius: 8,
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    <b>{m.direction}</b> • {m.from} •{" "}
                    {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                  </div>
                  <div style={{ marginTop: 6 }}>{m.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
