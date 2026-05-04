window.MESSENGER_CHAT_URL = "https://m.me/mnjdistributionsinc";
window.ORDER_NOTIFY_URL = "https://script.google.com/macros/s/AKfycbw1pUSvBjdKQn5AGSMrMe_NYR4FPpO6RgjB804szlGmcGZKJeU7WN0TJT3suzrm2yZa/exec";

window.getClientSessionId = function getClientSessionId() {
  const key = "mnj_client_session_id";
  let id = localStorage.getItem(key);

  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, id);
  }

  return id;
};

window.sendAdminNotification = async function sendAdminNotification(payload) {
  try {
    await fetch(window.ORDER_NOTIFY_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.warn("Admin notification failed:", error);
  }
};

window.fallbackCopyWithTextarea = function fallbackCopyWithTextarea(text) {
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "readonly");
  helper.style.position = "fixed";
  helper.style.top = "-9999px";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  helper.setSelectionRange(0, helper.value.length);
  let copied = false;
  try { copied = document.execCommand("copy"); } catch (e) { copied = false; }
  document.body.removeChild(helper);
  return copied;
};
