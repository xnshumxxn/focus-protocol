"use client";

import { useEffect, useState } from "react";
import {
  createProject,
  getProjects,
  deleteProject,
} from "../actions/project-actions";

import { useAppStore } from "@/lib/store";

export default function ProjectPanel() {
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");

  const {
    activeProjectId,
    setActiveProjectId,
  } = useAppStore();

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
  <div className="card projectCard">

      <h2>Projects</h2>

      <div className="projectList">

        {projects.map((project) => (

<div
  key={project.id}
  className={`project ${
    activeProjectId === project.id
      ? "activeProject"
      : ""
  }`}
  onClick={() =>
    setActiveProjectId(project.id)
  }
>

  <span>
    {project.name}
  </span>

  <button
    className="deleteBtn"
    onClick={async (e) => {

      e.stopPropagation();

      await deleteProject(project.id);

      if (
        activeProjectId === project.id
      ) {
        setActiveProjectId("");
      }

      await loadProjects();
    }}
  >
    🗑
  </button>

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