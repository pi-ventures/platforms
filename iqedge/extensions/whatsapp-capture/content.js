// ─── IQEdge WhatsApp Capture Extension ───────────────────────────────────────
// Adds a floating "Save to IQEdge" button on WhatsApp Web.
// When clicked, captures the current chat's contact info and recent messages,
// then sends them to IQEdge API for contact creation + enrichment.

(function () {
  const IQEDGE_API = "http://localhost:3000/api/v1"; // Update with production URL
  let currentPanel = null;

  // ─── INJECT FLOATING BUTTON ──────────────────────────────────────────────

  function injectButton() {
    if (document.getElementById("iqedge-capture-btn")) return;

    const btn = document.createElement("div");
    btn.id = "iqedge-capture-btn";
    btn.innerHTML = `
      <div class="iqedge-fab" title="Save to IQEdge CRM">
        <span class="iqedge-fab-icon">IQ</span>
      </div>
    `;
    btn.addEventListener("click", handleCapture);
    document.body.appendChild(btn);
  }

  // ─── CAPTURE CURRENT CHAT ───────────────────────────────────────────────

  async function handleCapture() {
    const chatInfo = extractChatInfo();

    if (!chatInfo) {
      showNotification("Open a chat first", "error");
      return;
    }

    showPanel(chatInfo);
  }

  // ─── EXTRACT CHAT INFO FROM DOM ─────────────────────────────────────────

  function extractChatInfo() {
    // Get the active chat header
    const header = document.querySelector("header._amid");
    if (!header) return null;

    // Contact/Group name
    const nameEl = header.querySelector("span[dir='auto']");
    const name = nameEl ? nameEl.textContent.trim() : null;

    // Phone number (shown in header or info panel)
    const phoneEl = header.querySelector("span[title]");
    let phone = phoneEl ? phoneEl.getAttribute("title") : null;

    // Try to get phone from the chat info if not in header
    if (!phone || phone === name) {
      // The phone might be in the contact info section
      const infoSpans = document.querySelectorAll("span.selectable-text");
      for (const span of infoSpans) {
        const text = span.textContent || "";
        if (/^\+?\d[\d\s-]{8,}$/.test(text.trim())) {
          phone = text.trim();
          break;
        }
      }
    }

    // Extract recent messages (last 20)
    const messages = [];
    const msgEls = document.querySelectorAll("[data-id]");
    const recentMsgs = Array.from(msgEls).slice(-20);

    for (const el of recentMsgs) {
      const dataId = el.getAttribute("data-id") || "";
      const isOutgoing = dataId.startsWith("true_");
      const textEl = el.querySelector("span.selectable-text");
      const timeEl = el.querySelector("span[data-testid='msg-time']");

      if (textEl) {
        messages.push({
          direction: isOutgoing ? "outbound" : "inbound",
          text: textEl.textContent.trim(),
          time: timeEl ? timeEl.textContent.trim() : null,
        });
      }
    }

    return { name, phone, messages, capturedAt: new Date().toISOString() };
  }

  // ─── SHOW CAPTURE PANEL ─────────────────────────────────────────────────

  function showPanel(chatInfo) {
    if (currentPanel) currentPanel.remove();

    const panel = document.createElement("div");
    panel.id = "iqedge-panel";
    panel.className = "iqedge-panel";
    panel.innerHTML = `
      <div class="iqedge-panel-header">
        <span>Save to IQEdge CRM</span>
        <span class="iqedge-close" id="iqedge-close">&times;</span>
      </div>
      <div class="iqedge-panel-body">
        <div class="iqedge-field">
          <label>Name</label>
          <input type="text" id="iqedge-name" value="${chatInfo.name || ""}" />
        </div>
        <div class="iqedge-field">
          <label>Phone</label>
          <input type="text" id="iqedge-phone" value="${chatInfo.phone || ""}" />
        </div>
        <div class="iqedge-field">
          <label>Tags (comma separated)</label>
          <input type="text" id="iqedge-tags" placeholder="lead, tier1, mumbai" />
        </div>
        <div class="iqedge-field">
          <label>Notes</label>
          <textarea id="iqedge-notes" rows="3" placeholder="Add notes about this contact..."></textarea>
        </div>
        <div class="iqedge-info">
          ${chatInfo.messages.length} messages captured
        </div>
        <div class="iqedge-actions">
          <button class="iqedge-btn-search" id="iqedge-search">Search in DB</button>
          <button class="iqedge-btn-save" id="iqedge-save">Save & Enrich</button>
        </div>
        <div id="iqedge-results" class="iqedge-results"></div>
      </div>
    `;

    document.body.appendChild(panel);
    currentPanel = panel;

    // Close button
    document.getElementById("iqedge-close").addEventListener("click", () => {
      panel.remove();
      currentPanel = null;
    });

    // Search button — searches against 500M contacts
    document.getElementById("iqedge-search").addEventListener("click", async () => {
      const name = document.getElementById("iqedge-name").value;
      const phone = document.getElementById("iqedge-phone").value;
      const query = phone || name;

      if (!query) return;

      const resultsDiv = document.getElementById("iqedge-results");
      resultsDiv.innerHTML = '<div class="iqedge-loading">Searching 500M records...</div>';

      try {
        const res = await fetch(`${IQEDGE_API}/contacts/search?q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();

        if (data.results && data.results.length > 0) {
          resultsDiv.innerHTML = data.results
            .map(
              (r) => `
            <div class="iqedge-result-item">
              <strong>${r.name || "Unknown"}</strong>
              <div>${r.phone || ""} ${r.email || ""}</div>
              <div>${r.city || ""} ${r.state || ""}</div>
              <span class="iqedge-source">${r.source}</span>
            </div>
          `
            )
            .join("");
        } else {
          resultsDiv.innerHTML = '<div class="iqedge-no-results">No matches found — will create new contact</div>';
        }
      } catch (err) {
        resultsDiv.innerHTML = '<div class="iqedge-error">Search failed — check API connection</div>';
      }
    });

    // Save button — creates contact + queues enrichment
    document.getElementById("iqedge-save").addEventListener("click", async () => {
      const name = document.getElementById("iqedge-name").value;
      const phone = document.getElementById("iqedge-phone").value;
      const tags = document.getElementById("iqedge-tags").value;
      const notes = document.getElementById("iqedge-notes").value;

      if (!name && !phone) {
        showNotification("Name or phone required", "error");
        return;
      }

      try {
        const res = await fetch(`${IQEDGE_API}/contacts/capture`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone,
            tags: tags ? tags.split(",").map((t) => t.trim()) : [],
            notes,
            messages: chatInfo.messages,
            source: "whatsapp_web",
          }),
        });

        if (res.ok) {
          showNotification("Saved to IQEdge! Enrichment queued.", "success");
          panel.remove();
          currentPanel = null;
        } else {
          showNotification("Save failed", "error");
        }
      } catch (err) {
        showNotification("API connection failed", "error");
      }
    });
  }

  // ─── NOTIFICATION TOAST ─────────────────────────────────────────────────

  function showNotification(text, type) {
    const toast = document.createElement("div");
    toast.className = `iqedge-toast iqedge-toast-${type}`;
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // ─── INIT ───────────────────────────────────────────────────────────────

  // Wait for WhatsApp Web to fully load
  const observer = new MutationObserver(() => {
    if (document.querySelector("#app")) {
      injectButton();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Also try immediately
  setTimeout(injectButton, 2000);
})();
