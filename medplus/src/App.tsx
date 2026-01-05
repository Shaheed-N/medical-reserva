import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Features
import { Home, Dashboard } from './features/dashboard';
import { Login } from './features/auth';


// Store
import { useAuthStore } from './store';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

/* Custom Design System */
import './styles/design-system.css';

setupIonicReact({
  mode: 'ios', // Use iOS style for consistent premium look
});

// Initialize React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const AppContent: React.FC = () => {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Loading MedPlus...</p>
      </div>
    );
  }

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Public Routes */}
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/home">
          <Redirect to="/" />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>

        {/* TODO: Add more routes as features are built */}
        {/* <Route path="/hospitals" component={HospitalSearch} /> */}
        {/* <Route path="/hospital/:slug" component={HospitalProfile} /> */}
        {/* <Route path="/doctor/:id" component={DoctorProfile} /> */}
        {/* <Route path="/book/:serviceId" component={BookingFlow} /> */}
        {/* <Route path="/appointments" component={PatientAppointments} /> */}
        {/* <Route path="/dashboard" component={AdminDashboard} /> */}
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <IonApp>
      <AppContent />
    </IonApp>
  </QueryClientProvider>
);

export default App;

