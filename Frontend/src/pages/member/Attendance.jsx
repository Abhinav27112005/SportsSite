import React, { useState, useEffect } from "react";
import "../../styles/Attendance.css";

export const Attendance = () => {
  const [memberID, setMemberID] = useState("");
  const [attendanceLog, setAttendanceLog] = useState([]);
  const [paidMembers, setPaidMembers] = useState(85);
  const [pendingMembers, setPendingMembers] = useState(13);

  useEffect(() => {
    const savedLog = JSON.parse(localStorage.getItem("attendanceLog"));
    if (savedLog) {
      setAttendanceLog(savedLog);
    }
  }, []);

  const markAttendance = (type) => {
    if (!memberID.trim()) return alert("Please enter a Member ID.");

    const timestamp = new Date().toLocaleString();
    const newRecord = { memberID, type, time: timestamp };

    const updatedLog = [newRecord, ...attendanceLog];
    setAttendanceLog(updatedLog);
    localStorage.setItem("attendanceLog", JSON.stringify(updatedLog));

    alert(`${type} marked for Member ID: ${memberID}`);
    setMemberID("");
  };

  // Attendance Count for mock stats
  const today = new Date().toDateString();
  const todayCount = attendanceLog.filter(log => 
    new Date(log.time).toDateString() === today && log.type === "Entry"
  ).length;

  return (
    <div className="attendance-page">
      <h2 className="attendance-title">Attendance Portal</h2>

      <div className="attendance-form">
        <input
          type="text"
          placeholder="Member ID"
          value={memberID}
          onChange={(e) => setMemberID(e.target.value)}
        />
        <div className="button-group">
          <button className="entry-btn" onClick={() => markAttendance("Entry")}>Mark Entry</button>
          <button className="exit-btn" onClick={() => markAttendance("Exit")}>Mark Exit</button>
        </div>
      </div>

      <div className="stats-cards">
        <div className="card">
          <h3>Member Statistics</h3>
          <p>Total Members: <strong>120</strong></p>
          <p>Active Members: <strong>98</strong></p>
          <p>New Joiners: <strong>15</strong></p>
        </div>

        <div className="card">
          <h3>Attendance Tracker</h3>
          <p>Today's Attendance: <strong>{todayCount}/98</strong></p>
          <p>Weekly Average: <strong>78%</strong></p>
        </div>

        <div className="card">
          <h3>Payment Status</h3>
          <p>Paid: <strong className="paid">{paidMembers}</strong></p>
          <p>Pending: <strong className="pending">{pendingMembers}</strong></p>
        </div>
      </div>
    </div>
  );
};
