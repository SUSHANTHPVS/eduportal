import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrophyIcon, MedalIcon, AwardIcon } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const [leaderboardRes, rankRes] = await Promise.all([
          axios.get('http://localhost:5000/api/leaderboard'),
          axios.get('http://localhost:5000/api/leaderboard/my-rank', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        setLeaderboard(leaderboardRes.data);
        setUserRank(rankRes.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <TrophyIcon className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <MedalIcon className="w-6 h-6 text-gray-400" />;
      case 3:
        return <AwardIcon className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-yellow-100 border-yellow-300';
    if (rank === 2) return 'bg-gray-100 border-gray-300';
    if (rank === 3) return 'bg-amber-100 border-amber-300';
    return 'bg-white border-gray-200';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🏆 Leaderboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Top performers ranked by average exam scores
        </p>
      </div>

      {/* User's Rank Card */}
      {userRank && (
        <div className=" from-blue-500 to-purple-600 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Ranking</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {userRank.rank ? `#${userRank.rank}` : 'N/A'}
                  </div>
                  <div className="text-sm opacity-90">Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userRank.stats.totalExams}</div>
                  <div className="text-sm opacity-90">Exams Taken</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userRank.stats.averageScore}%</div>
                  <div className="text-sm opacity-90">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userRank.stats.passRate}%</div>
                  <div className="text-sm opacity-90">Pass Rate</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              {getRankIcon(userRank.rank)}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Performers
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Exams Taken
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Avg Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Highest Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Pass Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {leaderboard.map((student) => (
                <tr
                  key={student.userId}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    userRank && userRank.rank === student.rank ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRankBadgeColor(student.rank)}`}>
                      {getRankIcon(student.rank)}
                      <span className="ml-1">#{student.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {student.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {student.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {student.totalExams}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.averageScore >= 90 ? 'bg-green-100 text-green-800' :
                      student.averageScore >= 80 ? 'bg-blue-100 text-blue-800' :
                      student.averageScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.averageScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {student.highestScore}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {student.passRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No exam submissions yet. Be the first to take an exam!
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;