(function () {
        // Chat bot configuration
        const config = {
          botName: "ChatBot",
          welcomeMessage: "Hello! How can I help you today?",
          apiUrl:
            "https://blt6z4ojxe.execute-api.us-east-1.amazonaws.com/dev/chat",
          // You might want to generate this dynamically
        };

        // Create chat bot UI
        function createChatBotUI() {
          const chatContainer = document.createElement("div");
          chatContainer.id = "chatbot-container";
          chatContainer.innerHTML = `
      <div id="chatbot-header">
        <h3>${config.botName}</h3>
        <button id="chatbot-toggle">×</button>
      </div>
      <div id="chatbot-messages"></div>
      <div id="chatbot-input">
        <input type="text" id="chatbot-message-input" placeholder="Type your message...">
        <button id="chatbot-send">Send</button>
      </div>
    `;
          document.body.appendChild(chatContainer);

          // Add event listeners
          document
            .getElementById("chatbot-toggle")
            .addEventListener("click", toggleChatBot);
          document
            .getElementById("chatbot-send")
            .addEventListener("click", sendMessage);
          document
            .getElementById("chatbot-message-input")
            .addEventListener("keypress", function (e) {
              if (e.key === "Enter") sendMessage();
            });

          // Display welcome message
          addMessage(config.botName, config.welcomeMessage);
        }

        // Toggle chat bot visibility
        function toggleChatBot() {
          const chatContainer = document.getElementById("chatbot-container");
          chatContainer.classList.toggle("chatbot-minimized");
        }

        // Send message
        async function sendMessage() {
          const input = document.getElementById("chatbot-message-input");
          const message = input.value.trim();
          if (message) {
            addMessage("You", message);
            input.value = "";
            showTypingIndicator();

            try {
              const myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");

              const raw = JSON.stringify({
                model_input: message,
              });

              const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
              };

              const response = await fetch(
                "https://blt6z4ojxe.execute-api.us-east-1.amazonaws.com/dev/chat",
                requestOptions
              );

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();
              // Assuming the API returns the generated text in an 'output' field
              const botResponse =
                data.completion || "Sorry, I couldn't generate a response.";

              removeTypingIndicator();
              addMessage(config.botName, botResponse);
            } catch (error) {
              console.error("Error:", error);
              removeTypingIndicator();
              addMessage(
                config.botName,
                "Sorry, I encountered an error. Please try again later."
              );
            }
          }
        }

        // Add message to chat
        function addMessage(sender, message) {
          const messagesContainer = document.getElementById("chatbot-messages");
          const messageElement = document.createElement("div");
          messageElement.className = `message-wrapper ${
            sender === "You" ? "user-message" : "bot-message"
          }`;
          const currentTime = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          messageElement.innerHTML = `
      <div class="message-header">
        <span class="sender">${sender === "You" ? "User" : "Agent"}</span>
        <span class="time">at ${currentTime}</span>
      </div>
      <div class="chatbot-message">
        <div class="message-content">${message}</div>
      </div>
    `;
          messagesContainer.appendChild(messageElement);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Show typing indicator
        function showTypingIndicator() {
          const messagesContainer = document.getElementById("chatbot-messages");
          const typingElement = document.createElement("div");
          typingElement.className = "message-wrapper bot-message";
          typingElement.innerHTML = `
      <div class="chatbot-message typing-indicator">
        <span></span><span></span><span></span>
      </div>
    `;
          messagesContainer.appendChild(typingElement);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Remove typing indicator
        function removeTypingIndicator() {
          const typingIndicator = document.querySelector(".typing-indicator");
          if (typingIndicator) typingIndicator.remove();
        }

        // Add styles
        function addStyles() {
          const style = document.createElement("style");
          style.textContent = `
      #chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        height: 400px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: white;
        display: flex;
        flex-direction: column;
        font-family: Arial, sans-serif;
        z-index: 1000;
      }
      #chatbot-header {
        background-color: #f1f1f1;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #chatbot-header h3 {
        margin: 0px;
      }
      #chatbot-messages {
        flex-grow: 1;
        overflow-y: auto;
        padding: 10px;
        display: flex;
        flex-direction: column;
      }
      #chatbot-input {
        display: flex;
        padding: 10px;
      }
      #chatbot-message-input {
        flex-grow: 1;
        margin-right: 10px;
        border-radius: 12px;
        height: 24px;
        padding: 4px;
        padding-left: 10px;
        border: 1px solid lightgray;
        outline: none;
      }
      .chatbot-minimized {
        height: 50px;
        overflow: hidden;
      }
      #chatbot-send {
        border-radius: 12px;
        background-color: #00aa14;
        border: none;
        width: 60px;
        color: white;
      }
      .message-wrapper {
        max-width: 80%;
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
      }
      .user-message {
        align-self: flex-end;
      }
      .bot-message {
        align-self: flex-start;
      }
      .chatbot-message {
        padding: 8px 12px;
        border-radius: 18px;
        line-height: 1.4;
      }
      .user-message .chatbot-message {
        background-color: #0084ff;
        color: white;
      }
      .bot-message .chatbot-message {
        background-color: #f1f0f0;
        color: black;
      }
      .message-header {
        font-size: 0.8em;
        margin-bottom: 4px;
        display: flex;
        align-items: baseline;
      }
      .user-message .message-header {
        justify-content: flex-end;
      }
      .message-header .sender {
        font-style: italic;
      }
      .message-header .time {
        font-size: 0.8em;
        margin-left: 5px;
        color: #888;
      }
      .message-content {
        width: 100%;
      }
      .typing-indicator {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 8px 12px;
        background-color: #f1f0f0;
        border-radius: 18px;
      }
      .typing-indicator span {
        height: 8px;
        width: 8px;
        background-color: #93959f;
        border-radius: 50%;
        display: inline-block;
        margin-right: 5px;
        animation: bounce 1.3s linear infinite;
      }
      .typing-indicator span:nth-child(2) {
        animation-delay: -1.1s;
      }
      .typing-indicator span:nth-child(3) {
        animation-delay: -0.9s;
        margin-right: 0;
      }
      @keyframes bounce {
        0%, 60%, 100% {
          transform: translateY(0);
        }
        30% {
          transform: translateY(-4px);
        }
      }
    `;
          document.head.appendChild(style);
        }

        // Initialize chat bot
        function init() {
          addStyles();
          createChatBotUI();
        }

        // Run the init function when the DOM is fully loaded
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", init);
        } else {
          init();
        }
      })();
