import { useParams, Link } from 'react-router-dom';
import { BookOpen, Clock, Users, CheckCircle, ChevronRight, Code, Server, Shield, Cloud, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PublicLayout } from '@/components/layout/PublicLayout';

const pathData: Record<string, {
  title: string;
  description: string;
  icon: React.ElementType;
  totalCourses: number;
  totalHours: number;
  students: number;
  modules: { id: number; title: string; courses: number; hours: number; description: string }[];
  skills: string[];
  outcomes: string[];
}> = {
  sde: {
    title: 'Software Development Engineer',
    description: 'Master the skills needed to become a professional software developer.',
    icon: Code,
    totalCourses: 24,
    totalHours: 120,
    students: 85000,
    modules: [
      { id: 1, title: 'Programming Fundamentals', courses: 4, hours: 20, description: 'Core programming concepts.' },
      { id: 2, title: 'Data Structures & Algorithms', courses: 5, hours: 30, description: 'Essential DS&A for interviews.' },
      { id: 3, title: 'Web Development', courses: 5, hours: 25, description: 'Build web applications with React.' },
      { id: 4, title: 'Backend Development', courses: 4, hours: 20, description: 'Create scalable APIs.' },
      { id: 5, title: 'System Design', courses: 3, hours: 15, description: 'Design distributed systems.' },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'System Design'],
    outcomes: ['Build full-stack applications', 'Pass technical interviews', 'Design scalable systems'],
  },
  'system-architect': {
    title: 'System Architect',
    description: 'Design and architect large-scale distributed systems.',
    icon: Server,
    totalCourses: 18,
    totalHours: 90,
    students: 42000,
    modules: [
      { id: 1, title: 'Distributed Systems', courses: 3, hours: 15, description: 'Core distributed computing.' },
      { id: 2, title: 'Database Architecture', courses: 3, hours: 15, description: 'SQL, NoSQL, scaling.' },
      { id: 3, title: 'Microservices Design', courses: 4, hours: 20, description: 'Build microservices.' },
      { id: 4, title: 'Cloud Architecture', courses: 4, hours: 20, description: 'AWS, GCP, Azure patterns.' },
    ],
    skills: ['Distributed Systems', 'Cloud Architecture', 'Microservices', 'Database Design'],
    outcomes: ['Design scalable architectures', 'Lead technical decisions', 'Optimize performance'],
  },
  'security-architect': {
    title: 'Security Architect',
    description: 'Master application security and secure development practices.',
    icon: Shield,
    totalCourses: 15,
    totalHours: 75,
    students: 28000,
    modules: [
      { id: 1, title: 'Security Fundamentals', courses: 3, hours: 12, description: 'Core security concepts.' },
      { id: 2, title: 'Application Security', courses: 3, hours: 15, description: 'OWASP, secure coding.' },
      { id: 3, title: 'Network Security', courses: 3, hours: 15, description: 'Firewalls, VPNs.' },
      { id: 4, title: 'Penetration Testing', courses: 3, hours: 15, description: 'Ethical hacking.' },
    ],
    skills: ['Threat Modeling', 'Penetration Testing', 'OWASP', 'Cryptography'],
    outcomes: ['Secure applications', 'Conduct security audits', 'Lead security initiatives'],
  },
  devops: {
    title: 'DevOps Engineer',
    description: 'Bridge development and operations with CI/CD and automation.',
    icon: Cloud,
    totalCourses: 20,
    totalHours: 100,
    students: 55000,
    modules: [
      { id: 1, title: 'Linux & Shell', courses: 3, hours: 15, description: 'Command line mastery.' },
      { id: 2, title: 'CI/CD', courses: 4, hours: 20, description: 'Git, GitHub Actions.' },
      { id: 3, title: 'Containerization', courses: 4, hours: 20, description: 'Docker, Kubernetes.' },
      { id: 4, title: 'Infrastructure as Code', courses: 3, hours: 15, description: 'Terraform, Ansible.' },
    ],
    skills: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'AWS/GCP'],
    outcomes: ['Automate deployments', 'Manage cloud infrastructure', 'Implement monitoring'],
  },
  'data-engineer': {
    title: 'Data Engineer',
    description: 'Build data pipelines and infrastructure.',
    icon: Zap,
    totalCourses: 16,
    totalHours: 80,
    students: 38000,
    modules: [
      { id: 1, title: 'SQL & Databases', courses: 3, hours: 15, description: 'Advanced SQL.' },
      { id: 2, title: 'Python for Data', courses: 3, hours: 15, description: 'Python scripting.' },
      { id: 3, title: 'ETL & Pipelines', courses: 4, hours: 20, description: 'Airflow, Spark.' },
      { id: 4, title: 'Cloud Data', courses: 3, hours: 15, description: 'BigQuery, Redshift.' },
    ],
    skills: ['SQL', 'Python', 'Apache Spark', 'Airflow', 'ETL'],
    outcomes: ['Build data pipelines', 'Design data architectures', 'Optimize processing'],
  },
  'full-stack': {
    title: 'Full Stack Developer',
    description: 'Build complete web applications from frontend to backend.',
    icon: Code,
    totalCourses: 22,
    totalHours: 110,
    students: 92000,
    modules: [
      { id: 1, title: 'HTML, CSS & JS', courses: 4, hours: 20, description: 'Web fundamentals.' },
      { id: 2, title: 'React Development', courses: 5, hours: 25, description: 'Build React apps.' },
      { id: 3, title: 'Node.js & Express', courses: 4, hours: 20, description: 'Server-side JS.' },
      { id: 4, title: 'Databases', courses: 4, hours: 20, description: 'SQL, MongoDB.' },
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB'],
    outcomes: ['Build full-stack apps', 'Deploy to production', 'Manage databases'],
  },
};

const LearningPathPage = () => {
  const { path } = useParams<{ path: string }>();
  const data = path ? pathData[path] : null;
  
  if (!data) {
    return (
      <PublicLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Learning path not found</h1>
          <Link to="/"><Button>Go Home</Button></Link>
        </div>
      </PublicLayout>
    );
  }

  const Icon = data.icon;

  return (
    <PublicLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="p-4 rounded-xl bg-primary text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary-foreground/10">
              <Icon className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-1">Learning Path</Badge>
              <h1 className="text-2xl font-bold">{data.title}</h1>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground max-w-2xl">{data.description}</p>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-5 w-5" />
            <span>{data.totalCourses} Courses</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span>{data.totalHours} Hours</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-5 w-5" />
            <span>{data.students.toLocaleString()} Students</span>
          </div>
        </div>
        
        <Button size="lg">Start Learning Path</Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Curriculum */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold">Path Curriculum</h2>
            {data.modules.map((module, index) => (
              <Card key={module.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{module.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{module.description}</p>
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

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3">Skills You'll Learn</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3">What You'll Achieve</h3>
                <ul className="space-y-2">
                  {data.outcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-5 text-center">
                <h3 className="font-semibold mb-2">Ready to start?</h3>
                <p className="text-primary-foreground/80 mb-4 text-sm">Join {data.students.toLocaleString()}+ students</p>
                <Button className="w-full" variant="secondary">Enroll Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LearningPathPage;
