import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BuildingOfficeIcon, MapPinIcon, CurrencyDollarIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

const Drives = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cgpa: user?.cgpa || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    skills: user?.skills || '',
    experience: user?.experience || '',
    resume: null
  });

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const [drivesRes, applicationsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/drives'),
          axios.get('http://localhost:5000/api/drives/applications/my', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        setDrives(drivesRes.data);
        setApplications(applicationsRes.data);
      } catch (error) {
        console.error('Error fetching drives:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDrives();
    }
  }, [user]);

  const handleApply = (drive) => {
    setSelectedDrive(drive);
    setShowApplyForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setApplicationForm(prev => ({ ...prev, resume: files[0] }));
    } else {
      setApplicationForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const submitApplication = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(applicationForm).forEach(key => {
      if (key === 'resume' && applicationForm[key]) {
        formData.append('resume', applicationForm[key]);
      } else {
        formData.append(key, applicationForm[key]);
      }
    });

    try {
      await axios.post(
        `http://localhost:5000/api/drives/${selectedDrive._id}/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert('Application submitted successfully!');
      setShowApplyForm(false);
      setSelectedDrive(null);

      // Refresh applications
      const applicationsRes = await axios.get('http://localhost:5000/api/drives/applications/my', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setApplications(applicationsRes.data);

    } catch (error) {
      console.error('Error submitting application:', error);
      alert(error.response?.data?.message || 'Error submitting application');
    }
  };

  const hasApplied = (driveId) => {
    return applications.some(app => app.driveId._id === driveId);
  };

  const getApplicationStatus = (driveId) => {
    const application = applications.find(app => app.driveId._id === driveId);
    return application ? application.status : null;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8">Loading drives...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          💼 Placement Drives
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Apply for company placement drives and kickstart your career
        </p>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {drives.map((drive) => (
          <div key={drive._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <BuildingOfficeIcon className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {drive.companyName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{drive.jobTitle}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  {drive.location}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                  {drive.salary}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Drive Date: {formatDate(drive.driveDate)}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Apply by: {formatDate(drive.applicationDeadline)}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {drive.jobDescription}
                </p>
              </div>

              <div className="flex justify-between items-center">
                {hasApplied(drive._id) ? (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    getApplicationStatus(drive._id) === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    getApplicationStatus(drive._id) === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                    getApplicationStatus(drive._id) === 'selected' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getApplicationStatus(drive._id)?.charAt(0).toUpperCase() + getApplicationStatus(drive._id)?.slice(1)}
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(drive)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={new Date(drive.applicationDeadline) < new Date()}
                  >
                    {new Date(drive.applicationDeadline) < new Date() ? 'Deadline Passed' : 'Apply Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {drives.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No active placement drives available at the moment.
        </div>
      )}

      {/* Application Form Modal */}
      {showApplyForm && selectedDrive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Apply for {selectedDrive.companyName} - {selectedDrive.jobTitle}
              </h2>

              <form onSubmit={submitApplication} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={applicationForm.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={applicationForm.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CGPA *
                    </label>
                    <input
                      type="number"
                      name="cgpa"
                      value={applicationForm.cgpa}
                      onChange={handleFormChange}
                      step="0.01"
                      min="0"
                      max="10"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={applicationForm.phoneNumber}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={applicationForm.address}
                    onChange={handleFormChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Skills *
                  </label>
                  <textarea
                    name="skills"
                    value={applicationForm.skills}
                    onChange={handleFormChange}
                    required
                    placeholder="List your technical skills, programming languages, etc."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Experience
                  </label>
                  <textarea
                    name="experience"
                    value={applicationForm.experience}
                    onChange={handleFormChange}
                    placeholder="Any previous work experience, internships, projects, etc."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Resume *
                  </label>
                  <input
                    type="file"
                    name="resume"
                    onChange={handleFormChange}
                    accept=".pdf,.doc,.docx"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drives;