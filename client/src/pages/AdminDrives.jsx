import { useState, useEffect } from 'react';
import axios from 'axios';
import { BuildingOfficeIcon, PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminDrives = () => {
  const [drives, setDrives] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    requirements: '',
    eligibilityCriteria: '',
    salary: '',
    location: '',
    applicationDeadline: '',
    driveDate: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/drives');
      setDrives(response.data);
    } catch (error) {
      console.error('Error fetching drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingDrive) {
        await axios.put(`http://localhost:5000/api/drives/${editingDrive._id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/drives', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }

      setShowForm(false);
      setEditingDrive(null);
      setFormData({
        companyName: '',
        jobTitle: '',
        jobDescription: '',
        requirements: '',
        eligibilityCriteria: '',
        salary: '',
        location: '',
        applicationDeadline: '',
        driveDate: '',
        contactEmail: '',
        contactPhone: ''
      });
      fetchDrives();
    } catch (error) {
      console.error('Error saving drive:', error);
      alert('Error saving drive');
    }
  };

  const handleEdit = (drive) => {
    setEditingDrive(drive);
    setFormData({
      companyName: drive.companyName,
      jobTitle: drive.jobTitle,
      jobDescription: drive.jobDescription,
      requirements: drive.requirements,
      eligibilityCriteria: drive.eligibilityCriteria,
      salary: drive.salary,
      location: drive.location,
      applicationDeadline: drive.applicationDeadline.split('T')[0],
      driveDate: drive.driveDate.split('T')[0],
      contactEmail: drive.contactEmail,
      contactPhone: drive.contactPhone
    });
    setShowForm(true);
  };

  const handleDelete = async (driveId) => {
    if (window.confirm('Are you sure you want to delete this drive?')) {
      try {
        await axios.delete(`http://localhost:5000/api/drives/${driveId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchDrives();
      } catch (error) {
        console.error('Error deleting drive:', error);
        alert('Error deleting drive');
      }
    }
  };

  const handleViewApplications = async (drive) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/drives/${drive._id}/applications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setApplications(response.data);
      setSelectedDrive(drive);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/drives/applications/${applicationId}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Refresh applications
      if (selectedDrive) {
        handleViewApplications(selectedDrive);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🏢 Manage Placement Drives
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create and manage company placement drives
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Drive
        </button>
      </div>

      {/* Drives List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {drives.map((drive) => (
          <div key={drive._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {drive.companyName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{drive.jobTitle}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  drive.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {drive.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                <p><strong>Location:</strong> {drive.location}</p>
                <p><strong>Salary:</strong> {drive.salary}</p>
                <p><strong>Drive Date:</strong> {formatDate(drive.driveDate)}</p>
                <p><strong>Deadline:</strong> {formatDate(drive.applicationDeadline)}</p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => handleViewApplications(drive)}
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                >
                  <EyeIcon className="w-4 h-4 mr-1" />
                  View Applications
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(drive)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(drive._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {drives.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No drives created yet. Click "Create Drive" to add your first placement drive.
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {editingDrive ? 'Edit Drive' : 'Create New Drive'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Salary *
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g., ₹6-8 LPA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Drive Date *
                    </label>
                    <input
                      type="date"
                      name="driveDate"
                      value={formData.driveDate}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Application Deadline *
                    </label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Job Description *
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleFormChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Requirements *
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleFormChange}
                    required
                    rows={3}
                    placeholder="Technical requirements, skills needed, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Eligibility Criteria *
                  </label>
                  <textarea
                    name="eligibilityCriteria"
                    value={formData.eligibilityCriteria}
                    onChange={handleFormChange}
                    required
                    rows={3}
                    placeholder="CGPA requirements, branch eligibility, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingDrive(null);
                      setFormData({
                        companyName: '',
                        jobTitle: '',
                        jobDescription: '',
                        requirements: '',
                        eligibilityCriteria: '',
                        salary: '',
                        location: '',
                        applicationDeadline: '',
                        driveDate: '',
                        contactEmail: '',
                        contactPhone: ''
                      });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingDrive ? 'Update Drive' : 'Create Drive'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Applications Modal */}
      {selectedDrive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Applications for {selectedDrive.companyName} - {selectedDrive.jobTitle}
                </h2>
                <button
                  onClick={() => setSelectedDrive(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        CGPA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Skills
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Resume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {applications.map((application) => (
                      <tr key={application._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {application.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {application.email}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {application.phoneNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {application.cgpa}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {application.skills}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <a
                            href={`http://localhost:5000/${application.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Resume
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                            application.status === 'selected' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select
                            value={application.status}
                            onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                            <option value="selected">Selected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {applications.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No applications received yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDrives;