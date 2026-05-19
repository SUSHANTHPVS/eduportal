import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [charts, setCharts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user?.role === 'admin') {
          const response = await axios.get('http://localhost:5000/api/dashboard/admin');
          setStats(response.data.stats);
        } else {
          const response = await axios.get('http://localhost:5000/api/dashboard/student');
          setStats(response.data.stats);
          setCharts(response.data.charts || {});
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (!user) {
    return <div>Please login to access dashboard</div>;
  }

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Welcome to your Dashboard, {user.name}!
      </h1>

      {user.role === 'admin' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Users
            </h3>
            <p className="text-2xl font-bold text-blue-600">{stats.totalUsers || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Exams
            </h3>
            <p className="text-2xl font-bold text-green-600">{stats.totalExams || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Courses
            </h3>
            <p className="text-2xl font-bold text-purple-600">{stats.totalCourses || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Submissions
            </h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.totalSubmissions || 0}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Courses Enrolled
              </h3>
            <p className="text-2xl font-bold text-blue-600">{stats.enrolledCourses || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Exams Taken
            </h3>
            <p className="text-2xl font-bold text-green-600">{stats.totalExamsTaken || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Average Score
            </h3>
            <p className="text-2xl font-bold text-purple-600">{stats.averageScore || 0}%</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Passed Exams
            </h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.passedExams || 0}</p>
          </div>
        </div>

        {/* Visual Statistics Charts */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Score Distribution Chart */}
          {charts.scoreDistribution && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Score Distribution
              </h3>
              <Doughnut
                data={{
                  labels: Object.keys(charts.scoreDistribution),
                  datasets: [{
                    data: Object.values(charts.scoreDistribution),
                    backgroundColor: [
                      '#10B981', // Green
                      '#3B82F6', // Blue
                      '#F59E0B', // Yellow
                      '#EF4444', // Red
                      '#6B7280', // Gray
                    ],
                    borderWidth: 1,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          )}

          {/* Monthly Performance Chart */}
          {charts.monthlyPerformance && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Monthly Performance (Last 6 Months)
              </h3>
              <Line
                data={{
                  labels: charts.monthlyPerformance.map(item => item.month),
                  datasets: [
                    {
                      label: 'Exams Taken',
                      data: charts.monthlyPerformance.map(item => item.examsTaken),
                      borderColor: '#3B82F6',
                      backgroundColor: '#3B82F640',
                      yAxisID: 'y',
                    },
                    {
                      label: 'Average Score (%)',
                      data: charts.monthlyPerformance.map(item => item.averageScore),
                      borderColor: '#10B981',
                      backgroundColor: '#10B98140',
                      yAxisID: 'y1',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  scales: {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: {
                        display: true,
                        text: 'Exams Taken',
                      },
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      title: {
                        display: true,
                        text: 'Average Score (%)',
                      },
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Course Progress Chart */}
        {charts.courseProgress && charts.courseProgress.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Course Progress
            </h3>
            <Bar
              data={{
                labels: charts.courseProgress.map(course => course.courseName),
                datasets: [{
                  label: 'Progress (%)',
                  data: charts.courseProgress.map(course => course.progress),
                  backgroundColor: '#3B82F6',
                  borderColor: '#2563EB',
                  borderWidth: 1,
                }],
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: 'Progress (%)',
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </>
      )}
    </div>
  );
};

export default Dashboard;