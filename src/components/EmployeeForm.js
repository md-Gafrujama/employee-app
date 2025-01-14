// src/components/EmployeeForm.js
import React, { useState, useEffect } from 'react';
import { AiOutlineUser, AiOutlineMail, AiOutlineDollarCircle } from 'react-icons/ai';
import { FaBuilding } from 'react-icons/fa';
import { MdWork, MdCheckCircle, MdCancel } from 'react-icons/md';

const DEPARTMENTS = [
  { _id: 'HR', name: 'HR' },
  { _id: 'Development', name: 'Development' },
  { _id: 'Finance', name: 'Finance' },
  { _id: 'Marketing', name: 'Marketing' },
  { _id: 'Operations', name: 'Operations' },
  { _id: 'Sales', name: 'Sales' }
];

const EmployeeForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    status: 'Active',
    salary: ''
  });

  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        salary: initialData.salary || '',
        department: initialData.department || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      salary: Number(formData.salary)
    };
    onSubmit(submissionData);
    setSuccessMessage('Employee added successfully!'); // Show success message
    setTimeout(() => {
      setSuccessMessage(null); // Hide message after 3 seconds
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-lg shadow-lg border border-gray-300">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">{initialData ? 'Update Employee' : 'Add Employee'}</h2>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-md text-center">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Full Name</label>
          <div className="flex items-center border-2 border-indigo-300 rounded-md overflow-hidden focus-within:border-indigo-500 transition-all duration-300">
            <AiOutlineUser className="text-indigo-400 w-6 h-6 p-2" />
            <input
              type="text"
              required
              className="mt-1 w-full p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Email Address</label>
          <div className="flex items-center border-2 border-indigo-300 rounded-md overflow-hidden focus-within:border-indigo-500 transition-all duration-300">
            <AiOutlineMail className="text-indigo-400 w-6 h-6 p-2" />
            <input
              type="email"
              required
              className="mt-1 w-full p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* Department */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Department</label>
          <div className="flex items-center border-2 border-indigo-300 rounded-md overflow-hidden focus-within:border-indigo-500 transition-all duration-300">
            <FaBuilding className="text-indigo-400 w-6 h-6 p-2" />
            <select
              required
              className="mt-1 w-full p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Position */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Position</label>
          <div className="flex items-center border-2 border-indigo-300 rounded-md overflow-hidden focus-within:border-indigo-500 transition-all duration-300">
            <MdWork className="text-indigo-400 w-6 h-6 p-2" />
            <input
              type="text"
              required
              className="mt-1 w-full p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter job title"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
        </div>

        {/* Salary */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Salary</label>
          <div className="flex items-center border-2 border-indigo-300 rounded-md overflow-hidden focus-within:border-indigo-500 transition-all duration-300">
            <AiOutlineDollarCircle className="text-indigo-400 w-6 h-6 p-2" />
            <input
              type="number"
              required
              min="0"
              className="mt-1 w-full p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter salary"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-700">Employee Status</label>
          <div className="flex items-center border-2 border-indigo-300 rounded-md overflow-hidden focus-within:border-indigo-500 transition-all duration-300">
            <MdCheckCircle className="text-indigo-400 w-6 h-6 p-2" />
            <select
              className="mt-1 w-full p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center space-x-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-red-500 text-red-500 rounded-md shadow-sm text-lg font-medium bg-white hover:bg-red-50 flex items-center space-x-2 transition-all duration-200"
          >
            <MdCancel className="text-red-500 w-5 h-5" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center space-x-2 transition-all duration-200"
          >
            {initialData ? <span>Update</span> : <span>Add</span>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
