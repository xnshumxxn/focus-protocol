"use client";

import { useEffect, useState } from "react";

export default function Timer() {
  const [seconds, setSeconds] = useState(1500);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (running && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running, seconds]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  return (
    <div className="timerCard">

      <h2>Focus Session</h2>

      <div className="timer">
        {formatTime()}
      </div>

      <div className="presetRow">
        <button onClick={() => setSeconds(1500)}>
          25m
        </button>

        <button onClick={() => setSeconds(3000)}>
          50m
        </button>

        <button onClick={() => setSeconds(5400)}>
          90m
        </button>
      </div>

      <div className="controls">
        <button
          className="start"
          onClick={() => setRunning(true)}
        >
          Start
        </button>

        <button
          className="pause"
          onClick={() => setRunning(false)}
        >
          Pause
        </button>

        <button
          className="reset"
          onClick={() => {
            setRunning(false);
            setSeconds(1500);
          }}
        >
          Reset
        </button>
      </div>

      <div className="breaks">
        <button onClick={() => setSeconds(300)}>
          Short Break
        </button>

        <button onClick={() => setSeconds(900)}>
          Long Break
        </button>
      </div>

    </div>
  );
}