import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Briefcase, Users, ChartBar, Bell } from 'lucide-react';
import { getEmployees, getDepartments, getActivities } from '../api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { UserCheck, Edit, Trash, Clock } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeDepartments: 0,
    activeEmployees: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [employeeGrowthData, setEmployeeGrowthData] = useState([]);
  const [departmentDistribution, setDepartmentDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setRecentActivities(response.data.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, departmentsRes] = await Promise.all([getEmployees(), getDepartments()]);
        const employees = employeesRes.data.data;
        const departments = departmentsRes.data.data;

        setStats({
          totalEmployees: employees.length,
          activeDepartments: departments.length,
          activeEmployees: employees.filter(emp => emp.status === 'Active').length
        });

        // Generate Employee Growth data
        const growthData = employees.reduce((acc, emp) => {
          const month = new Date(emp.joiningDate).toLocaleString('default', { month: 'short' });
          const year = new Date(emp.joiningDate).getFullYear();
          const monthYear = `${month}-${year}`;

          if (!acc[monthYear]) acc[monthYear] = 0;
          acc[monthYear] += 1;

          return acc;
        }, {});

        const formattedGrowthData = Object.entries(growthData)
          .map(([monthYear, count]) => ({
            month: monthYear,
            count: count,
          }))
          .sort((a, b) => {
            const [monthA, yearA] = a.month.split('-');
            const [monthB, yearB] = b.month.split('-');
            return new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`);
          });

        setEmployeeGrowthData(formattedGrowthData);

        // Generate Department Distribution data - FIXED VERSION
        const departmentEmployees = new Map();
        
        // Initialize all departments with 0 employees
        departments.forEach(dept => {
          departmentEmployees.set(dept.name, {
            department: dept.name,
            count: 0,
            activeCount: 0
          });
        });

        // Count employees in each department
        employees.forEach(employee => {
          if (employee.department && departmentEmployees.has(employee.department)) {
            const deptStats = departmentEmployees.get(employee.department);
            deptStats.count += 1;
            if (employee.status === 'Active') {
              deptStats.activeCount += 1;
            }
          }
        });

        const departmentDistributionData = Array.from(departmentEmployees.values())
          .filter(dept => dept.count > 0) // Only show departments with employees
          .sort((a, b) => b.count - a.count); // Sort by total count descending

        setDepartmentDistribution(departmentDistributionData);

        await fetchActivities();
      } catch (error) {
        setError('Failed to fetch statistics');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const pollInterval = setInterval(fetchActivities, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200">
      <div className="container mx-auto px-6 py-10">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-xl p-8 mb-10">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-5">Welcome to Employee Management System</h1>
            <p className="text-xl">
              Hello, {user?.name || user?.email}! Your workforce management hub.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white rounded-lg shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Employees</h3>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.totalEmployees}</p>
            <p className="text-sm text-gray-500 mt-2">Across all departments</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Active Departments</h3>
              <Briefcase className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.activeDepartments}</p>
            <p className="text-sm text-gray-500 mt-2">Operational units</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Active Employees</h3>
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.activeEmployees}</p>
            <p className="text-sm text-gray-500 mt-2">Currently working</p>
          </div>
        </div>

        {/* Employee Growth Chart */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 mb-10">
          <h3 className="text-xl font-semibold mb-5">Employee Growth (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={employeeGrowthData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution Chart */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 mb-10">
          <h3 className="text-xl font-semibold mb-5">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentDistribution}>
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Total Employees" fill="#82ca9d" barSize={50} />
              <Bar dataKey="activeCount" name="Active Employees" fill="#8884d8" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions and Recent Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Quick Actions</h3>
              <ChartBar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-4">
              <Link
                to="/dashboard"
                className="block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Go to Dashboard
              </Link>
              <button className="block w-full text-center bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-300">
                View Reports
              </button>
              <button className="block w-full text-center bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all duration-300">
                Team Calendar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Recent Activities</h3>
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No recent activities</div>
              ) : (
                recentActivities.map((activity) => (
                  <div
                    key={activity._id}
                    className="flex items-center border-l-4 border-blue-600 pl-4 py-4 transition-all hover:bg-gray-100 rounded-lg"
                  >
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex justify-center items-center mr-4">
                      {activity.action === 'CREATE' && <UserCheck className="h-6 w-6 text-blue-600" />}
                      {activity.action === 'UPDATE' && <Edit className="h-6 w-6 text-yellow-600" />}
                      {activity.action === 'DELETE' && <Trash className="h-6 w-6 text-red-600" />}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {activity.action === 'CREATE' && 'New Employee Added'}
                        {activity.action === 'UPDATE' && 'Employee Updated'}
                        {activity.action === 'DELETE' && 'Employee Removed'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs text-white">{activity.performedBy?.name?.[0] || activity.performedBy?.email[0]}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          by {activity.performedBy?.name || activity.performedBy?.email}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500" title={new Date(activity.timestamp).toLocaleString()}>
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                    </div>

                    <div className="ml-4 text-xs text-gray-400 hidden sm:block">
                      <Clock className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;