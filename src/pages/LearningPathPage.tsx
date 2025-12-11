import { useParams, Link } from 'react-router-dom';
import { Search, BookOpen, Clock, Star, ChevronRight, Play, Users, ArrowLeft, CheckCircle, Code, Server, Shield, Cloud, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

const pathData: Record<string, {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  totalCourses: number;
  totalHours: number;
  students: number;
  modules: { id: number; title: string; courses: number; hours: number; description: string }[];
  skills: string[];
  outcomes: string[];
}> = {
  sde: {
    title: 'Software Development Engineer',
    description: 'Master the skills needed to become a professional software developer. From fundamentals to advanced concepts.',
    icon: Code,
    color: 'from-blue-600 to-indigo-700',
    totalCourses: 24,
    totalHours: 120,
    students: 85000,
    modules: [
      { id: 1, title: 'Programming Fundamentals', courses: 4, hours: 20, description: 'Learn core programming concepts and problem-solving.' },
      { id: 2, title: 'Data Structures & Algorithms', courses: 5, hours: 30, description: 'Master essential DS&A for technical interviews.' },
      { id: 3, title: 'Web Development', courses: 5, hours: 25, description: 'Build modern web applications with React.' },
      { id: 4, title: 'Backend Development', courses: 4, hours: 20, description: 'Create scalable APIs and server-side applications.' },
      { id: 5, title: 'System Design', courses: 3, hours: 15, description: 'Design large-scale distributed systems.' },
      { id: 6, title: 'Interview Preparation', courses: 3, hours: 10, description: 'Ace your technical interviews.' },
    ],
    skills: ['JavaScript/TypeScript', 'React', 'Node.js', 'SQL', 'Git', 'System Design', 'DSA'],
    outcomes: ['Build full-stack applications', 'Pass technical interviews', 'Design scalable systems', 'Work in agile teams'],
  },
  'system-architect': {
    title: 'System Architect',
    description: 'Learn to design and architect large-scale distributed systems used by millions of users.',
    icon: Server,
    color: 'from-purple-600 to-pink-700',
    totalCourses: 18,
    totalHours: 90,
    students: 42000,
    modules: [
      { id: 1, title: 'Distributed Systems Fundamentals', courses: 3, hours: 15, description: 'Core concepts of distributed computing.' },
      { id: 2, title: 'Database Architecture', courses: 3, hours: 15, description: 'SQL, NoSQL, and database scaling.' },
      { id: 3, title: 'Microservices Design', courses: 4, hours: 20, description: 'Build and manage microservices architectures.' },
      { id: 4, title: 'Cloud Architecture', courses: 4, hours: 20, description: 'AWS, GCP, and Azure cloud patterns.' },
      { id: 5, title: 'High Availability & Scalability', courses: 4, hours: 20, description: 'Design for millions of users.' },
    ],
    skills: ['Distributed Systems', 'Cloud Architecture', 'Microservices', 'Database Design', 'Load Balancing', 'Caching'],
    outcomes: ['Design scalable architectures', 'Lead technical decisions', 'Optimize system performance', 'Mentor engineering teams'],
  },
  'security-architect': {
    title: 'Security Architect',
    description: 'Master application security, penetration testing, and secure software development practices.',
    icon: Shield,
    color: 'from-red-600 to-orange-700',
    totalCourses: 15,
    totalHours: 75,
    students: 28000,
    modules: [
      { id: 1, title: 'Security Fundamentals', courses: 3, hours: 12, description: 'Core security concepts and threat modeling.' },
      { id: 2, title: 'Application Security', courses: 3, hours: 15, description: 'OWASP, secure coding practices.' },
      { id: 3, title: 'Network Security', courses: 3, hours: 15, description: 'Firewalls, VPNs, and network hardening.' },
      { id: 4, title: 'Cloud Security', courses: 3, hours: 18, description: 'Secure cloud deployments and compliance.' },
      { id: 5, title: 'Penetration Testing', courses: 3, hours: 15, description: 'Ethical hacking and vulnerability assessment.' },
    ],
    skills: ['Threat Modeling', 'Penetration Testing', 'OWASP', 'Cryptography', 'Compliance', 'Incident Response'],
    outcomes: ['Secure applications', 'Conduct security audits', 'Lead security initiatives', 'Achieve security certifications'],
  },
  devops: {
    title: 'DevOps Engineer',
    description: 'Bridge development and operations with CI/CD, containerization, and infrastructure as code.',
    icon: Cloud,
    color: 'from-teal-600 to-cyan-700',
    totalCourses: 20,
    totalHours: 100,
    students: 55000,
    modules: [
      { id: 1, title: 'Linux & Shell Scripting', courses: 3, hours: 15, description: 'Master the command line and automation.' },
      { id: 2, title: 'Version Control & CI/CD', courses: 4, hours: 20, description: 'Git, GitHub Actions, Jenkins.' },
      { id: 3, title: 'Containerization', courses: 4, hours: 20, description: 'Docker and container orchestration.' },
      { id: 4, title: 'Kubernetes', courses: 4, hours: 20, description: 'Deploy and manage containerized apps.' },
      { id: 5, title: 'Infrastructure as Code', courses: 3, hours: 15, description: 'Terraform, Ansible, CloudFormation.' },
      { id: 6, title: 'Monitoring & Observability', courses: 2, hours: 10, description: 'Prometheus, Grafana, logging.' },
    ],
    skills: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'AWS/GCP', 'Monitoring', 'Linux'],
    outcomes: ['Automate deployments', 'Manage cloud infrastructure', 'Implement monitoring', 'Reduce deployment time'],
  },
  'data-engineer': {
    title: 'Data Engineer',
    description: 'Build data pipelines and infrastructure to power data-driven organizations.',
    icon: Zap,
    color: 'from-orange-600 to-yellow-700',
    totalCourses: 16,
    totalHours: 80,
    students: 38000,
    modules: [
      { id: 1, title: 'SQL & Database Fundamentals', courses: 3, hours: 15, description: 'Advanced SQL and database design.' },
      { id: 2, title: 'Python for Data Engineering', courses: 3, hours: 15, description: 'Python scripting and data processing.' },
      { id: 3, title: 'Data Warehousing', courses: 3, hours: 15, description: 'Design and build data warehouses.' },
      { id: 4, title: 'ETL & Data Pipelines', courses: 4, hours: 20, description: 'Apache Airflow, Spark, and streaming.' },
      { id: 5, title: 'Cloud Data Platforms', courses: 3, hours: 15, description: 'BigQuery, Redshift, Snowflake.' },
    ],
    skills: ['SQL', 'Python', 'Apache Spark', 'Airflow', 'Data Warehousing', 'ETL', 'Cloud Platforms'],
    outcomes: ['Build data pipelines', 'Design data architectures', 'Optimize data processing', 'Support analytics teams'],
  },
  'full-stack': {
    title: 'Full Stack Developer',
    description: 'Build complete web applications from frontend to backend, databases to deployment.',
    icon: Code,
    color: 'from-green-600 to-emerald-700',
    totalCourses: 22,
    totalHours: 110,
    students: 92000,
    modules: [
      { id: 1, title: 'HTML, CSS & JavaScript', courses: 4, hours: 20, description: 'Web development fundamentals.' },
      { id: 2, title: 'React Development', courses: 5, hours: 25, description: 'Build modern React applications.' },
      { id: 3, title: 'Node.js & Express', courses: 4, hours: 20, description: 'Server-side JavaScript development.' },
      { id: 4, title: 'Databases', courses: 4, hours: 20, description: 'SQL, MongoDB, and data modeling.' },
      { id: 5, title: 'Authentication & APIs', courses: 3, hours: 15, description: 'Secure authentication and REST/GraphQL.' },
      { id: 6, title: 'Deployment & DevOps', courses: 2, hours: 10, description: 'Deploy and maintain applications.' },
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB', 'REST APIs', 'Git'],
    outcomes: ['Build full-stack apps', 'Deploy to production', 'Manage databases', 'Work on any layer'],
  },
};

const LearningPathPage = () => {
  const { path } = useParams<{ path: string }>();
  const { isAuthenticated, user, logout } = useAuth();
  
  const data = path ? pathData[path] : null;
  
  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Learning path not found</h1>
          <Link to="/"><Button>Go Home</Button></Link>
        </div>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">TechLearn</Link>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard"><Button variant="outline" size="sm">Dashboard</Button></Link>
                  <Button size="sm" variant="ghost" onClick={logout}>{user?.name}</Button>
                </>
              ) : (
                <>
                  <Link to="/auth"><Button variant="outline" size="sm">Sign In</Button></Link>
                  <Link to="/auth"><Button size="sm">Get Started</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className={`bg-gradient-to-br ${data.color} text-white py-16`}>
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-xl bg-white/20">
              <Icon className="h-10 w-10" />
            </div>
            <div>
              <Badge className="bg-white/20 text-white border-0 mb-2">Learning Path</Badge>
              <h1 className="text-4xl md:text-5xl font-bold">{data.title}</h1>
            </div>
          </div>
          <p className="text-lg text-white/90 max-w-2xl mb-8">{data.description}</p>
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>{data.totalCourses} Courses</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{data.totalHours} Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{data.students.toLocaleString()} Students</span>
            </div>
          </div>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90">
            Start Learning Path
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Path Curriculum</h2>
              <div className="space-y-4">
                {data.modules.map((module, index) => (
                  <Card key={module.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${data.color} text-white flex items-center justify-center font-bold`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{module.title}</h3>
                          <p className="text-muted-foreground mb-3">{module.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" /> {module.courses} courses
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {module.hours} hours
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Skills You'll Learn</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">What You'll Achieve</h3>
                <ul className="space-y-3">
                  {data.outcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className={`bg-gradient-to-br ${data.color} text-white`}>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Ready to start?</h3>
                <p className="text-white/80 mb-4 text-sm">Join {data.students.toLocaleString()}+ students</p>
                <Button className="w-full bg-white text-primary hover:bg-white/90">
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPathPage;
