import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import ActivityModule from '../components/ActivityModule';
import DashboardModule from '../components/DashboardModule';
import { getInternProfile } from '../services';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [profileChecked, setProfileChecked] = useState(false);

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
                    setProfileChecked(true);
                }
            });
        }
    }, [navigate]);

    if (!user || !profileChecked) return null;

    return (
        <DashboardLayout user={user} activeTab={activeTab} onTabChange={setActiveTab}>
            {
                activeTab === 'dashboard' ? (
                    <div className="animate-fade-in h-full">
                        <DashboardModule user={user} />
                    </div>
                ) : (
                    <div className="animate-fade-in h-full">
                        <ActivityModule />
                    </div>
                )
            }
        </DashboardLayout>
    );
};

export default UserDashboard;
