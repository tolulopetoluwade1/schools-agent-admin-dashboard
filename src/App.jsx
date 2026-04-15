import { useState } from "react";
import logo from "./assets/EduCore.png";
import LandingPage from "./LandingPage";

const isMobile = window.innerWidth < 768;
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
  const [page, setPage] = useState("landing");


  const [conversations, setConversations] = useState([]);

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [actionMsg, setActionMsg] = useState(null);
  const [broadcastText, setBroadcastText] = useState("");
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
  headers: {
    "x-admin-key": import.meta.env.VITE_ADMIN_API_KEY,
  },
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
      headers: {
    "x-admin-key": import.meta.env.VITE_ADMIN_API_KEY,
  },
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
      // 👇 ADD THIS EXACTLY HERE (NEW LINE BELOW)
  const selectedConversation = conversations.find(
  (c) => c.id === selectedConversationId
);

if (page === "landing") {
  return <LandingPage onGetStarted={() => setPage("dashboard")} />;
}

  return (
    <div style={{
  maxWidth: 1200,
  margin: "40px auto",
  fontFamily: "Arial",
  background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
  color: "#ffffff",
  padding: 20,
  borderRadius: 12
}}>
  <div style={{
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 20
}}>
  <button
  onClick={() => setPage("landing")}
  style={{
    marginLeft: "auto",
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    background: "#1e293b",
    color: "#fff",
    cursor: "pointer"
  }}
>
  ← Home
</button>
  <img src={logo} alt="logo" style={{ height: 40 }} />
  <h2 style={{ margin: 0 }}>EduCore AI</h2>
</div>
      <div style={{
  marginBottom: 20,
  padding: 16,
  borderRadius: 12,
  background: "#0f172a",
  color: "#ffffff"
}}>
  <h3>Broadcast Message</h3>

  <textarea
    value={broadcastText}
    onChange={(e) => setBroadcastText(e.target.value)}
    placeholder="Type message to all parents..."
    style={{ width: "100%", padding: 10, marginBottom: 10 }}
  />

  <button
    onClick={async () => {
      if (!broadcastText.trim()) return;

      try {
        const res = await fetch(`${API_BASE}/admin/broadcast`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": import.meta.env.VITE_ADMIN_API_KEY,
          },
          body: JSON.stringify({ message: broadcastText }),
        });

        const data = await res.json();

        if (!res.ok || data.success === false) {
          showActionMsg("error", data.message || "Broadcast failed");
          return;
        }

        showActionMsg("success", data.message);
        setBroadcastText("");

      } catch (err) {
        showActionMsg("error", "Network error");
      }
    }}
    style={{ padding: "10px 16px" }}
  >
    Send Broadcast
  </button>
