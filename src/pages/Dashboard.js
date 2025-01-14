import React, { useState, useEffect } from 'react';
import { getEmployees, getDepartments, createEmployee, updateEmployee, deleteEmployee } from '../api';
import EmployeeForm from '../components/EmployeeForm';
import { Search, Filter, Download, Upload, Users, Building2, UserCheck, Briefcase, ChevronDown, X } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [employeesResponse, departmentsResponse] = await Promise.all([
        getEmployees(),
        getDepartments()
      ]);
      setEmployees(employeesResponse.data.data);
      setDepartments(departmentsResponse.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      const response = await createEmployee(employeeData);
      setEmployees([...employees, response.data.data]);
      setShowForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding employee');
    }
  };

  const handleUpdateEmployee = async (employeeData) => {
    try {
      const response = await updateEmployee(selectedEmployee._id, employeeData);
      setEmployees(employees.map(emp => 
        emp._id === selectedEmployee._id ? response.data.data : emp
      ));
      setSelectedEmployee(null);
      setShowForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating employee');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting employee');
      }
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const filteredEmployees = employees
    .filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
      const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField]?.toLowerCase() || '';
      const bValue = b[sortField]?.toLowerCase() || '';
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  // Department distribution data for pie chart
  const departmentData = departments.map(dept => ({
    name: dept.name,
    value: employees.filter(emp => emp.department === dept._id).length
  }));

  const CHART_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6'];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
              <X size={20} />
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Employee Management Dashboard</h1>
              <p className="text-gray-600">Manage your workforce efficiently</p>
            </div>
            <div className="flex gap-4 mt-4 lg:mt-0">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2">
                <Download size={20} />
                Export
              </button>
              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Users size={20} />
                Add New Employee
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-600">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Departments</h3>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-600">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Employees</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(emp => emp.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-600">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Positions</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(employees.map(emp => emp.position)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Quick Statistics</h3>
            <div className="space-y-4">
              {departments.map(dept => {
                const deptEmployees = employees.filter(emp => emp.department === dept._id);
                const activeEmployees = deptEmployees.filter(emp => emp.status === 'Active');
                return (
                  <div key={dept._id} className="flex items-center justify-between">
                    <span className="text-gray-600">{dept.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                        {deptEmployees.length} total
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                        {activeEmployees.length} active
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Employee List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSortDirection(sortField === 'name' && sortDirection === 'asc' ? 'desc' : 'asc');
                        setSortField('name');
                      }}
                    >
                      <div className="flex items-center gap-2">
                        Name
                        <ChevronDown size={16} className={`transform transition-transform ${
                          sortField === 'name' && sortDirection === 'desc' ? 'rotate-180' : ''
                        }`} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {departments.find(dept => dept._id === employee.department)?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 text-xs rounded-md ${
                            employee.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(employee._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredEmployees.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No employees match the current filters or search criteria.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Employee Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-gray-900">
                  <X size={20} />
                </button>
              </div>
              <EmployeeForm
                initialData={selectedEmployee}
                onSubmit={selectedEmployee ? handleUpdateEmployee : handleAddEmployee}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
