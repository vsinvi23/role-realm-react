import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserManagementPage from './pages/UserManagement';
import UserManagementDashboard from './pages/UserManagementDashboard';
import RolesPage from './pages/Roles';
import DashboardPage from './pages/Dashboard';
import ContentManagement from './pages/ContentManagement';
import CourseManagement from './pages/CourseManagement';
import ArticleManagement from './pages/ArticleManagement';
import ReviewQueue from './pages/ReviewQueue';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ContentManagement />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/user-management" element={<UserManagementDashboard />} />
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/content" element={<ContentManagement />} />
            <Route path="/courses" element={<CourseManagement />} />
            <Route path="/articles" element={<ArticleManagement />} />
            <Route path="/review-queue" element={<ReviewQueue />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