</div>

      {/* Top Controls */}
      <div style={{
      display: "flex",
      gap: 10,
      marginBottom: 16,
      padding: 12,
      borderRadius: 12,
      background: "#0f172a"
    }}>
        <input
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          placeholder="Enter schoolId (e.g. 1)"
          style={{ flex: 1, padding: 10 }}
        />
        <button
        onClick={loadConversations}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "none",
          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 600
        }}
      >
        {loading ? "Loading..." : "Load Conversations"}
      </button>
      </div>

      {error && (
        <div style={{ background: "#ffe5e5", padding: 10, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Main layout: left = conversations, right = messages */}
      <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "350px 1fr",
      gap: 20
    }}>
        {/* Conversations */}
          <div style={{
          borderRadius: 12,
          padding: 12,
          background: "#f1f5ff",
          minHeight: 400,
          display: isMobile && selectedConversationId ? "none" : "block",
        }}>
          <h3 style={{ marginTop: 0 }}>Conversations</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              background: filter === "all" ? "#2563eb" : "#1e293b",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            All
          </button>
          <button
          onClick={() => setFilter("pending")}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            background: filter === "pending" ? "#2563eb" : "#1e40af",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Pending
        </button>
          <button
        onClick={() => setFilter("sent")}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "none",
          background: filter === "sent" ? "#2563eb" : "#1e40af",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        Sent
      </button>
          <button
          onClick={() => setFilter("paid")}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            background: filter === "paid" ? "#2563eb" : "#1e40af",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Paid
        </button>
          </div>


          {filteredConversations.length === 0 && !loading ? (
            <p>No conversations match this filter.</p>
          ) : (
            <ul style={{ paddingLeft: 0, listStyle: "none" }}>
             {filteredConversations.map((c) => {
                const isSelected = c.id === selectedConversationId;

                return (
                 <div
                    key={c.id}
                    onClick={() => loadMessages(c.id)}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      background: isSelected
                        ? "linear-gradient(135deg, #2563eb, #1e40af)"
                        : "#0f172a",
                      color: "#ffffff",
                      cursor: "pointer",
                      marginBottom: 10,
                      boxShadow: isSelected
                        ? "0 6px 20px rgba(37, 99, 235, 0.4)"
                        : "0 2px 6px rgba(0,0,0,0.2)",
                      transition: "0.2s",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>
                      Conversation #{c.id}
                    </div>

                    <div style={{ fontSize: 13, marginTop: 4, opacity: 0.8 }}>
                      {c.Parent?.phone || "Unknown"}
                    </div>

                    <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>
                      Status: {c.status} • Invoice: {
  c.invoiceStatus === "pending_verification"
    ? "🟡 Pending Verification"
    : c.invoiceStatus
}
                    </div>
                  </div>
                );
              })}
            </ul>
          )}
        </div>

        {/* Messages */}
        <div style={{
        borderRadius: 12,
        padding: 12,
        background: "#0f172a",
        color: "#ffffff",
        display: isMobile && !selectedConversationId ? "none" : "block"
      }}>
        {isMobile && selectedConversationId && (
  <button
    onClick={() => setSelectedConversationId(null)}
    style={{
      marginBottom: 10,
      padding: "6px 12px",
      borderRadius: 6,
      border: "none",
      background: "#1e293b",
      color: "#fff",
      cursor: "pointer"
    }}
  >
    ← Back
  </button>
)}
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
          {/* 👇 ADD THIS EXACTLY HERE */}
    {selectedConversation &&
      selectedConversation.invoiceStatus === "pending_verification" && (
        <button
          onClick={() => markPaid(selectedConversationId)}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          ✅ Approve Payment
        </button>
      )}
          
        </div>
      )}
      

      <div style={{
        marginTop: 16,
        display: "flex",
        gap: 10,
        paddingTop: 12,
        borderTop: "1px solid #1e293b"
      }}>
      <input
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Type reply..."
        style={{
  flex: 1,
  padding: 12,
  borderRadius: 8,
  border: "none",
  background: "#1e293b",
  color: "#ffffff"
}}
      />

      <button
            onClick={async () => {
              if (!replyText.trim()) return;

          await fetch(`${API_BASE}/admin/conversation/${selectedConversationId}/reply`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-key": import.meta.env.VITE_ADMIN_API_KEY,
            },
            body: JSON.stringify({ message: replyText }),
          });

          setReplyText("");
          await loadMessages(selectedConversationId);
        }}
        style={{
        padding: "10px 16px",
        borderRadius: 8,
        border: "none",
        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        color: "#fff",
        cursor: "pointer",
        fontWeight: 600
      }}
      >
        Send
      </button>
    </div>

          {!selectedConversationId ? (
          <div style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 20,
            borderRadius: 12,
            background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
            color: "#ffffff"
          }}>
            <div>
              <h3 style={{ marginBottom: 10 }}>💬 No Conversation Selected</h3>
              <p style={{ opacity: 0.9 }}>
                Select a conversation from the left to start chatting
              </p>
            </div>
          </div>
          ) : messagesLoading ? (
            <p>Loading messages...</p>
          ) : messagesError ? (
            <div style={{ background: "#ffe5e5", padding: 10 }}>
              {messagesError}
            </div>
          ) : messages.length === 0 ? (
            <p>No messages found.</p>
          ) : (
              <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              width: "100%"
            }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                  padding: 12,
                  borderRadius: 16,
                  background:
                    m.direction === "outbound"
                      ? "linear-gradient(135deg, #2563eb, #1e40af)"
                      : "#e2e8f0",
                  color: m.direction === "outbound" ? "#ffffff" : "#111827",
                  alignSelf:
                    m.direction === "outbound" ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                  boxShadow:
                    m.direction === "outbound"
                      ? "0 4px 12px rgba(37,99,235,0.3)"
                      : "0 2px 6px rgba(0,0,0,0.1)",
                }}
                >
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    <b>{m.direction}</b> • {m.from} •{" "}
                    {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                  </div>
                  <div style={{ marginTop: 6 }}>{m.text.startsWith("[IMAGE RECEIPT]") ? (
  <a href={m.text.replace("[IMAGE RECEIPT]: ", "")} target="_blank" rel="noreferrer">
    📄 View Receipt
  </a>
) : (
  m.text
)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
