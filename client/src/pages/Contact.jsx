import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Thanks! Your message has been received.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
              Contact us
            </p>
            <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
              We’re here to help you succeed.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-300">
              Have questions about courses, exams, or admin features? Send us a message and our EduPortal team will respond shortly.
            </p>

            <div className="mt-10 space-y-6 rounded-3xl bg-white p-8 shadow-xl shadow-slate-900/10 dark:bg-gray-800">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">support@eduportal.com</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Phone</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">+91 7337017721</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Office</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Hitech City, Madhapur,</p>
<p className="mt-2 text-gray-600 dark:text-gray-300">Hyderabad, Telangana 500081,
India.</p>
<p className="mt-2 text-gray-600 dark:text-gray-300">India.</p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 p-1 shadow-2xl shadow-slate-950/30">
            <div className="rounded-3xl bg-white p-8 dark:bg-gray-900">
              <div className="overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1000&q=80"
                  alt="Contact support"
                  className="h-64 w-full object-cover"
                />
              </div>
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Send Message
                </button>
                {status && <p className="text-sm text-green-600 dark:text-green-400">{status}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
