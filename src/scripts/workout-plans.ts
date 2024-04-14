import { emojiBlast, emojiBlasts } from "emoji-blast";

let activeRestInterval: number | null = null;
let activeRestKeys = new Set<string>();

const lastActiveDate =
  localStorage.getItem("lastActiveDate") ?? new Date().toDateString();

// Function to update the countdown display
const updateCountdownDisplay = (
  countdownElement: HTMLElement,
  timeLeft: number
) => {
  if (timeLeft <= 0) {
    clearInterval(activeRestInterval as number);
    activeRestInterval = null;

    localStorage.setItem(
      "activeRestKeys",
      JSON.stringify(Array.from(activeRestKeys))
    );
    countdownElement.textContent = "";
    countdownElement.classList.add("hidden");

    emojiBlast({ emojis: ["🏋️"] });

    // Send push notification after the rest period
    showNotification();
  } else {
    countdownElement.textContent = `Rest: ${(timeLeft / 1000).toFixed(0)} seconds`;
  }
};

// Function to start the rest period
const startRest = (
  exerciseName: string,
  setIndex: number,
  badgeElement: HTMLElement
) => {
  const key = `${exerciseName}-${setIndex}`;

  if (activeRestInterval) {
    clearInterval(activeRestInterval);
    activeRestInterval = null;
  }

  badgeElement.classList.add("bg-primary");
  activeRestKeys.add(key);
  localStorage.setItem(
    "activeRestKeys",
    JSON.stringify(Array.from(activeRestKeys))
  );

  const endTime = Date.now() + 60000;
  const countdownElement = document.getElementById("countdownTimer");
  countdownElement?.classList.remove("hidden");
  updateCountdownDisplay(countdownElement as HTMLElement, 60000);

  activeRestInterval = window.setInterval(() => {
    const timeLeft = endTime - Date.now();
    updateCountdownDisplay(countdownElement as HTMLElement, timeLeft);
  }, 1000);
};

// Function to restore UI state from localStorage on page load
const restoreUIState = () => {
  if (localStorage.getItem("golden-seven-finished")) {
    localStorage.clear();
  }

  if (lastActiveDate !== new Date().toDateString()) {
    localStorage.clear();
    localStorage.setItem("lastActiveDate", new Date().toDateString());
  }

  const activeKeys = JSON.parse(localStorage.getItem("activeRestKeys") ?? "[]");
  activeRestKeys = new Set(activeKeys);
  activeRestKeys.forEach((key) => {
    const badge = document.querySelector(`[data-key="${key}"]`);
    if (badge) {
      badge.classList.add("bg-primary");
    }
  });
};

// Function to attach event listeners to badges and restore UI state
const initializeEventListeners = () => {
  restoreUIState();

  document.querySelectorAll("[data-key]").forEach((badge) => {
    badge.addEventListener("click", function handleClick() {
      if (badge.classList.contains("bg-primary")) {
        return; // Ignore click if badge is already active
      }
      const [exerciseName, setIndexStr] =
        badge.getAttribute("data-key")?.split("-") ?? [];
      if (exerciseName && setIndexStr) {
        startRest(
          exerciseName,
          parseInt(setIndexStr, 10),
          badge as HTMLElement
        );
      }
    });
  });

  const finishWorkoutButton = document.getElementById("finishWorkoutButton");
  finishWorkoutButton?.addEventListener("click", finishWorkout);
};

const showNotification = () => {
  if (Notification.permission === "granted") {
    navigator.serviceWorker.getRegistration().then((registration) => {
      registration?.showNotification("Hello from Your PWA!", {
        body: "Here is the notification body.",
        icon: "../../public/apple-touch-icon.png",
        tag: "pwa-notification", // Use tag to manage notifications
      });
    });
  }
};

const finishWorkout = () => {
  const formattedTitle = document.title.toLowerCase().replace(/\s+/g, "-");
  localStorage.setItem(`${formattedTitle}-finished`, "true");
  emojiBlasts({ emojis: ["🎉💪🥳"] });

  setTimeout(() => {
    window.location.href = "/workouts";
  }, 10000);
};

// Run the initialization function once the DOM is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeEventListeners);
} else {
  initializeEventListeners();
}
