import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import TwitchAccountsPage from './pages/TwitchAccountsPage';
import RevenueDetailsPage from './pages/RevenueDetailsPage';
import SubscriptionPlansPage from './pages/SubscriptionPlansPage';
import SubscriptionManagementPage from './pages/SubscriptionManagementPage';
import SubscriptionSuccessPage from './pages/SubscriptionSuccessPage';
import SubscriptionCancelledPage from './pages/SubscriptionCancelledPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfileSetup from './components/ProfileSetup';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { Loader2 } from 'lucide-react';

function IndexComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userProfile === null) {
    return <ProfileSetup />;
  }

  return <TwitchAccountsPage />;
}

function TwitchAccountsComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userProfile === null) {
    return <ProfileSetup />;
  }

  return <TwitchAccountsPage />;
}

function RevenueDetailsComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userProfile === null) {
    return <ProfileSetup />;
  }

  return <RevenueDetailsPage />;
}

function SubscriptionPlansComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userProfile === null) {
    return <ProfileSetup />;
  }

  return <SubscriptionPlansPage />;
}

function SubscriptionManagementComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userProfile === null) {
    return <ProfileSetup />;
  }

  return <SubscriptionManagementPage />;
}

function AdminDashboardComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userProfile === null) {
    return <ProfileSetup />;
  }

  return <AdminDashboardPage />;
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
});

const twitchAccountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/twitch-accounts',
  component: TwitchAccountsComponent,
});

const revenueDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/twitch-accounts/$accountId/revenue',
  component: RevenueDetailsComponent,
});

const subscriptionPlansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription-plans',
  component: SubscriptionPlansComponent,
});

const subscriptionManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription-management',
  component: SubscriptionManagementComponent,
});

const subscriptionSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription-success',
  component: SubscriptionSuccessPage,
});

const subscriptionCancelledRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription-cancelled',
  component: SubscriptionCancelledPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardComponent,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  twitchAccountsRoute,
  revenueDetailsRoute,
  subscriptionPlansRoute,
  subscriptionManagementRoute,
  subscriptionSuccessRoute,
  subscriptionCancelledRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
