"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppStore } from "@/lib/store";

import { useRef } from "react";

export default function Timer() {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(1500);
  const [running, setRunning] = useState(false);
  const sessionSaved = useRef(false);
  const { activeProjectId } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
if (prev <= 1) {

  setRunning(false);

  if (
    activeProjectId &&
    !sessionSaved.current
  ) {

    sessionSaved.current = true;

    fetch("/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: activeProjectId,
        duration: minutes * 60,
      }),
    }).then(() => router.refresh());
  }

  return 0;
}

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, activeProjectId, minutes]);

  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;

    return `${String(mins).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  const applyCustomTime = () => {
    sessionSaved.current = false;
    const total = minutes * 60;
    setSecondsLeft(total);
    setRunning(false);
  };

  return (
    <div className="timerCard">
      <div className="timerGlow" />

      <h2>Focus Session</h2>

      <div className="timerDisplay">
        {formatTime()}
      </div>

      <div className="customTime">
        <input
          type="number"
          value={minutes}
          min={1}
          max={300}
          onChange={(e) =>
            setMinutes(Number(e.target.value))
          }
        />

        <button
          className="glassButton"
          onClick={applyCustomTime}
        >
          Set Minutes
        </button>
      </div>

      <div className="controls">
        <button
          className="primaryButton"
          onClick={() => setRunning(true)}
        >
          Start
        </button>

        <button
          className="glassButton"
          onClick={() => setRunning(false)}
        >
          Pause
        </button>

        <button
          className="glassButton"
          onClick={() => {
            sessionSaved.current = false;
            setRunning(false);
            setSecondsLeft(minutes * 60);
          }}
        >
          Reset
        </button>
      </div>

      {!activeProjectId && (
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            opacity: 0.7,
          }}
        >
          Select a project before starting.
        </p>
      )}
    </div>
  );
}