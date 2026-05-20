import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppSettings } from '../context/AppSettingsContext';
import { getBackendUrl } from '../axiosConfig';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const backendUrl = getBackendUrl();
  const { t } = useAppSettings();
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    profileImage: '',
    phoneNumber: '',
    cgpa: '',
    address: '',
    skills: '',
    experience: '',
    resume: null,
  });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        profileImage: user.profileImage || '',
        phoneNumber: user.phoneNumber || '',
        cgpa: user.cgpa || '',
        address: user.address || '',
        skills: user.skills || '',
        experience: user.experience || '',
        resume: null,
      });
    }
  }, [user]);

  if (!user) {
    return <div>{t('profile.loginRequired')}</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    const result = await updateProfile(profileForm);
    if (result.success) {
      setMessage('Profile saved successfully.');
      setEditing(false);
    } else {
      setMessage(result.message);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setProfileForm({
      name: user.name || '',
      email: user.email || '',
      profileImage: user.profileImage || '',
      phoneNumber: user.phoneNumber || '',
      cgpa: user.cgpa || '',
      address: user.address || '',
      skills: user.skills || '',
      experience: user.experience || '',
      resume: null,
    });
    setEditing(false);
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('profile.title')}</h1>
        <div className="flex gap-3">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? t('profile.saving') : t('profile.save')}
              </button>
              <button
                onClick={handleCancel}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
              >
                {t('profile.cancel')}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              {t('profile.editProfile')}
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-blue-900">
          {message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="w-full lg:w-1/4 flex flex-col items-center gap-4">
            <div className="w-28 h-28 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden flex items-center justify-center">
              {profileForm.profileImage ? (
                <img src={profileForm.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-gray-600 dark:text-gray-300">
                  {profileForm.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {editing && (
              <input
                type="text"
                name="profileImage"
                value={profileForm.profileImage}
                onChange={handleChange}
                placeholder="Profile image URL"
                className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              />
            )}
          </div>

          <div className="w-full lg:w-3/4 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              ) : (
                <p className="mt-1 text-gray-900 dark:text-white">{user.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              {editing ? (
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              ) : (
                <p className="mt-1 text-gray-900 dark:text-white">{user.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <p className="mt-1 text-gray-900 dark:text-white capitalize">{user.role}</p>
            </div>

            {/* Additional fields for drives */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Placement Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profileForm.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 dark:text-white">{user.phoneNumber || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CGPA</label>
                  {editing ? (
                    <input
                      type="number"
                      name="cgpa"
                      value={profileForm.cgpa}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="Enter your CGPA"
                      className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 dark:text-white">{user.cgpa || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                {editing ? (
                  <textarea
                    name="address"
                    value={profileForm.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter your full address"
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 dark:text-white">{user.address || 'Not provided'}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
                {editing ? (
                  <textarea
                    name="skills"
                    value={profileForm.skills}
                    onChange={handleChange}
                    rows={3}
                    placeholder="List your technical skills, programming languages, etc."
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 dark:text-white">{user.skills || 'Not provided'}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experience</label>
                {editing ? (
                  <textarea
                    name="experience"
                    value={profileForm.experience}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe your previous work experience, internships, projects, etc."
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 dark:text-white">{user.experience || 'Not provided'}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resume</label>
                {editing ? (
                  <div>
                    <input
                      type="file"
                      name="resume"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setProfileForm(prev => ({ ...prev, resume: file }));
                      }}
                      accept=".pdf,.doc,.docx"
                      className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                ) : (
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {user.resume ? (
                      <a
                        href={`${backendUrl}/${user.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Resume
                      </a>
                    ) : (
                      'Not uploaded'
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;