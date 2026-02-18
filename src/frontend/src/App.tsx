import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import TwitchAccountsPage from './pages/TwitchAccountsPage';
import RevenueDetailsPage from './pages/RevenueDetailsPage';
import SubscriptionPlansPage from './pages/SubscriptionPlansPage';
import SubscriptionManagementPage from './pages/SubscriptionManagementPage';
import SubscriptionSuccessPage from './pages/SubscriptionSuccessPage';
import SubscriptionCancelledPage from './pages/SubscriptionCancelledPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TrackingPage from './pages/TrackingPage';
import ProfileSetup from './components/ProfileSetup';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
      {showProfileSetup && <ProfileSetup />}
    </>
  );
}

function IndexComponent() {
  const { identity } = useInternetIdentity();
  return identity ? <TwitchAccountsPage /> : <LoginPage />;
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
});

const twitchAccountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/twitch-accounts',
  component: TwitchAccountsPage,
});

const revenueDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/revenue/$accountId',
  component: RevenueDetailsPage,
});

const subscriptionPlansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription-plans',
  component: SubscriptionPlansPage,
});

const subscriptionManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription-management',
  component: SubscriptionManagementPage,
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
  component: AdminDashboardPage,
});

const trackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tracking',
  component: TrackingPage,
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
  trackingRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
}
