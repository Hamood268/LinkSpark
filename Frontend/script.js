async function shortenURL(originalUrl) {
  try {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: originalUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Form submission handler
document.getElementById("urlForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const originalUrl = document.getElementById("originalUrl").value;
  const shortenBtn = document.getElementById("shortenBtn");
  const resultBox = document.getElementById("resultBox");

  // Validate URL format
  if (!isValidURL(originalUrl)) {
    showError("Please enter a valid URL");
    return;
  }

  // Show loading state
  setLoadingState(true);

  // Call the API
  shortenURL(originalUrl)
    .then((response) => {
      displayResults(originalUrl, response);
      setLoadingState(false);
    })
    .catch((error) => {
      showError("Failed to shorten URL. Please try again.");
      setLoadingState(false);
      console.error("API Error:", error);
    });
});

// Display results in the result box
function displayResults(originalUrl, response) {
  const resultBox = document.getElementById("resultBox");

  // Update original URL display
  document.getElementById(
    "originalUrlDisplay"
  ).innerHTML = `${originalUrl} <button class="copy-btn" onclick="copyToClipboard('originalUrlDisplay')">Copy</button>`;

  // Update shortened URL display
  document.getElementById(
    "shortenedUrlDisplay"
  ).innerHTML = `${response.shortenedUrl} <button class="copy-btn" onclick="copyToClipboard('shortenedUrlDisplay')">Copy</button>`;

  // Calculate and display statistics
  const savedChars = Math.max(
    originalUrl.length - response.shortenedUrl.length,
    0
  );
  document.getElementById("savedChars").textContent = savedChars;
  document.getElementById("clickCount").textContent = response.clicks || 0;
  document.getElementById("createdDate").textContent = formatDate(
    response.createdAt
  );

  // Show result box with animation
  resultBox.classList.add("show");
}

// Copy to clipboard functionality
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  const text = element.textContent.replace("Copy", "").trim();

  navigator.clipboard
    .writeText(text)
    .then(() => {
      // Show success feedback
      const button = element.querySelector(".copy-btn");
      showCopyFeedback(button);
    })
    .catch((err) => {
      // Fallback for older browsers
      fallbackCopyToClipboard(text);
      const button = element.querySelector(".copy-btn");
      showCopyFeedback(button);
    });
}

// Show copy success feedback
function showCopyFeedback(button) {
  const originalText = button.textContent;
  const originalBackground = button.style.background;

  button.textContent = "Copied!";
  button.style.background = "#4CAF50";
  button.style.borderColor = "#4CAF50";

  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = originalBackground;
    button.style.borderColor = "#ffd700";
  }, 2000);
}

// Fallback copy method for older browsers
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Fallback copy failed:", err);
  }

  document.body.removeChild(textArea);
}

// Set loading state for the submit button
function setLoadingState(isLoading) {
  const shortenBtn = document.getElementById("shortenBtn");

  if (isLoading) {
    shortenBtn.innerHTML = '<div class="loading"></div> Shortening...';
    shortenBtn.disabled = true;
  } else {
    shortenBtn.innerHTML = "✨ Shorten URL";
    shortenBtn.disabled = false;
  }
}

// Show error message
function showError(message) {
  // Create error message element
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.cssText = `
        background: rgba(255, 0, 0, 0.1);
        border: 2px solid rgba(255, 0, 0, 0.3);
        color: #ff6b6b;
        padding: 15px;
        border-radius: 10px;
        margin-top: 20px;
        text-align: center;
        animation: errorSlideIn 0.5s ease-out;
    `;
  errorDiv.textContent = message;

  // Add error animation keyframes
  if (!document.querySelector("#error-animations")) {
    const style = document.createElement("style");
    style.id = "error-animations";
    style.textContent = `
            @keyframes errorSlideIn {
                0% { opacity: 0; transform: translateY(-20px); }
                100% { opacity: 1; transform: translateY(0); }
            }
        `;
    document.head.appendChild(style);
  }

  // Insert error message
  const container = document.querySelector(".container");
  const existingError = container.querySelector(".error-message");

  if (existingError) {
    existingError.remove();
  }

  container.appendChild(errorDiv);

  // Remove error message after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
}

// Validate URL format
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return "Today";
  } else if (diffDays === 2) {
    return "Yesterday";
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// Reset form and hide results
function resetForm() {
  document.getElementById("urlForm").reset();
  document.getElementById("resultBox").classList.remove("show");

  // Remove any error messages
  const errorMessage = document.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  console.log("LinkSpark URL Shortener initialized");

  // Add input validation
  const urlInput = document.getElementById("originalUrl");
  urlInput.addEventListener("input", function () {
    // Remove error styling on input
    const errorMessage = document.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  });

  // Add keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      document.getElementById("urlForm").dispatchEvent(new Event("submit"));
    }

    // Escape to reset form
    if (e.key === "Escape") {
      resetForm();
    }
  });
});
