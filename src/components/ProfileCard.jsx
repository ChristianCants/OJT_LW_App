import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ user }) => {
    const navigate = useNavigate();

    // Safe name handling
    const firstName = user?.first_name || user?.username || 'User';

    return (
        <div
            onClick={() => navigate('/dashboard?tab=profile')}
            className="w-full h-36 bg-black rounded-[36px] relative overflow-hidden border border-white/10 shadow-2xl cursor-pointer hover:border-white/20 transition-all duration-300 group"
        >
            {/* Top Content */}
            <div className="absolute top-6 left-7 z-10 max-w-[120px]">
                <h2 className="text-white text-xl font-medium tracking-tight truncate leading-tight">{firstName}</h2>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Intern</p>
            </div>

            <div className="absolute top-6 right-7 z-10">
                <span className="text-white/80 text-xl font-light tracking-wider">PH</span>
            </div>

            {/* Central Arc Graphic mimicking the reference */}
            <div className="absolute bottom-0 left-0 right-0 h-20 flex justify-center items-end pb-3">
                {/* The Arc Curve */}
                <div className="absolute bottom-[-10px] w-48 h-24 border-t-[1.5px] border-emerald-500/30 rounded-t-full shadow-[0_-2px_10px_rgba(16,185,129,0.1)]" />

                {/* The 'Moon' / School Logo */}
                <div className="relative z-10 mb-6 bg-white rounded-full w-9 h-9 p-0.5 shadow-[0_0_35px_rgba(52,211,153,0.6)] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ring-2 ring-emerald-500/20">
                    {user?.schoolLogo ? (
                        <img src={user.schoolLogo} alt="School" className="w-full h-full object-contain rounded-full" />
                    ) : (
                        <div className="w-full h-full rounded-full bg-emerald-50 flex items-center justify-center">
                            <div className="w-2 h-2 bg-emerald-300 rounded-full" />
                        </div>
                    )}
                </div>
            </div>

            {/* Background Atmosphere - Green Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-emerald-500/20 blur-[60px] pointer-events-none rounded-t-full mix-blend-screen" />
        </div>
    );
};

export default ProfileCard;
