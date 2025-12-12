import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import UserManagementPage from './pages/UserManagement';
import UserManagementDashboard from './pages/UserManagementDashboard';
import RolesPage from './pages/Roles';
import DashboardPage from './pages/Dashboard';
import ContentManagement from './pages/ContentManagement';
import CourseManagement from './pages/CourseManagement';
import ArticleManagement from './pages/ArticleManagement';
import MyTasks from './pages/MyTasks';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import PublicHome from './pages/PublicHome';
import Auth from './pages/Auth';
import TechnologyPage from './pages/TechnologyPage';
import CourseCategoryPage from './pages/CourseCategoryPage';
import SearchResults from './pages/SearchResults';
import LearningPathPage from './pages/LearningPathPage';
import ArticleViewPage from './pages/ArticleViewPage';
import CourseViewPage from './pages/CourseViewPage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicHome />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/technology/:slug" element={<TechnologyPage />} />
              <Route path="/explore/:category" element={<CourseCategoryPage />} />
              <Route path="/article/:slug" element={<ArticleViewPage />} />
              <Route path="/course/:slug" element={<CourseViewPage />} />
              <Route path="/learn/:path" element={<LearningPathPage />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><ContentManagement /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/user-management" element={<ProtectedRoute><UserManagementDashboard /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
              <Route path="/roles" element={<ProtectedRoute><RolesPage /></ProtectedRoute>} />
              <Route path="/content" element={<ProtectedRoute><ContentManagement /></ProtectedRoute>} />
              <Route path="/courses" element={<ProtectedRoute><CourseManagement /></ProtectedRoute>} />
              <Route path="/articles" element={<ProtectedRoute><ArticleManagement /></ProtectedRoute>} />
              <Route path="/my-tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
