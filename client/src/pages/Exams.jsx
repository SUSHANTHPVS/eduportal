import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Exams = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const fetchExams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exams');
      console.log('Fetched exams for students:', response.data);
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exams/user/submissions');
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const hasSubmitted = (examId) => {
    return submissions.some(sub => sub.examId._id === examId);
  };

  const getSubmissionStatus = (examId) => {
    const submission = submissions.find(sub => sub.examId._id === examId);
    return submission ? { status: submission.status, score: submission.percentage } : null;
  };

  if (loading) {
    return <div className="text-center py-8">Loading exams...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Exams
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => {
          const submissionInfo = getSubmissionStatus(exam._id);
          const submitted = hasSubmitted(exam._id);

          return (
            <div key={exam._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {exam.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {exam.description}
              </p>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{exam.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Marks:</span>
                  <span>{exam.totalMarks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty:</span>
                  <span className={`capitalize ${
                    exam.difficulty === 'Easy' ? 'text-green-600' :
                    exam.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {exam.difficulty}
                  </span>
                </div>
              </div>

              {submitted ? (
                <div className="text-center">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    submissionInfo.status === 'passed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {submissionInfo.status === 'passed' ? 'Passed' : 'Failed'} - {submissionInfo.score.toFixed(1)}%
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Already submitted
                  </p>
                  <button
                    onClick={() => navigate(`/exams/${exam._id}`)}
                    className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg"
                  >
                    Review Exam
                  </button>
                </div>
              ) : user ? (
                <button
                  onClick={() => navigate(`/exams/${exam._id}`)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                  Take Exam
                </button>
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-300">
                  Login to take exam
                </p>
              )}
            </div>
          );
        })}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            No exams available at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default Exams;