import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminExamCreate = () => {
  const { user, loading } = useAuth();
  const [examForm, setExamForm] = useState({
    title: '',
    description: '',
    duration: 30,
    totalMarks: 100,
    passingScore: 50,
    category: '',
    difficulty: 'Medium',
    instructions: '',
    isPublished: true, // Default to published
  });
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    questionType: 'MCQ',
    options: 'Option 1\nOption 2\nOption 3\nOption 4',
    correctAnswer: '',
    marks: 1,
    sequence: 1,
    input: '',
    expectedOutput: '',
    supportedLanguages: ['Java', 'C', 'C++', 'Python', 'JavaScript'],
  });
  const [createdExam, setCreatedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [existingExams, setExistingExams] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchExistingExams();
    }
  }, [user]);

  const fetchExistingExams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exams/admin/all');
      setExistingExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const fetchQuestions = async (examId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/exams/${examId}/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleExamChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExamForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguageChange = (language, checked) => {
    setQuestionForm((prev) => ({
      ...prev,
      supportedLanguages: checked
        ? [...prev.supportedLanguages, language]
        : prev.supportedLanguages.filter(lang => lang !== language),
    }));
  };

  const createExam = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating exam with data:', examForm);
      const response = await axios.post('http://localhost:5000/api/exams', examForm);
      console.log('Exam created:', response.data);
      setCreatedExam(response.data);
      setQuestions([]);
      setMessage('Exam created. You can now add questions.');
    } catch (error) {
      console.error('Exam creation failed:', error);
      setMessage(error.response?.data?.message || 'Failed to create exam');
    }
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    if (!createdExam) {
      setMessage('Create an exam first.');
      return;
    }

    const questionData = {
      questionText: questionForm.questionText,
      questionType: questionForm.questionType,
      correctAnswer: questionForm.correctAnswer,
      marks: Number(questionForm.marks),
      sequence: Number(questionForm.sequence),
    };

    // Only add options for MCQ and True/False questions
    if (questionForm.questionType === 'MCQ' || questionForm.questionType === 'True/False') {
      const options = questionForm.options
        .split('\n')
        .map((option) => option.trim())
        .filter(Boolean);
      questionData.options = options;
    }

    // Add coding-specific fields
    if (questionForm.questionType === 'Coding') {
      questionData.input = questionForm.input;
      questionData.expectedOutput = questionForm.expectedOutput;
      questionData.supportedLanguages = questionForm.supportedLanguages;
    }

    try {
      console.log('Adding question:', questionData);
      await axios.post(`http://localhost:5000/api/exams/${createdExam._id}/questions`, questionData);
      console.log('Question added successfully');
      setQuestionForm((prev) => ({
        ...prev,
        questionText: '',
        correctAnswer: '',
        marks: 1,
        input: '',
        expectedOutput: '',
      }));
      fetchQuestions(createdExam._id);
      setMessage('Question added successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add question');
    }
  };

  const handleSelectExam = (exam) => {
    setCreatedExam(exam);
    fetchQuestions(exam._id);
  };

  const togglePublishExam = async (examId, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/exams/${examId}/publish`, {
        isPublished: !currentStatus,
      });
      fetchExistingExams(); // Refresh the list
      setMessage(`Exam ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update exam status');
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-700 dark:text-gray-200">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-red-600">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Exam Builder</h1>
      {message && (
        <div className="mb-6 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-blue-900">
          {message}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Create New Exam</h2>
          <form className="space-y-4" onSubmit={createExam}>
            <input name="title" value={examForm.title} onChange={handleExamChange} required placeholder="Exam title" className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
            <textarea name="description" value={examForm.description} onChange={handleExamChange} placeholder="Exam description" className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" rows={3} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="duration" type="number" value={examForm.duration} onChange={handleExamChange} required placeholder="Duration (minutes)" className="rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
              <input name="totalMarks" type="number" value={examForm.totalMarks} onChange={handleExamChange} required placeholder="Total marks" className="rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="passingScore" type="number" value={examForm.passingScore} onChange={handleExamChange} required placeholder="Passing score %" className="rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
              <input name="category" value={examForm.category} onChange={handleExamChange} placeholder="Category" className="rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <select name="difficulty" value={examForm.difficulty} onChange={handleExamChange} className="rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input name="isPublished" type="checkbox" checked={examForm.isPublished} onChange={handleExamChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-900" />
                Publish exam immediately (students can see it)
              </label>
            </div>
            <textarea name="instructions" value={examForm.instructions} onChange={handleExamChange} placeholder="Exam instructions" className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" rows={3} />
            <button type="submit" className="rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700">Create Exam</button>
          </form>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Manage Exams</h2>
          <div className="space-y-3">
            {existingExams.map((exam) => (
              <div key={exam._id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleSelectExam(exam)}
                    className="flex-1 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded p-2 -m-2"
                  >
                    <div className="font-semibold text-gray-900 dark:text-white">{exam.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {exam.category || 'No category'} • {exam.duration} min • {exam.questions?.length || 0} questions
                    </div>
                    <div className="text-xs mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        exam.isPublished
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {exam.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => togglePublishExam(exam._id, exam.isPublished)}
                    className={`ml-4 px-3 py-1 rounded text-sm font-medium ${
                      exam.isPublished
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {exam.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {createdExam && (
        <section className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Questions for {createdExam.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add dynamic questions, including MCQ, short answer, and coding questions.</p>
            </div>
            <button onClick={() => fetchQuestions(createdExam._id)} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Refresh Questions</button>
          </div>

          <form className="space-y-4" onSubmit={addQuestion}>
            <textarea name="questionText" value={questionForm.questionText} onChange={handleQuestionChange} required placeholder="Question text" className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" rows={3} />
            <div className="grid gap-4 sm:grid-cols-2">
              <select name="questionType" value={questionForm.questionType} onChange={handleQuestionChange} className="rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                <option value="MCQ">MCQ</option>
                <option value="True/False">True/False</option>
                <option value="Short Answer">Short Answer</option>
                <option value="Coding">Coding</option>
              </select>
              <input name="marks" type="number" value={questionForm.marks} onChange={handleQuestionChange} required placeholder="Marks" className="rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
            </div>
            {(questionForm.questionType === 'MCQ' || questionForm.questionType === 'True/False') && (
              <textarea name="options" value={questionForm.options} onChange={handleQuestionChange} placeholder="Options (one per line)" className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" rows={4} />
            )}
            {questionForm.questionType === 'Coding' && (
              <div className="space-y-4">
                <textarea name="input" value={questionForm.input} onChange={handleQuestionChange} placeholder="Sample Input (optional)" className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" rows={3} />
                <textarea name="expectedOutput" value={questionForm.expectedOutput} onChange={handleQuestionChange} placeholder="Expected Output" className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" rows={3} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Supported Languages</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Java', 'C', 'C++', 'Python', 'JavaScript'].map((lang) => (
                      <label key={lang} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={questionForm.supportedLanguages.includes(lang)}
                          onChange={(e) => handleLanguageChange(lang, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-900"
                        />
                        <span>{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <input
              name="correctAnswer"
              value={questionForm.correctAnswer}
              onChange={handleQuestionChange}
              required
              placeholder={questionForm.questionType === 'Coding' ? 'Expected code or output' : 'Correct answer'}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
            <input name="sequence" type="number" value={questionForm.sequence} onChange={handleQuestionChange} required placeholder="Sequence" className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
            <button type="submit" className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">Add Question</button>
          </form>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Current Questions</h3>
            {questions.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">No questions added yet.</p>
            ) : (
              <div className="space-y-3">
                {questions.map((question) => (
                  <div key={question._id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="font-semibold text-gray-900 dark:text-white">{question.sequence}. {question.questionText}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Type: {question.questionType} • Marks: {question.marks}
                      {question.questionType === 'Coding' && question.supportedLanguages && (
                        <span> • Languages: {question.supportedLanguages.join(', ')}</span>
                      )}
                    </div>
                    {question.questionType === 'Coding' && question.input && (
                      <div className="mt-2 text-sm">
                        <strong>Input:</strong> <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 whitespace-pre-wrap">{question.input}</pre>
                      </div>
                    )}
                    {question.questionType === 'Coding' && question.expectedOutput && (
                      <div className="mt-2 text-sm">
                        <strong>Expected Output:</strong> <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 whitespace-pre-wrap">{question.expectedOutput}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminExamCreate;
