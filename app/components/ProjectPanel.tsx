"use client";

import { useState } from "react";

export default function ProjectPanel() {
  const [projects, setProjects] = useState([
    "Focus Protocol",
    "Maths",
    "Chemistry"
  ]);

  const addProject = () => {
    const name = prompt("Project Name");

    if (!name) return;

    setProjects([...projects, name]);
  };

  return (
    <div className="card">
      <h2>Projects</h2>

      {projects.map((project) => (
        <div
          key={project}
          className="project"
        >
          {project}
        </div>
      ))}

      <button
        className="addBtn"
        onClick={addProject}
      >
        + Add Project
      </button>
    </div>
  );
}