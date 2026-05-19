import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-sky-950 text-white py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="hero-glow -left-24 top-12 h-80 w-80 bg-cyan-500/20" />
          <div className="hero-glow -right-20 top-24 h-72 w-72 bg-violet-500/15" />
          <div className="hero-glow left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-white/5" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-slate-950/20">
                Future-ready exam platform
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                A smarter exam experience for learners and educators.
              </h1>
              <p className="max-w-2xl text-lg text-slate-200/95">
                EduPortal blends adaptive assessments, placement-ready analytics, and collaborative mentorship into a single modern learning hub.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/drives"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-8 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition duration-300 hover:bg-cyan-400"
                >
                  Explore Placement Drives
                </Link>
                <Link
                  to="/leaderboard"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cyan-300 hover:bg-white/20"
                >
                  View Leaderboard
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-3xl font-bold text-cyan-300">98%</p>
                  <p className="text-sm text-slate-300">Exam success insights</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-3xl font-bold text-violet-300">+35</p>
                  <p className="text-sm text-slate-300">Companies hiring students</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-300">24/7</p>
                  <p className="text-sm text-slate-300">Study support and feedback</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                  alt="Students learning online"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 left-6 right-6 rounded-4xl border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/25 backdrop-blur-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Trusted by learners</p>
                    <p className="text-2xl font-semibold text-white">12,000+ active students</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                    Skill-driven outcomes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Experience Section */}
      <section className="py-20 bg-slate-900/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Advanced capabilities</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">Designed to feel different from every other exam platform.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Smart guidance, real-time placement readiness, and interactive exam experiences keep learners engaged and motivated.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="feature-card p-8">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 text-2xl shadow-lg shadow-cyan-500/10">
                🤖
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI-powered Study Coach</h3>
              <p className="text-slate-300 leading-relaxed">
                Receive personalized revision tips, question recommendations, and exam readiness insights tailored to your progress.
              </p>
            </div>
            <div className="feature-card p-8">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300 text-2xl shadow-lg shadow-violet-500/10">
                📈
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Adaptive Exam Flow</h3>
              <p className="text-slate-300 leading-relaxed">
                Exams adapt to your pace and performance, giving more challenge where you need it and faster success tracking where you excel.
              </p>
            </div>
            <div className="feature-card p-8">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300 text-2xl shadow-lg shadow-emerald-500/10">
                🏢
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Placement Drive Hub</h3>
              <p className="text-slate-300 leading-relaxed">
                Discover real company drives, apply with your profile, and follow a career path that connects exam success to job readiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Why Choose EduPortal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-950/10 transition duration-300 hover:-translate-y-1">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300 text-2xl">📚</div>
              <h3 className="text-xl font-semibold text-white mb-3">Interactive exams</h3>
              <p className="text-slate-300">Real-time grading, instant feedback and immersive exam formats.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-950/10 transition duration-300 hover:-translate-y-1">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-green-500/10 text-green-300 text-2xl">🎓</div>
              <h3 className="text-xl font-semibold text-white mb-3">Course mastery</h3>
              <p className="text-slate-300">Structured modules, videos, and exercises that support real learning.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-950/10 transition duration-300 hover:-translate-y-1">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-500/10 text-purple-300 text-2xl">📊</div>
              <h3 className="text-xl font-semibold text-white mb-3">Deep analytics</h3>
              <p className="text-slate-300">Progress dashboards, score distributions, and exam strengths at a glance.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-950/10 transition duration-300 hover:-translate-y-1">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-500/10 text-yellow-300 text-2xl">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-3">Career-ready</h3>
              <p className="text-slate-300">Built-in placement drives, ranking impact, and resume-ready achievement tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-slate-950/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-10">Quick links</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/courses"
              className="rounded-4xl border border-white/10 bg-white/5 p-6 text-center text-white transition hover:-translate-y-1 hover:bg-white/10"
            >
              <p className="text-xl font-semibold">Courses</p>
              <p className="mt-3 text-sm text-slate-300">Browse courses and enroll in your next learning path.</p>
            </Link>
            <Link
              to="/exams"
              className="rounded-4xl border border-white/10 bg-white/5 p-6 text-center text-white transition hover:-translate-y-1 hover:bg-white/10"
            >
              <p className="text-xl font-semibold">Exams</p>
              <p className="mt-3 text-sm text-slate-300">Access active exams and practice tests.</p>
            </Link>
            <Link
              to="/leaderboard"
              className="rounded-4xl border border-white/10 bg-white/5 p-6 text-center text-white transition hover:-translate-y-1 hover:bg-white/10"
            >
              <p className="text-xl font-semibold">Leaderboard</p>
              <p className="mt-3 text-sm text-slate-300">Check rankings, score trends, and top performers.</p>
            </Link>
            <Link
              to="/drives"
              className="rounded-4xl border border-white/10 bg-white/5 p-6 text-center text-white transition hover:-translate-y-1 hover:bg-white/10"
            >
              <p className="text-xl font-semibold">Placement Drives</p>
              <p className="mt-3 text-sm text-slate-300">View available company drives and apply now.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Begin your journey with a modern exam portal.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30">
              <h3 className="text-2xl font-semibold text-white mb-4">Student Portal</h3>
              <p className="text-slate-300 mb-6">Study smarter with adaptive exams, learning analytics, and a placement-ready journey.</p>
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:bg-cyan-400"
              >
                Student Login
              </Link>
            </div>
            <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/30">
              <h3 className="text-2xl font-semibold text-white mb-4">Admin Portal</h3>
              <p className="text-slate-300 mb-6">Build exams, review performance, and manage drives with a modern dashboard.</p>
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-violet-400"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;