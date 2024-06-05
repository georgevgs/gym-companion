import { emojiBlast, emojiBlasts } from "emoji-blast";

let activeRestInterval: number | null = null;
let activeRestKeys = new Set<string>();
let wakeLock: WakeLockSentinel | null = null;
let isWakeLockActive = false;
let audioPlayer: HTMLAudioElement;

const lastActiveDate =
  localStorage.getItem("lastActiveDate") ?? new Date().toDateString();

const loadBoxingBellSound = (): void => {
  const boxingBellSoundPath = "/sounds/boxing-bell.mp3";
  audioPlayer = new Audio(boxingBellSoundPath);
  audioPlayer.load();
};

const updateCountdownDisplay = (
  countdownElement: HTMLElement,
  timeLeft: number
): void => {
  const numberSpan = countdownElement.querySelector(
    ".countdown > span"
  ) as HTMLElement;
  if (!numberSpan) {
    console.error("Number span not found");
    return;
  }

  if (timeLeft <= 0) {
    clearInterval(activeRestInterval as number);
    activeRestInterval = null;

    localStorage.setItem(
      "activeRestKeys",
      JSON.stringify(Array.from(activeRestKeys))
    );

    countdownElement.classList.add("hidden");

    emojiBlast({ emojis: ["🏋️"] });

    showNotification();

    audioPlayer
      .play()
      .catch((error) => console.error("Audio play failed:", error));
  } else {
    numberSpan.style.setProperty("--value", (timeLeft / 1000).toFixed(0));
  }
};

const startRest = async (
  exerciseName: string,
  setIndex: number,
  badgeElement: HTMLElement
): Promise<void> => {
  const key = `${exerciseName}-${setIndex}`;

  if (activeRestInterval) {
    clearInterval(activeRestInterval);
    activeRestInterval = null;
  }

  if (!isWakeLockActive) {
    wakeLock = await navigator.wakeLock.request("screen");
    isWakeLockActive = true;
  }

  badgeElement.classList.add("bg-primary");
  badgeElement.classList.add("text-slate-100");

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

const restoreUIState = (): void => {
  const isGoldenSevenFinished = localStorage.getItem("golden-seven-finished");
  if (isGoldenSevenFinished) {
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
      badge.classList.add("bg-primary", "text-slate-100");
    }
  });
};

const initializeEventListeners = (): void => {
  restoreUIState();

  document.querySelectorAll("[data-key]").forEach((badge) => {
    badge.addEventListener("click", () => {
      if (badge.classList.contains("bg-primary")) {
        return;
      }

      const [exerciseName, setIndexStr] = (
        badge.getAttribute("data-key") || ""
      ).split("-");

      if (exerciseName && setIndexStr) {
        if (!audioPlayer) {
          loadBoxingBellSound();
        }

        startRest(
          exerciseName,
          parseInt(setIndexStr, 10),
          badge as HTMLElement
        );
      }
    });
  });

  document.addEventListener("visibilitychange", async () => {
    if (wakeLock !== null && document.visibilityState === "visible") {
      wakeLock = await navigator.wakeLock.request("screen");
      isWakeLockActive = true;
    }
  });

  const finishWorkoutButton = document.getElementById("finishWorkoutButton");
  finishWorkoutButton?.addEventListener("click", finishWorkout);
};

const showNotification = (): void => {
  if (Notification.permission === "granted") {
    navigator.serviceWorker.getRegistration().then((registration) => {
      registration?.showNotification("Ready for your next set?", {
        body: "It's time to get back to work! 💪",
        icon: "/apple-touch-icon.png",
        tag: "pwa-notification",
      });
    });
  }
};

const finishWorkout = (): void => {
  const formattedTitle = document.title.toLowerCase().replace(/\s+/g, "-");
  localStorage.setItem(`${formattedTitle}-finished`, "true");

  emojiBlasts({ emojis: ["🎉💪🥳"] });

  const crowdCheerPlayer = new Audio("/sounds/crowd-cheer.mp3");
  crowdCheerPlayer
    .play()
    .catch((error) => console.error("Crowd cheer play failed:", error));

  if (wakeLock) {
    wakeLock.release().then(() => {
      wakeLock = null;
    });
    isWakeLockActive = false;
  }

  setTimeout(() => {
    window.location.href = "/workouts";
  }, 10000);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeEventListeners);
} else {
  initializeEventListeners();
}

document.addEventListener("DOMContentLoaded", () => {
  const openModalButtons = document.querySelectorAll(
    ".open-modal-button"
  ) as NodeListOf<HTMLElement>;

  openModalButtons.forEach((openModalButton, index) => {
    openModalButton.addEventListener("click", () => {
      const modalId = openModalButton.getAttribute("aria-controls");
      const modal = document.getElementById(
        modalId!
      ) as HTMLDialogElement | null;

      if (modal) {
        modal.showModal();
      }
    });
  });
});
