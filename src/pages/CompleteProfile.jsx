import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveInternProfile, saveDevice, getInternProfile } from '../services';
import Galaxy from '../components/Galaxy';

const SCHOOLS = [
    // Major Universities in Cebu City
    'University of San Carlos',
    'University of Cebu',
    'University of the Visayas',
    'University of San Jose–Recoletos',
    'Cebu Institute of Technology – University',
    'Cebu Normal University',
    'University of the Philippines Cebu',
    'Southwestern University PHINMA',
    'University of Southern Philippines Foundation',
    'Cebu Technological University',
    // Private Colleges in Cebu City
    'Asian College of Technology',
    'College of Technological Sciences – Cebu',
    'Salazar Colleges of Science and Institute of Technology',
    'Don Bosco Technical College – Cebu',
    'Cebu Eastern College',
    'CBD College',
    'AMA Computer College – Cebu City',
    'Benedicto College',
    'St. Paul College Foundation – Cebu',
    'Fashion Institute of Design and Arts Cebu',
];

const COURSES = [
    'BSIT',
    'BS Computer Engineering',
    'BS Finance/Accounting',
    'BS Psychology',
    'BSBA Marketing',
    'BSBA General Management',
];

const OJT_PROGRAMS = [
    'IT Intern',
    'Marketing Intern',
    'Finance Intern',
];

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const CIVIL_STATUSES = ['Single', 'Married', 'Widowed', 'Separated', 'Divorced'];
const DEVICE_TYPES = ['Mobile', 'Laptop'];

const CompleteProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    const [form, setForm] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        civil_status: '',
        email: '',
        mobile_number: '',
        address: '',
        school: '',
        course: '',
        ojt_program: '',
        required_ojt_hours: '',
    });

    const [device, setDevice] = useState({
        device_type: '',
        specs: '',
        serial_number: '',
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/signin');
            return;
        }
        const user = JSON.parse(storedUser);
        // Check if profile already exists
        getInternProfile(user.id).then(({ data }) => {
            if (data) {
                navigate('/dashboard');
            } else {
                setChecking(false);
            }
        });
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDeviceChange = (e) => {
        setDevice({ ...device, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setError(null);

        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/signin');
            return;
        }
        const user = JSON.parse(storedUser);

        // Save intern profile
        const { error: profileError } = await saveInternProfile({
            user_id: user.id,
            ...form,
            required_ojt_hours: Number(form.required_ojt_hours),
        });

        if (profileError) {
            setError('Failed to save profile. ' + profileError.message);
            setLoading(false);
            return;
        }

        // Save device
        if (device.device_type && device.specs && device.serial_number) {
            const { error: deviceError } = await saveDevice({
                user_id: user.id,
                ...device,
            });
            if (deviceError) {
                setError('Profile saved, but failed to save device. ' + deviceError.message);
                setLoading(false);
                return;
            }
        }

        setLoading(false);
        navigate('/dashboard');
    };

    const steps = [
        { label: 'Personal Details', icon: '👤' },
        { label: 'School & Course', icon: '🎓' },
        { label: 'OJT Program', icon: '💼' },
        { label: 'Devices', icon: '💻' },
        { label: 'Payment Method', icon: '💳' },
    ];

    const canProceedFromStep = (step) => {
        switch (step) {
            case 0:
                return form.first_name && form.last_name && form.gender && form.civil_status && form.email && form.mobile_number && form.address;
            case 1:
                return form.school && form.course;
            case 2:
                return form.ojt_program && form.required_ojt_hours;
            case 3:
                return device.device_type && device.specs && device.serial_number;
            case 4:
                return true;
            default:
                return false;
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <p className="text-white/50 text-sm">Checking profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <Galaxy
                    mouseRepulsion
                    mouseInteraction
                    density={1}
                    glowIntensity={0.3}
                    saturation={0}
                    hueShift={140}
                    twinkleIntensity={0.3}
                    rotationSpeed={0.1}
                    repulsionStrength={2}
                    autoCenterRepulsion={0}
                    starSpeed={0.5}
                    speed={1}
                />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 sm:py-12">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="h-4 w-4 rounded-full bg-yellow-400" />
                        <span className="font-bold text-xl tracking-tight">lifewood</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Complete Your Profile</h1>
                    <p className="text-[#888] text-sm">Please fill in all details before proceeding to your dashboard</p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-10 flex-wrap">
                    {steps.map((step, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentStep(i)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer
                                ${i === currentStep
                                    ? 'bg-white text-black shadow-lg shadow-white/10'
                                    : i < currentStep && canProceedFromStep(i)
                                        ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                                        : 'bg-[#1a1a1a] text-[#666] border border-[#333] hover:border-[#555]'
                                }`}
                        >
                            <span>{step.icon}</span>
                            <span className="hidden sm:inline">{step.label}</span>
                        </button>
                    ))}
                </div>

                <div onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}>
                    {/* Section Container */}
                    <div className="bg-[#111] border border-[#222] rounded-3xl p-6 sm:p-8 mb-6 min-h-[400px]">
                        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                            <span>{steps[currentStep].icon}</span>
                            {steps[currentStep].label}
                        </h2>
                        <p className="text-[#666] text-sm mb-6">
                            {currentStep === 0 && 'Enter your personal information'}
                            {currentStep === 1 && 'Select your school and course'}
                            {currentStep === 2 && 'Choose your OJT program'}
                            {currentStep === 3 && 'Enter your device information'}
                            {currentStep === 4 && 'Set up your payment method'}
                        </p>

                        {/* Step 0: Personal Details */}
                        {currentStep === 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="FIRST NAME" name="first_name" value={form.first_name} onChange={handleChange} required />
                                <InputField label="MIDDLE NAME" name="middle_name" value={form.middle_name} onChange={handleChange} />
                                <InputField label="LAST NAME" name="last_name" value={form.last_name} onChange={handleChange} required />
                                <SelectField label="GENDER" name="gender" value={form.gender} onChange={handleChange} options={GENDERS} required />
                                <SelectField label="CIVIL STATUS" name="civil_status" value={form.civil_status} onChange={handleChange} options={CIVIL_STATUSES} required />
                                <InputField label="EMAIL" name="email" value={form.email} onChange={handleChange} type="email" required />
                                <InputField label="MOBILE NUMBER" name="mobile_number" value={form.mobile_number} onChange={handleChange} type="tel" required />
                                <div className="sm:col-span-2">
                                    <InputField label="ADDRESS" name="address" value={form.address} onChange={handleChange} required />
                                </div>
                            </div>
                        )}

                        {/* Step 1: School & Course */}
                        {currentStep === 1 && (
                            <div className="grid grid-cols-1 gap-4">
                                <SelectField label="SCHOOL" name="school" value={form.school} onChange={handleChange} options={SCHOOLS} required />
                                <SelectField label="COURSE" name="course" value={form.course} onChange={handleChange} options={COURSES} required />
                            </div>
                        )}

                        {/* Step 2: OJT Program */}
                        {currentStep === 2 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SelectField label="OJT PROGRAM" name="ojt_program" value={form.ojt_program} onChange={handleChange} options={OJT_PROGRAMS} required />
                                <InputField label="REQUIRED OJT HOURS" name="required_ojt_hours" value={form.required_ojt_hours} onChange={handleChange} type="number" required />
                            </div>
                        )}

                        {/* Step 3: Devices */}
                        {currentStep === 3 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SelectField label="DEVICE TYPE" name="device_type" value={device.device_type} onChange={handleDeviceChange} options={DEVICE_TYPES} required />
                                <InputField label="SPECS" name="specs" value={device.specs} onChange={handleDeviceChange} placeholder="e.g. Intel i5, 8GB RAM, 256GB SSD" required />
                                <div className="sm:col-span-2">
                                    <InputField label="SERIAL NUMBER" name="serial_number" value={device.serial_number} onChange={handleDeviceChange} required />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Payment Method */}
                        {currentStep === 4 && (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="w-20 h-20 rounded-full bg-yellow-400/10 flex items-center justify-center mb-6">
                                    <span className="text-4xl">💳</span>
                                </div>
                                <p className="text-[#aaa] text-sm text-center mb-6 max-w-md">
                                    Please complete the payment method form by clicking the button below. This will open a Google Form in a new tab.
                                </p>
                                <a
                                    href="https://docs.google.com/forms/d/e/1FAIpQLSf8YzFLOGZOfPAsmrl8udq0Qi9cGuNf3YmrGexSUuq2_9Lt1Q/viewform"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all duration-200 shadow-lg shadow-yellow-400/20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                    Open Payment Form
                                </a>
                                <p className="text-[#555] text-xs mt-4">This opens in a new tab</p>
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm border border-red-500/20 text-center">
                            {error}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200
                                ${currentStep === 0
                                    ? 'opacity-0 pointer-events-none'
                                    : 'bg-[#1a1a1a] border border-[#333] text-[#888] hover:text-white hover:border-[#555]'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            Back
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(currentStep + 1)}
                                disabled={!canProceedFromStep(currentStep)}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-white/5 group"
                            >
                                Next
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSaveProfile}
                                disabled={loading || !canProceedFromStep(0) || !canProceedFromStep(1) || !canProceedFromStep(2) || !canProceedFromStep(3)}
                                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-green-500/20 group"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Save Profile
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-8 w-full bg-[#1a1a1a] rounded-full h-1.5 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                </div>
                <p className="text-center text-[#555] text-xs mt-2">
                    Step {currentStep + 1} of {steps.length}
                </p>
            </div>
        </div>
    );
};

// Reusable Input Field
const InputField = ({ label, name, value, onChange, type = 'text', placeholder, required }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#888] ml-1">{label} {required && <span className="text-red-400">*</span>}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            required={required}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/40 focus:ring-0 transition-all"
        />
    </div>
);

// Reusable Select Field
const SelectField = ({ label, name, value, onChange, options, required }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#888] ml-1">{label} {required && <span className="text-red-400">*</span>}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-white/40 focus:ring-0 transition-all appearance-none cursor-pointer"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '20px',
            }}
        >
            <option value="" disabled className="bg-[#111] text-[#666]">Select {label.toLowerCase()}</option>
            {options.map((opt) => (
                <option key={opt} value={opt} className="bg-[#111] text-white">{opt}</option>
            ))}
        </select>
    </div>
);

export default CompleteProfile;
