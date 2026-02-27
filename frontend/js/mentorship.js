document.addEventListener("DOMContentLoaded", () => {
  const messageButtons = document.querySelectorAll(".message-btn");
  const chatbox = document.querySelector(".chatbox");
  const closeBtn = document.querySelector(".close-btn");
  const chatMessages = document.querySelector(".chat-messages");
  const chatInput = document.querySelector("#chat-input");
  const sendBtn = document.querySelector("#send-btn");

  let firstMessage = true; // to trigger bot reply only once

  // Open chatbox
  messageButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      chatbox.style.display = "flex";
      chatMessages.innerHTML = "";
      firstMessage = true;
    });
  });

  // Close chatbox
  closeBtn.addEventListener("click", () => {
    chatbox.style.display = "none";
  });

  // Send user message
  function sendMessage() {
    const text = chatInput.value.trim();
    if (text === "") return;

    // Append user message
    chatMessages.innerHTML += `<div class="message user-message">${text}</div>`;
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Auto mentor reply (first message only)
    if (firstMessage) {
      setTimeout(() => {
        chatMessages.innerHTML += `<div class="message mentor-message">Hello... how can I help you ?</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 600);
      firstMessage = false;
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
