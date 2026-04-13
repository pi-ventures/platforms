"use client";

import { useState, useEffect, useRef } from "react";

interface Conversation {
  id: string;
  phone: string;
  name: string | null;
  contactId: string | null;
  companyId: string | null;
  status: string;
  unreadCount: number;
  lastMessageAt: string | null;
  lastMessage: string | null;
  lastMessageDirection: string | null;
  tags: string[];
  assignedTo: string | null;
  account: string;
}

interface Message {
  id: string;
  direction: string;
  type: string;
  body: string | null;
  aiIntent: string | null;
  aiConfidence: number | null;
  status: string;
  createdAt: string;
  agentId: string | null;
}

export default function WhatsAppDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [enrichment, setEnrichment] = useState<any>(null);
  const [contactSearch, setContactSearch] = useState("");
  const [contactResults, setContactResults] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [search]);

  // Fetch messages when conversation selected
  useEffect(() => {
    if (selectedConvo) fetchMessages(selectedConvo);
  }, [selectedConvo]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchConversations() {
    const params = new URLSearchParams({ status: "active" });
    if (search) params.set("q", search);
    const res = await fetch(`/api/v1/whatsapp/conversations?${params}`);
    const data = await res.json();
    setConversations(data.items || []);
  }

  async function fetchMessages(convoId: string) {
    const res = await fetch("/api/v1/whatsapp/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: convoId, markRead: true }),
    });
    const data = await res.json();
    setMessages(data.messages || []);
    fetchConversations(); // refresh unread counts
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConvo) return;

    await fetch("/api/v1/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: selectedConvo, text: newMessage }),
    });

    setNewMessage("");
    fetchMessages(selectedConvo);
  }

  async function searchContacts() {
    if (!contactSearch.trim()) return;
    const res = await fetch(
      `/api/v1/contacts/search?q=${encodeURIComponent(contactSearch)}&limit=10`
    );
    const data = await res.json();
    setContactResults(data.results || []);
  }

  async function fetchEnrichment() {
    const res = await fetch("/api/v1/enrichment");
    setEnrichment(await res.json());
  }

  function formatTime(ts: string | null) {
    if (!ts) return "";
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  function formatPhone(phone: string) {
    if (phone.length === 12 && phone.startsWith("91")) {
      return `+91 ${phone.slice(2, 7)} ${phone.slice(7)}`;
    }
    return phone;
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", color: "#1a1a1a" }}>
      {/* Left Panel: Conversation List */}
      <div style={{ width: 360, borderRight: "1px solid #e0e0e0", display: "flex", flexDirection: "column", background: "#fff" }}>
        {/* Header */}
        <div style={{ padding: "16px", borderBottom: "1px solid #e0e0e0", background: "#075e54" }}>
          <h2 style={{ margin: 0, color: "#fff", fontSize: 18 }}>IQEdge WhatsApp AI</h2>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, padding: "8px 12px", border: "none", borderRadius: 8, fontSize: 14, outline: "none" }}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {conversations.length === 0 && (
            <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
              No conversations yet. Messages will appear here when customers contact your WhatsApp Business number.
            </div>
          )}
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedConvo(c.id)}
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #f0f0f0",
                cursor: "pointer",
                background: selectedConvo === c.id ? "#f0f6f0" : "#fff",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 48, height: 48, borderRadius: "50%", background: "#075e54",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 600, fontSize: 18, flexShrink: 0,
              }}>
                {(c.name || c.phone)?.[0]?.toUpperCase() || "?"}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: c.unreadCount > 0 ? 700 : 400, fontSize: 15 }}>
                    {c.name || formatPhone(c.phone)}
                  </span>
                  <span style={{ fontSize: 12, color: "#888" }}>
                    {formatTime(c.lastMessageAt)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                  <span style={{
                    fontSize: 13, color: "#666", overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200,
                  }}>
                    {c.lastMessageDirection === "outbound" && "You: "}
                    {c.lastMessage || "No messages"}
                  </span>
                  {c.unreadCount > 0 && (
                    <span style={{
                      background: "#25d366", color: "#fff", borderRadius: "50%",
                      width: 20, height: 20, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 11, fontWeight: 700,
                    }}>
                      {c.unreadCount}
                    </span>
                  )}
                </div>
                {c.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                    {c.tags.map((t) => (
                      <span key={t} style={{
                        fontSize: 10, background: "#e8f5e9", color: "#2e7d32",
                        padding: "1px 6px", borderRadius: 4,
                      }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enrichment Status */}
        <div style={{ padding: "8px 16px", borderTop: "1px solid #e0e0e0", background: "#f8f8f8" }}>
          <button onClick={fetchEnrichment} style={{
            width: "100%", padding: "6px", background: "#075e54", color: "#fff",
            border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12,
          }}>
            Enrichment Queue
          </button>
          {enrichment && (
            <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
              Pending: {enrichment.queue?.pending || 0} | Done: {enrichment.queue?.completed || 0}
            </div>
          )}
        </div>
      </div>

      {/* Middle Panel: Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#e5ddd5" }}>
        {!selectedConvo ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>IQEdge</div>
              <div>Select a conversation to start messaging</div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={{
              padding: "12px 16px", background: "#075e54", color: "#fff",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: "#128c7e",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 600, fontSize: 16,
              }}>
                {conversations.find((c) => c.id === selectedConvo)?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>
                  {conversations.find((c) => c.id === selectedConvo)?.name ||
                    formatPhone(conversations.find((c) => c.id === selectedConvo)?.phone || "")}
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {formatPhone(conversations.find((c) => c.id === selectedConvo)?.phone || "")}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent: m.direction === "outbound" ? "flex-end" : "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <div style={{
                    maxWidth: "65%", padding: "8px 12px", borderRadius: 8,
                    background: m.direction === "outbound" ? "#dcf8c6" : "#fff",
                    boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
                  }}>
                    <div style={{ fontSize: 14, whiteSpace: "pre-wrap" }}>{m.body || `[${m.type}]`}</div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 2 }}>
                      {m.aiIntent && (
                        <span style={{ fontSize: 10, color: "#075e54", fontStyle: "italic" }}>
                          {m.aiIntent}
                        </span>
                      )}
                      <span style={{ fontSize: 10, color: "#888" }}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {m.direction === "outbound" && (
                        <span style={{ fontSize: 10, color: m.status === "read" ? "#53bdeb" : "#888" }}>
                          {m.status === "read" ? "R" : m.status === "delivered" ? "D" : "S"}
                        </span>
                      )}
                    </div>
                    {m.agentId && (
                      <div style={{ fontSize: 10, color: "#075e54", marginTop: 2 }}>AI Agent</div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} style={{
              padding: "8px 16px", background: "#f0f0f0", display: "flex", gap: 8,
            }}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{
                  flex: 1, padding: "10px 16px", border: "none", borderRadius: 24,
                  fontSize: 14, outline: "none",
                }}
              />
              <button type="submit" style={{
                padding: "10px 20px", background: "#075e54", color: "#fff",
                border: "none", borderRadius: 24, cursor: "pointer", fontWeight: 600,
              }}>
                Send
              </button>
            </form>
          </>
        )}
      </div>

      {/* Right Panel: Contact Search + Enrichment */}
      <div style={{ width: 320, borderLeft: "1px solid #e0e0e0", display: "flex", flexDirection: "column", background: "#fff" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #e0e0e0" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: 14 }}>Contact Search (500M)</h3>
          <div style={{ display: "flex", gap: 4 }}>
            <input
              type="text"
              placeholder="Name, phone, company..."
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchContacts()}
              style={{ flex: 1, padding: "8px 10px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13 }}
            />
            <button onClick={searchContacts} style={{
              padding: "8px 12px", background: "#075e54", color: "#fff",
              border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12,
            }}>
              Search
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0" }}>
          {contactResults.map((r, i) => (
            <div key={i} style={{
              padding: "10px 16px", borderBottom: "1px solid #f0f0f0", fontSize: 13,
            }}>
              <div style={{ fontWeight: 600 }}>{r.name || r.enterprise_name || "Unknown"}</div>
              {r.phone && <div style={{ color: "#666" }}>Phone: {r.phone}</div>}
              {r.email && <div style={{ color: "#666" }}>Email: {r.email}</div>}
              {r.city && <div style={{ color: "#666" }}>{r.city}, {r.state}</div>}
              {r.website && <div style={{ color: "#666" }}>Web: {r.website}</div>}
              {r.rating && <div style={{ color: "#666" }}>Rating: {r.rating} ({r.total_ratings})</div>}
              <span style={{
                fontSize: 10, background: r.source === "gbp" ? "#e3f2fd" : r.source === "company" ? "#fce4ec" : r.source === "msme" ? "#f3e5f5" : "#e8f5e9",
                color: "#333", padding: "1px 6px", borderRadius: 4, marginTop: 4, display: "inline-block",
              }}>
                {r.source}
              </span>
            </div>
          ))}

          {contactResults.length === 0 && contactSearch && (
            <div style={{ padding: 20, textAlign: "center", color: "#888", fontSize: 13 }}>
              Search your 500M contacts database
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
