"use client";

import { useEffect, useState } from "react";
import {
  createProject,
  getProjects,
} from "../actions/project-actions";

export default function ProjectPanel() {
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");

  async function loadProjects() {
    const data = await getProjects();
    setProjects(data);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function addProject() {
    if (!name.trim()) return;

    await createProject(name);

    setName("");

    await loadProjects();
  }

  return (
    <div className="card">

      <h2>Projects</h2>

      <div className="projectList">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project"
          >
            {project.name}
          </div>
        ))}
      </div>

      <input
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        placeholder="Project Name"
      />

      <button
        className="glassButton"
        onClick={addProject}
      >
        Add Project
      </button>

    </div>
  );
}