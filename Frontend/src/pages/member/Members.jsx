import React, { useState } from 'react';
import '../../styles/Members.css';

export const Members = () => {
  const [members, setMembers] = useState([
    { name: 'Alice Johnson', id: 'M001', payment: 'Paid', attendance: '95%' },
    { name: 'Bob Smith', id: 'M002', payment: 'Unpaid', attendance: '80%' },
    { name: 'Charlie Davis', id: 'M003', payment: 'Paid', attendance: '85%' },
    { name: 'Dana Lee', id: 'M004', payment: 'Paid', attendance: '90%' },
    { name: 'Ethan Wright', id: 'M005', payment: 'Unpaid', attendance: '70%' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    id: '',
    payment: 'Paid',
    attendance: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.id || !formData.attendance) return;
    setMembers([...members, formData]);
    setFormData({ name: '', id: '', payment: 'Paid', attendance: '' });
  };

  const handleDelete = (id) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  return (
    <div className="members-page">
      <h1>Our Members</h1>

      {/* Add Member Form */}
      <form className="add-member-form" onSubmit={handleAddMember}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="id"
          placeholder="Membership ID"
          value={formData.id}
          onChange={handleChange}
          required
        />
        <select name="payment" value={formData.payment} onChange={handleChange}>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
        <input
          type="text"
          name="attendance"
          placeholder="Attendance (e.g. 90%)"
          value={formData.attendance}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Member</button>
      </form>

      {/* Members Table */}
      <table className="members-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Membership ID</th>
            <th>Payment Status</th>
            <th>Attendance</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.id}</td>
              <td className={member.payment.toLowerCase()}>{member.payment}</td>
              <td>{member.attendance}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(member.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
