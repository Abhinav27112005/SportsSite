import React from "react";
import "../../styles/Coaching.css";
import { FaCheckCircle } from "react-icons/fa";

export const Coaching = () => {
  const programs = [
    {
      title: "Beginner’s Program",
      label: "Badminton Training for Beginners",
      features: ["Basic techniques", "Court movements", "Game rules"],
      color: "bg-yellow",
    },
    {
      title: "Intermediate’s Program",
      label: "Sharpen Your Skills",
      features: ["Advanced drills", "Strategic play", "Tactical movement"],
      color: "bg-blue",
    },
    {
      title: "Expert’s Program",
      label: "Train Like a Champion",
      features: ["Elite techniques", "Professional tactics", "Game endurance"],
      color: "bg-purple",
    },
  ];

  return (
    <section className="coaching-section">
      <h2 className="coaching-title">Coaching Programs</h2>
      <div className="coaching-grid">
        {programs.map((program, index) => (
          <div className="coaching-card" key={index}>
            <div className={`program-banner ${program.color}`}>
              <span>{program.label}</span>
            </div>
            <div className="program-content">
              <h3>{program.title}</h3>
              <ul>
                {program.features.map((feature, i) => (
                  <li key={i}>
                    <FaCheckCircle className="check-icon" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
