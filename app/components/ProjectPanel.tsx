"use client";

import { useEffect, useState } from "react";
import {
  createProject,
  getProjects,
  deleteProject,
} from "../actions/project-actions";

import { useAppStore } from "@/lib/store";

const PRESET_COLORS = [
  "#6366f1",
  "#06b6d4",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#22c55e",
];

export default function ProjectPanel() {
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(true);

  const { activeProjectId, setActiveProject } = useAppStore();

  async function loadProjects() {
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function addProject() {
    if (!name.trim()) return;

    await createProject(name, color);

    setName("");
    setColor(PRESET_COLORS[0]);

    await loadProjects();
  }

  return (
    <div className="card projectCard">
      <h2>Projects</h2>

      <div className="projectList">
        {!loading && projects.length === 0 && (
          <p className="emptyState">
            No projects yet — add one below to start tracking focus time.
          </p>
        )}

        {projects.map((project) => (
          <div
            key={project.id}
            className={`project ${
              activeProjectId === project.id ? "activeProject" : ""
            }`}
            onClick={() =>
              setActiveProject(project.id, project.color, project.name)
            }
          >
            <span className="projectLabel">
              <span
                className="colorDot"
                style={{ background: project.color }}
              />
              {project.name}
            </span>

            <button
              className="deleteBtn"
              onClick={async (e) => {
                e.stopPropagation();

                await deleteProject(project.id);

                if (activeProjectId === project.id) {
                  setActiveProject("", "#6366f1", "");
                }

                await loadProjects();
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      <div className="colorPicker">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            className={`colorSwatch ${color === c ? "colorSwatchActive" : ""}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
            aria-label={`Choose color ${c}`}
          />
        ))}
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addProject()}
        placeholder="Project Name"
      />

      <button className="glassButton" onClick={addProject}>
        Add Project
      </button>
    </div>
  );
}