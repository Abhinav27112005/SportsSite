import React from "react";
import "../../styles/Finances.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export const Finances = () => {
  const income = [
    { title: "Membership Fees", amount: "₹150,000" },
    { title: "Tournament Fees", amount: "₹75,000" },
    { title: "Coaching Fees", amount: "₹200,000" },
  ];

  const expenditure = [
    { title: "Equipment", amount: "₹100,000" },
    { title: "Maintenance", amount: "₹50,000" },
    { title: "Staff Salary", amount: "₹180,000" },
  ];

  return (
    <div className="finance-page-pro">
      <h2 className="finance-heading">Financial Overview</h2>
      <div className="finance-card-container">
        <div className="finance-card income-card">
          <h3><FaArrowUp className="icon" /> Income</h3>
          <ul>
            {income.map((item, i) => (
              <li key={i}>
                <span>{item.title}</span>
                <strong>{item.amount}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="finance-card expenditure-card">
          <h3><FaArrowDown className="icon" /> Expenditure</h3>
          <ul>
            {expenditure.map((item, i) => (
              <li key={i}>
                <span>{item.title}</span>
                <strong>{item.amount}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="finance-details">
        <p>Here's a categorized summary of the financial structure of the institute:</p>
        <div className="finance-lists">
          <div>
            <h4>Income</h4>
            <ul>
              <li>Membership Fees</li>
              <li>Tournament Fees</li>
              <li>Coaching Fees</li>
            </ul>
          </div>
          <div>
            <h4>Expenditure</h4>
            <ul>
              <li>Equipment</li>
              <li>Maintenance</li>
              <li>Staff Salary</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
