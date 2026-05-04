window.MESSENGER_CHAT_URL = "https://m.me/mnjdistributionsinc";

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
