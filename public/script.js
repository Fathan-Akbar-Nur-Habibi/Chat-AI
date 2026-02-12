let isLoading = false;

function handleEnter(e) {
  if (e.key === "Enter" && !isLoading) send();
}

async function send() {
  if (isLoading) return;

  const input = document.getElementById("msg");
  const icon = document.getElementById("sendIcon");
  const text = input.value.trim();

  if (!text) return;

  isLoading = true;
  input.disabled = true;
  icon.src = "assets/images/square.png";

  addMessage(text, "user");
  input.value = "";

  const loadingBubble = addLoading();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    loadingBubble.remove();
    addMessage(data.reply, "ai");

  } catch {
    loadingBubble.remove();
    addMessage("Error connecting to AI", "ai");
  }

  input.disabled = false;
  input.focus();
  icon.src = "assets/images/buttonSend.jpg";
  isLoading = false;
}

function addMessage(text, type) {
  const chat = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function addLoading() {
  const chat = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.className = "message ai loading";
  div.innerHTML = "<span></span><span></span><span></span>";
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}
