"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { useAppStore } from "@/lib/store";

const RADIUS = 150;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Timer() {
  const [minutes, setMinutes] = useState(30);
  const [secondsLeft, setSecondsLeft] = useState(1800);
  const [totalSeconds, setTotalSeconds] = useState(1800);
  const [running, setRunning] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const sessionSaved = useRef(false);
  const { activeProjectId, activeProjectColor, activeProjectName } =
    useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);

          if (activeProjectId && !sessionSaved.current) {
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
            }).then((res) => {
              if (res.ok) {
                setToast(`Session logged · ${minutes}m on ${activeProjectName}`);
                setTimeout(() => setToast(null), 4000);
              }
              router.refresh();
            });
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, activeProjectId, activeProjectName, minutes, router]);

  useEffect(() => {
    if (running) {
      const mins = Math.floor(secondsLeft / 60);
      const secs = secondsLeft % 60;
      document.title = `${String(mins).padStart(2, "0")}:${String(
        secs
      ).padStart(2, "0")} — Focus Protocol`;
    } else {
      document.title = "Focus Protocol";
    }

    return () => {
      document.title = "Focus Protocol";
    };
  }, [running, secondsLeft]);

  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const applyCustomTime = () => {
    sessionSaved.current = false;
    const total = minutes * 60;
    setSecondsLeft(total);
    setTotalSeconds(total);
    setRunning(false);
  };

  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const ringColor = activeProjectId ? activeProjectColor : "#6366f1";

  return (
    <div className="timerCard">
      <div className="timerGlow" style={{ background: ringColor }} />

      <h2>Focus Session</h2>

      {activeProjectName && (
        <p className="activeProjectLabel">
          <span className="colorDot" style={{ background: ringColor }} />
          Tracking: {activeProjectName}
        </p>
      )}

      <div className="ringWrap">
        <svg width="320" height="320" viewBox="0 0 320 320" className="progressRing">
          <circle
            cx="160"
            cy="160"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,.07)"
            strokeWidth="10"
          />
          <circle
            cx="160"
            cy="160"
            r={RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 160 160)"
            className={running ? "ringActive" : ""}
            style={{
              transition: "stroke-dashoffset 1s linear, stroke .3s",
              filter: `drop-shadow(0 0 12px ${ringColor}aa)`,
            }}
          />
        </svg>

        <div className="timerDisplay ringCenter">{formatTime()}</div>
      </div>

      <div className="customTime">
        <input
          type="number"
          value={minutes}
          min={1}
          max={300}
          onChange={(e) => setMinutes(Number(e.target.value))}
        />

        <button className="glassButton" onClick={applyCustomTime}>
          Set Minutes
        </button>
      </div>

      <div className="controls">
        <button
          className="primaryButton"
          onClick={() => setRunning(true)}
          disabled={secondsLeft === 0}
        >
          {secondsLeft < totalSeconds && secondsLeft > 0 && !running
            ? "Resume"
            : "Start"}
        </button>

        <button className="glassButton" onClick={() => setRunning(false)}>
          Pause
        </button>

        <button
          className="glassButton"
          onClick={() => {
            sessionSaved.current = false;
            setRunning(false);
            setSecondsLeft(minutes * 60);
            setTotalSeconds(minutes * 60);
          }}
        >
          Reset
        </button>
      </div>

      {!activeProjectId && (
        <p className="selectProjectHint">Select a project before starting.</p>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}