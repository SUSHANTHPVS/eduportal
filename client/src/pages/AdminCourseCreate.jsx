import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminCourseCreate = () => {
  const { user, loading } = useAuth();
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    thumbnail: '',
    duration: 1,
    level: 'Beginner',
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [moduleForm, setModuleForm] = useState({
    moduleNumber: 1,
    title: '',
    description: '',
    videoUrl: '',
    materials: '',
  });
  const [moduleVideoFile, setModuleVideoFile] = useState(null);
  const [moduleFiles, setModuleFiles] = useState([]);
  const [createdCourse, setCreatedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [existingCourses, setExistingCourses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchExistingCourses();
    }
  }, [user]);

  const fetchExistingCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setExistingCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchModules = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      setModules(response.data.content || []);
    } catch (error) {
      console.error('Error fetching course modules:', error);
    }
  };

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModuleChange = (e) => {
    const { name, value } = e.target;
    setModuleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files?.[0] || null);
  };

  const handleModuleVideoChange = (e) => {
    setModuleVideoFile(e.target.files?.[0] || null);
  };

  const handleModuleFilesChange = (e) => {
    setModuleFiles(Array.from(e.target.files || []));
  };

  const uploadFile = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('http://localhost:5000/api/courses/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  };

  const createCourse = async (e) => {
    e.preventDefault();
    try {
      let thumbnailUrl = courseForm.thumbnail;
      if (thumbnailFile) {
        const uploaded = await uploadFile(thumbnailFile);
        thumbnailUrl = uploaded?.url || courseForm.thumbnail;
      }

      const payload = {
        ...courseForm,
        thumbnail: thumbnailUrl,
      };

      const response = await axios.post('http://localhost:5000/api/courses', payload);
      setCreatedCourse(response.data);
      setModules([]);
      setThumbnailFile(null);
      setMessage('Course created. You can now add modules.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create course');
    }
  };

  const addModule = async (e) => {
    e.preventDefault();
    if (!createdCourse) {
      setMessage('Create a course first.');
      return;
    }

    const materials = moduleForm.materials
      .split('\n')
      .map((material) => material.trim())
      .filter(Boolean);

    try {
      let videoUrl = moduleForm.videoUrl;
      if (moduleVideoFile) {
        const uploadedVideo = await uploadFile(moduleVideoFile);
        videoUrl = uploadedVideo?.url || moduleForm.videoUrl;
      }

      const uploadedResources = await Promise.all(
        moduleFiles.map(async (file) => {
          const uploaded = await uploadFile(file);
          return {
            type: file.type.startsWith('image/')
              ? 'image'
              : file.type.startsWith('video/')
              ? 'video'
              : 'file',
            url: uploaded?.url || '',
            name: uploaded?.name || file.name,
          };
        })
      );

      const updatedCourse = {
        ...createdCourse,
        content: [
          ...modules,
          {
            moduleNumber: Number(moduleForm.moduleNumber),
            title: moduleForm.title,
            description: moduleForm.description,
            videoUrl,
            materials,
            resources: uploadedResources,
          },
        ].sort((a, b) => a.moduleNumber - b.moduleNumber),
      };

      await axios.put(`http://localhost:5000/api/courses/${createdCourse._id}`, updatedCourse);
      setModuleForm((prev) => ({
        ...prev,
        moduleNumber: prev.moduleNumber + 1,
        title: '',
        description: '',
        videoUrl: '',
        materials: '',
      }));
      setModuleVideoFile(null);
      setModuleFiles([]);
      fetchModules(createdCourse._id);
      setMessage('Module added successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add module');
    }
  };

  const handleSelectCourse = (course) => {
    setCreatedCourse(course);
    fetchModules(course._id);
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-700 dark:text-gray-200">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-red-600">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Course Builder</h1>
      {message && (
        <div className="mb-6 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-blue-900">
          {message}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Create New Course</h2>
          <form className="space-y-4" onSubmit={createCourse}>
            <input name="title" value={courseForm.title} onChange={handleCourseChange} required placeholder="Course title" className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
            <textarea name="description" value={courseForm.description} onChange={handleCourseChange} required placeholder="Course description" className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" rows={3} />
            <input name="thumbnail" value={courseForm.thumbnail} onChange={handleCourseChange} placeholder="Thumbnail URL" className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload thumbnail image
            </label>
            <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="duration" type="number" value={courseForm.duration} onChange={handleCourseChange} required placeholder="Duration (hours)" className="rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
              <select name="level" value={courseForm.level} onChange={handleCourseChange} className="rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <button type="submit" className="rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700">Create Course</button>
          </form>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Manage Courses</h2>
          <div className="space-y-3">
            {existingCourses.map((course) => (
              <button
                key={course._id}
                type="button"
                onClick={() => handleSelectCourse(course)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-left hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-400 dark:hover:bg-gray-900"
              >
                <div className="font-semibold text-gray-900 dark:text-white">{course.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{course.level} • {course.duration} hours • {course.enrolledUsers?.length || 0} enrolled</div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {createdCourse && (
        <section className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Modules for {createdCourse.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add course content modules with videos and materials.</p>
            </div>
            <button onClick={() => fetchModules(createdCourse._id)} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Refresh Modules</button>
          </div>

          <form className="space-y-4" onSubmit={addModule}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="moduleNumber" type="number" value={moduleForm.moduleNumber} onChange={handleModuleChange} required placeholder="Module number" className="rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
              <input name="title" value={moduleForm.title} onChange={handleModuleChange} required placeholder="Module title" className="rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
            </div>
            <textarea name="description" value={moduleForm.description} onChange={handleModuleChange} placeholder="Module description" className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" rows={2} />
            <input name="videoUrl" value={moduleForm.videoUrl} onChange={handleModuleChange} placeholder="Video URL (optional)" className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload a lesson video</label>
            <input type="file" accept="video/*" onChange={handleModuleVideoChange} className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
            <textarea name="materials" value={moduleForm.materials} onChange={handleModuleChange} placeholder="Materials (one URL per line)" className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" rows={3} />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload additional resources (images/files)</label>
            <input type="file" multiple onChange={handleModuleFilesChange} className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white" />
            <button type="submit" className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">Add Module</button>
          </form>

          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Current Modules</h3>
            {modules.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">No modules added yet.</p>
            ) : (
              <div className="space-y-3">
                {modules.map((module) => (
                  <div key={module.moduleNumber} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="font-semibold text-gray-900 dark:text-white">Module {module.moduleNumber}: {module.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{module.description}</div>
                    {module.videoUrl && (
                      <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">Video: <a href={module.videoUrl} target="_blank" rel="noopener noreferrer" className="underline">View</a></div>
                    )}
                    {module.materials && module.materials.length > 0 && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Materials: {module.materials.length} link(s)
                      </div>
                    )}
                    {module.resources && module.resources.length > 0 && (
                      <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        {module.resources.map((resource, index) => (
                          <div key={`${module.moduleNumber}-${index}`}>
                            <span className="font-medium">{resource.type}:</span>{' '}
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="underline">
                              {resource.name || resource.url}
                            </a>
                          </div>
                        ))}
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

export default AdminCourseCreate;