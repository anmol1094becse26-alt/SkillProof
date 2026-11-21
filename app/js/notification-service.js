/**
 * SKILLPROOF - REAL-TIME NOTIFICATION DISPATCH & UNREAD BADGES SERVICE
 * Manages badge counters, drawer dropdowns, and interactive toasts.
 */

const NotificationService = (function () {
  let isDrawerOpen = false;

  async function getUnreadCount(userId) {
    if (!userId) return 0;
    try {
      const notifications = await DBService.getNotifications(userId);
      return notifications.filter((n) => !n.isRead).length;
    } catch (e) {
      return 0;
    }
  }

  async function updateBadgeUI(userId, badgeElementId = "notif-badge") {
    const el = document.getElementById(badgeElementId);
    if (!el) return;

    const count = await getUnreadCount(userId);
    if (count > 0) {
      el.textContent = count > 9 ? "9+" : count;
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  }

  function showToast(title, message, type = "info") {
    let container = document.getElementById("skillproof-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "skillproof-toast-container";
      container.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border text-sm max-w-sm transition-all duration-300 transform translate-y-4 opacity-0 ${
      type === "success"
        ? "bg-emerald-950/90 text-emerald-100 border-emerald-600/50"
        : type === "warning"
        ? "bg-amber-950/90 text-amber-100 border-amber-600/50"
        : type === "error"
        ? "bg-rose-950/90 text-rose-100 border-rose-600/50"
        : "bg-[#0B1C30]/95 text-white border-blue-600/40"
    }`;

    const icon =
      type === "success" ? "check_circle" : type === "warning" ? "warning" : type === "error" ? "error" : "verified";

    toast.innerHTML = `
      <span class="material-symbols-outlined text-lg mt-0.5 text-blue-400">${icon}</span>
      <div class="flex-1">
        <p class="font-semibold text-xs tracking-wide uppercase opacity-90">${title}</p>
        <p class="text-xs mt-0.5 text-slate-300 leading-relaxed">${message}</p>
      </div>
      <button class="text-slate-400 hover:text-white text-xs" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-4", "opacity-0");
      toast.classList.add("translate-y-0", "opacity-100");
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove("translate-y-0", "opacity-100");
      toast.classList.add("translate-y-4", "opacity-0");
      setTimeout(() => toast.remove(), 350);
    }, 4500);
  }

  async function renderNotificationDrawer(userId, containerId = "notif-drawer-content") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="p-4 text-center text-xs text-slate-500">Loading notifications...</div>`;

    const list = await DBService.getNotifications(userId);
    if (!list || list.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-400">
          <span class="material-symbols-outlined text-3xl mb-1 text-slate-500">notifications_off</span>
          <p class="text-xs">No notifications yet.</p>
        </div>
      `;
      return;
    }

    let html = `<div class="divide-y divide-slate-100 dark:divide-slate-800">`;
    list.forEach((n) => {
      const timeAgo = formatTimeAgo(n.createdAt);
      html += `
        <div class="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-3 ${
          !n.isRead ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
        }" onclick="NotificationService.handleNotifClick('${n.notificationId}', '${n.link || ""}')">
          <span class="material-symbols-outlined text-sm mt-0.5 ${
            n.type === "shortlist"
              ? "text-emerald-500"
              : n.type === "passport"
              ? "text-blue-500"
              : "text-indigo-500"
          }">
            ${n.type === "shortlist" ? "badge" : n.type === "passport" ? "verified" : "notifications"}
          </span>
          <div class="flex-1 cursor-pointer">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-900 dark:text-white">${n.title}</span>
              <span class="text-[10px] text-slate-400">${timeAgo}</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">${n.message}</p>
          </div>
          ${
            !n.isRead
              ? `<span class="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>`
              : ""
          }
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
  }

  async function handleNotifClick(notificationId, link) {
    await DBService.markNotificationRead(notificationId);
    const user = AuthService.getCurrentUser();
    if (user) {
      updateBadgeUI(user.uid);
    }
    if (link) {
      window.location.href = link;
    }
  }

  function formatTimeAgo(isoString) {
    if (!isoString) return "just now";
    const sec = Math.floor((new Date() - new Date(isoString)) / 1000);
    if (sec < 60) return "just now";
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  return {
    getUnreadCount,
    updateBadgeUI,
    showToast,
    renderNotificationDrawer,
    handleNotifClick
  };
})();

if (typeof window !== "undefined") {
  window.NotificationService = NotificationService;
}
