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
import AIAssistantPage from './pages/AIAssistantPage';
import ChatRoomPage from './pages/ChatRoomPage';
import DiscordToolsPage from './pages/DiscordToolsPage';
import FinanceTrackerPage from './pages/FinanceTrackerPage';
import CalculatorPage from './pages/CalculatorPage';
import DonationManagerPage from './pages/DonationManagerPage';
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

function AIAssistantComponent() {
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

  return <AIAssistantPage />;
}

function ChatRoomComponent() {
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

  return <ChatRoomPage />;
}

function DiscordToolsComponent() {
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

  return <DiscordToolsPage />;
}

function FinanceTrackerComponent() {
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

  return <FinanceTrackerPage />;
}

function CalculatorComponent() {
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

  return <CalculatorPage />;
}

function DonationManagerComponent() {
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

  return <DonationManagerPage />;
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

const aiAssistantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-assistant',
  component: AIAssistantComponent,
});

const chatRoomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat-room',
  component: ChatRoomComponent,
});

const discordToolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/discord-tools',
  component: DiscordToolsComponent,
});

const financeTrackerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/finance-tracker',
  component: FinanceTrackerComponent,
});

const calculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculator',
  component: CalculatorComponent,
});

const donationManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/donation-manager',
  component: DonationManagerComponent,
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
  aiAssistantRoute,
  chatRoomRoute,
  discordToolsRoute,
  financeTrackerRoute,
  calculatorRoute,
  donationManagerRoute,
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
