import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { Card, CardHeader, CardBody, Button } from '@/components/ui';
import { useAuthStore } from '@/store';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const { user, hasRole } = useAuthStore();

    // Redirect based on role
    const getDashboardContent = () => {
        if (!user) {
            return <div>Please log in to access your dashboard.</div>;
        }

        if (hasRole('super_admin')) {
            return <SuperAdminDashboard />;
        } else if (hasRole('hospital_owner')) {
            return <HospitalOwnerDashboard />;
        } else if (hasRole('hospital_manager')) {
            return <ManagerDashboard />;
        } else if (hasRole('doctor')) {
            return <DoctorDashboard />;
        } else if (hasRole('admin_staff')) {
            return <StaffDashboard />;
        } else {
            return <PatientDashboard />;
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Dashboard</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="dashboard-content">
                {getDashboardContent()}
            </IonContent>
        </IonPage>
    );
};

// Super Admin Dashboard
const SuperAdminDashboard: React.FC = () => (
    <div className="container dashboard-container">
        <h1 className="dashboard-title">Super Administrator</h1>
        <div className="dashboard-grid">
            <Card variant="elevated" hoverable>
                <CardHeader title="System Overview" />
                <CardBody>
                    <div className="stat-grid">
                        <div className="stat">
                            <span className="stat-value">500+</span>
                            <span className="stat-label">Hospitals</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">10,000+</span>
                            <span className="stat-label">Doctors</span>
                        </div>
                    </div>
                    <Button variant="primary" fullWidth className="mt-4">
                        View Analytics
                    </Button>
                </CardBody>
            </Card>

            <Card variant="elevated" hoverable>
                <CardHeader title="Quick Actions" />
                <CardBody>
                    <div className="action-list">
                        <Button variant="secondary" fullWidth>Manage Hospitals</Button>
                        <Button variant="secondary" fullWidth>User Management</Button>
                        <Button variant="secondary" fullWidth>System Settings</Button>
                        <Button variant="secondary" fullWidth>Audit Logs</Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    </div>
);

// Hospital Owner Dashboard
const HospitalOwnerDashboard: React.FC = () => (
    <div className="container dashboard-container">
        <h1 className="dashboard-title">Hospital Owner Dashboard</h1>
        <div className="dashboard-grid">
            <Card variant="elevated" hoverable>
                <CardHeader title="My Hospitals" />
                <CardBody>
                    <p className="text-gray-600 mb-4">Manage your hospital network</p>
                    <Button variant="primary" fullWidth>View All Branches</Button>
                </CardBody>
            </Card>

            <Card variant="elevated" hoverable>
                <CardHeader title="Revenue Overview" />
                <CardBody>
                    <div className="stat">
                        <span className="stat-value">$125,000</span>
                        <span className="stat-label">This Month</span>
                    </div>
                    <Button variant="secondary" fullWidth className="mt-4">
                        View Reports
                    </Button>
                </CardBody>
            </Card>
        </div>
    </div>
);

// Manager Dashboard
const ManagerDashboard: React.FC = () => (
    <div className="container dashboard-container">
        <h1 className="dashboard-title">Hospital Manager</h1>
        <div className="dashboard-grid">
            <Card variant="elevated" hoverable>
                <CardHeader title="Today's Appointments" />
                <CardBody>
                    <div className="stat">
                        <span className="stat-value">42</span>
                        <span className="stat-label">Scheduled Today</span>
                    </div>
                    <Button variant="primary" fullWidth className="mt-4">
                        View Schedule
                    </Button>
                </CardBody>
            </Card>

            <Card variant="elevated" hoverable>
                <CardHeader title="Quick Actions" />
                <CardBody>
                    <div className="action-list">
                        <Button variant="secondary" fullWidth>Manage Doctors</Button>
                        <Button variant="secondary" fullWidth>Service Catalog</Button>
                        <Button variant="secondary" fullWidth>Form Builder</Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    </div>
);

// Doctor Dashboard
const DoctorDashboard: React.FC = () => (
    <div className="container dashboard-container">
        <h1 className="dashboard-title">Doctor Dashboard</h1>
        <div className="dashboard-grid">
            <Card variant="elevated" hoverable>
                <CardHeader title="Today's Schedule" />
                <CardBody>
                    <div className="stat">
                        <span className="stat-value">8</span>
                        <span className="stat-label">Patients Today</span>
                    </div>
                    <Button variant="primary" fullWidth className="mt-4">
                        View Appointments
                    </Button>
                </CardBody>
            </Card>

            <Card variant="elevated" hoverable>
                <CardHeader title="Quick Actions" />
                <CardBody>
                    <div className="action-list">
                        <Button variant="secondary" fullWidth>My Schedule</Button>
                        <Button variant="secondary" fullWidth>Patient List</Button>
                        <Button variant="secondary" fullWidth>Profile Settings</Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    </div>
);

// Staff Dashboard
const StaffDashboard: React.FC = () => (
    <div className="container dashboard-container">
        <h1 className="dashboard-title">Admin Staff</h1>
        <div className="dashboard-grid">
            <Card variant="elevated" hoverable>
                <CardHeader title="Check-In Queue" />
                <CardBody>
                    <div className="stat">
                        <span className="stat-value">5</span>
                        <span className="stat-label">Waiting</span>
                    </div>
                    <Button variant="primary" fullWidth className="mt-4">
                        Check-In Patient
                    </Button>
                </CardBody>
            </Card>

            <Card variant="elevated" hoverable>
                <CardHeader title="Quick Actions" />
                <CardBody>
                    <div className="action-list">
                        <Button variant="secondary" fullWidth>Book Appointment</Button>
                        <Button variant="secondary" fullWidth>Search Patients</Button>
                        <Button variant="secondary" fullWidth>View Schedule</Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    </div>
);

// Patient Dashboard
const PatientDashboard: React.FC = () => (
    <div className="container dashboard-container">
        <h1 className="dashboard-title">My Health Dashboard</h1>
        <div className="dashboard-grid">
            <Card variant="elevated" hoverable>
                <CardHeader title="Upcoming Appointments" />
                <CardBody>
                    <p className="text-gray-600 mb-4">You have no upcoming appointments</p>
                    <Button variant="primary" fullWidth>Book Appointment</Button>
                </CardBody>
            </Card>

            <Card variant="elevated" hoverable>
                <CardHeader title="Medical Records" />
                <CardBody>
                    <div className="action-list">
                        <Button variant="secondary" fullWidth>View History</Button>
                        <Button variant="secondary" fullWidth>Update Profile</Button>
                        <Button variant="secondary" fullWidth>Saved Hospitals</Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    </div>
);

export default Dashboard;
