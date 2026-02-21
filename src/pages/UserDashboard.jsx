import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import ActivityModule from '../components/ActivityModule';
import DashboardModule from '../components/DashboardModule';
import RequirementsModule from '../components/RequirementsModule';
import { getInternProfile } from '../services';

/* Lazy-load heavy modules so they don't block initial render */
const StudentAnalyticsModule = lazy(() => import('../components/StudentAnalyticsModule'));
const StudentEvaluationModule = lazy(() => import('../components/StudentEvaluationModule'));

const TabPanel = ({ active, children }) => (
    <div
        className="h-full"
        style={{
            display: active ? 'block' : 'none',
        }}
    >
        {children}
    </div>
);

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
);

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [profileChecked, setProfileChecked] = useState(false);
    const [profileData, setProfileData] = useState(null);
    // Track which tabs have been visited so we only mount them on first visit
    const [mountedTabs, setMountedTabs] = useState({ dashboard: true });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/signin');
        } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Check if profile is completed
            getInternProfile(parsedUser.id).then(({ data }) => {
                if (!data) {
                    navigate('/complete-profile');
                } else {
                    setProfileData(data); // Store profile data
                    setProfileChecked(true);
                }
            });
        }
    }, [navigate]);

    // Mark tab as mounted when it becomes active
    useEffect(() => {
        if (activeTab && !mountedTabs[activeTab]) {
            setMountedTabs(prev => ({ ...prev, [activeTab]: true }));
        }
    }, [activeTab, mountedTabs]);

    if (!user || !profileChecked) return null;

    return (
        <DashboardLayout user={user} activeTab={activeTab} onTabChange={setActiveTab}>
            <TabPanel active={activeTab === 'dashboard'}>
                <DashboardModule user={user} profileData={profileData} />
            </TabPanel>

            <TabPanel active={activeTab === 'analytics'}>
                {mountedTabs.analytics && (
                    <Suspense fallback={<LoadingSpinner />}>
                        <StudentAnalyticsModule user={user} />
                    </Suspense>
                )}
            </TabPanel>

            <TabPanel active={activeTab === 'members'}>
                {mountedTabs.members && (
                    <Suspense fallback={<LoadingSpinner />}>
                        <StudentEvaluationModule user={user} />
                    </Suspense>
                )}
            </TabPanel>

            <TabPanel active={activeTab === 'requirements'}>
                {mountedTabs.requirements ? <RequirementsModule user={user} /> : null}
            </TabPanel>

            <TabPanel active={activeTab === 'activities'}>
                {mountedTabs.activities ? <ActivityModule user={user} /> : null}
            </TabPanel>
        </DashboardLayout>
    );
};

export default UserDashboard;

