

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Upload, Save, X, Music, Image as ImageIcon, Video, Mic, Search, Check, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

// Custom Multi-Select Component for Goals
const GoalSelector = ({ options, selectedIds, onChange, placeholder = "Select goals..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(option =>
        option.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedGoals = options.filter(option => selectedIds.includes(option.id));

    const toggleOption = (optionId) => {
        const newSelectedIds = selectedIds.includes(optionId)
            ? selectedIds.filter(id => id !== optionId)
            : [...selectedIds, optionId];
        onChange(newSelectedIds);
    };

    const removeGoal = (optionId) => {
        const newSelectedIds = selectedIds.filter(id => id !== optionId);
        onChange(newSelectedIds);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Selected Goals Display */}
            {selectedGoals.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {selectedGoals.map(goal => (
                        <div
                            key={goal.id}
                            className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                            <span className="mr-2">{goal.title}</span>
                            <button
                                type="button"
                                onClick={() => removeGoal(goal.id)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Selector Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white text-left flex items-center justify-between"
            >
                <span className={selectedIds.length > 0 ? "text-gray-900" : "text-gray-500"}>
                    {selectedIds.length > 0 
                        ? `${selectedIds.length} goal(s) selected` 
                        : placeholder
                    }
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-64 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search goals..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-48 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => {
                                const isSelected = selectedIds.includes(option.id);
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => toggleOption(option.id)}
                                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                                            isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                        }`}
                                    >
                                        <span className="text-sm">{option.title}</span>
                                        {isSelected && (
                                            <Check className="w-4 h-4 text-blue-600" />
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No goals found
                            </div>
                        )}
                    </div>

                    {/* Clear All / Select All */}
                    {options.length > 0 && (
                        <div className="border-t border-gray-200 p-2 flex justify-between">
                            <button
                                type="button"
                                onClick={() => onChange([])}
                                className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded transition-colors"
                                disabled={selectedIds.length === 0}
                            >
                                Clear All
                            </button>
                            <button
                                type="button"
                                onClick={() => onChange(options.map(opt => opt.id))}
                                className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded transition-colors"
                                disabled={selectedIds.length === options.length}
                            >
                                Select All
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const createDailyPractice = async (formData) => {
    try {
        const response = await fetch(`${API_URL}/api/daily-practices`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
            },
            body: formData
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating daily practice:', error);
        return { status: false, message: 'Network error' };
    }
};

const getCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/api/categories`);
        const data = await response.json();
        return data.status ? data.data : [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

const getGoalMasters = async () => {
    try {
        const response = await fetch(`${API_URL}/api/goal-masters/admin/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data.status ? data.data : [];
    } catch (error) {
        console.error('Error fetching goal masters:', error);
        return [];
    }
};

const getEmotions = async () => {
    try {
        const response = await fetch(`${API_URL}/api/emotion-masters/admin/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data.status ? data.data : [];
    } catch (error) {
        console.error('Error fetching emotions:', error);
        return [];
    }
};

const getSingerMasters = async () => {
    try {
        const response = await fetch(`${API_URL}/api/singer-masters/admin/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data.status ? data.data : [];
    } catch (error) {
        console.error('Error fetching singer masters:', error);
        return [];
    }
};

const getMediaDuration = (file) => {
    return new Promise((resolve) => {
        const media = document.createElement(file.type.startsWith('video/') ? 'video' : 'audio');
        media.preload = 'metadata';
        media.onloadedmetadata = () => {
            const duration = media.duration;
            const mins = Math.floor(duration / 60);
            const secs = Math.floor(duration % 60);
            const formatted = `${mins}:${secs.toString().padStart(2, '0')}`;
            resolve(formatted);
        };
        media.onerror = () => resolve(null);
        media.src = URL.createObjectURL(file);
    });
};

const convertTimeToFloat = (timeString) => {
    if (!timeString) return 0;
    const [minutes, seconds] = timeString.split(':').map(Number);
    return parseFloat(`${minutes}.${seconds.toString().padStart(2, '0')}`);
};

const convertFloatToTime = (floatValue) => {
    if (!floatValue) return '';
    const floatStr = floatValue.toString();
    const [minutes, seconds] = floatStr.split('.');
    return `${minutes}:${(seconds || '00').padStart(2, '0')}`;
};

const getMediaTypeFromFile = (file) => {
    const type = file.type.toLowerCase();
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.startsWith('image/')) return 'image';
    const ext = file.name.split('.').pop().toLowerCase();
    if (['mp4', 'avi', 'mov', 'webm'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'aac', 'flac'].includes(ext)) return 'audio';
    if (['jpg', 'jpeg', 'png'].includes(ext)) return 'image';
    return null;
};

const validateFileType = (file, expectedType) => getMediaTypeFromFile(file) === expectedType;

const validateDurationFormat = (duration) => {
    if (!duration) return false;
    const mmssPattern = /^\d{1,2}:\d{2}$/;
    return mmssPattern.test(duration);
};

const MediaTypeIcon = ({ type, className }) => {
    const icons = {
        video: Video,
        audio: Mic,
        image: ImageIcon,
        singer: Music
    };
    const Icon = icons[type] || Video;
    return <Icon className={className} />;
};

const AddDailyPractice = ({ onBack, onSuccess }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category_id: '',
        title: '',
        description: '',
        media_type: 'video',
        media_url: '',
        total_length: 0,
        goalIds: [],
        emotionId: '',
        singerId: ''
    });

    const [durationDisplay, setDurationDisplay] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [fileTypeError, setFileTypeError] = useState('');
    const [coverImageError, setCoverImageError] = useState('');
    const [durationError, setDurationError] = useState('');
    const [loading, setLoading] = useState(false);

    // State for dropdown data
    const [categories, setCategories] = useState([]);
    const [goalMasters, setGoalMasters] = useState([]);
    const [emotions, setEmotions] = useState([]);
    const [singerMasters, setSingerMasters] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [categoriesData, goalMastersData, emotionsData, singerMastersData] = await Promise.all([
                getCategories(),
                getGoalMasters(),
                getEmotions(),
                getSingerMasters()
            ]);

            setCategories(categoriesData);
            setGoalMasters(goalMastersData);
            setEmotions(emotionsData);
            setSingerMasters(singerMastersData);
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'total_length') {
            setDurationDisplay(value);
            const floatValue = convertTimeToFloat(value);
            setFormData(prev => ({ ...prev, total_length: floatValue }));

            if (formData.media_type !== 'image') {
                if (value && !validateDurationFormat(value)) {
                    setDurationError('Please enter duration in mm:ss format (e.g., 1:30)');
                } else {
                    setDurationError('');
                }
            }
        } else if (name === 'media_type') {
            setFormData(prev => ({ ...prev, [name]: value }));
            setFileTypeError('');
            setDurationError('');

            if (value === 'image') {
                setFormData(prev => ({ ...prev, total_length: 0 }));
                setDurationDisplay('');
            }

            if (mediaFile && !validateFileType(mediaFile, value)) {
                setFileTypeError(`File doesn't match ${value} type.`);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Updated handler for goal selection using the new selector
    const handleGoalMasterChange = (selectedGoalIds) => {
        setFormData(prev => ({ ...prev, goalIds: selectedGoalIds }));
    };

    const handleEmotionChange = (e) => {
        setFormData(prev => ({ ...prev, emotionId: e.target.value }));
    };

    const handleSingerMasterChange = (e) => {
        const value = e.target.value ? parseInt(e.target.value) : '';
        setFormData(prev => ({ ...prev, singerId: value }));
    };

    const createImagePreview = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setMediaPreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setMediaPreview(null);
        }
    };

    const createCoverImagePreview = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setCoverImagePreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setCoverImagePreview(null);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setMediaFile(null);
            setFileTypeError('');
            setMediaPreview(null);
            return;
        }

        if (!validateFileType(file, formData.media_type)) {
            setFileTypeError(`File doesn't match ${formData.media_type} type.`);
            setMediaFile(null);
            setMediaPreview(null);
            return;
        }

        setMediaFile(file);
        setFileTypeError('');

        if (formData.media_type === 'image') {
            createImagePreview(file);
            setFormData(prev => ({ ...prev, total_length: 0 }));
            setDurationDisplay('');
        } else {
            setMediaPreview(null);
            try {
                const duration = await getMediaDuration(file);
                if (duration) {
                    setDurationDisplay(duration);
                    const floatValue = convertTimeToFloat(duration);
                    setFormData(prev => ({ ...prev, total_length: floatValue }));
                    setDurationError('');
                }
            } catch (error) {
                console.error('Error getting media duration:', error);
            }
        }
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setCoverImageFile(null);
            setCoverImagePreview(null);
            setCoverImageError('');
            return;
        }

        if (!file.type.startsWith('image/')) {
            setCoverImageError('Please select a valid image file.');
            setCoverImageFile(null);
            setCoverImagePreview(null);
            return;
        }

        setCoverImageFile(file);
        setCoverImageError('');
        createCoverImagePreview(file);
    };

    const removeCoverImage = () => {
        setCoverImageFile(null);
        setCoverImagePreview(null);
        setCoverImageError('');
        const coverInput = document.querySelector('input[name="cover_image"]');
        if (coverInput) coverInput.value = '';
    };

    const removeMediaFile = () => {
        setMediaFile(null);
        setMediaPreview(null);
        setFileTypeError('');
        const mediaInput = document.querySelector('input[type="file"]:not([name="cover_image"])');
        if (mediaInput) mediaInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!mediaFile && !formData.media_url.trim()) {
            toast.error('Please provide a media file or URL.', { autoClose: 1500 });
            setLoading(false);
            return;
        }

        if (formData.media_type !== 'image') {
            if (!durationDisplay || !validateDurationFormat(durationDisplay)) {
                toast.error('Please provide a valid duration in mm:ss format (e.g., 1:30).', { autoClose: 1500 });
                setLoading(false);
                return;
            }
        }

        const submitData = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'total_length') {
                const lengthValue = formData.media_type === 'image' ? 0 : (value || 0);
                submitData.append(key, lengthValue.toString());
            } else if (key === 'goalIds') {
                submitData.append(key, JSON.stringify(value));
            } else if (key === 'singerId') {
                if (value !== null && value !== undefined && value !== '') {
                    submitData.append(key, value.toString());
                }
            } else if (value !== null && value !== undefined && value !== '') {
                submitData.append(key, value.toString());
            }
        });

        if (mediaFile) {
            submitData.append('mediaFile', mediaFile);
        }

        if (coverImageFile) {
            submitData.append('coverImage', coverImageFile);
        }

        console.log('Form data being sent:');
        for (let [key, value] of submitData.entries()) {
            console.log(`${key}:`, value);
        }

        const result = await createDailyPractice(submitData);
        setLoading(false);

        if (result.status) {
            toast.success('Practice created successfully!', { autoClose: 1500 });
            onSuccess?.();
            setTimeout(() => navigate('/admin/dashboard/daily-practices'), 1500);
        } else {
            toast.error(result.message || 'Failed to create practice.', { autoClose: 1500 });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-2 sm:px-4 lg:px-8">
            <ToastContainer position="top-right" autoClose={1500} />
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden">
                    <div className=" px-6 py-4 ">
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={onBack || (() => navigate('/admin/dashboard/daily-practices'))}
                                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-xl md:text-2xl font-bold">
                                Create Daily Practice
                            </h1>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Upload className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Media Type */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Media Type <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        name="media_type"
                                        value={formData.media_type}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                                    >
                                        <option value="video">Video</option>
                                        <option value="audio">Audio</option>
                                        <option value="image">Image</option>
                                    </select>
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <MediaTypeIcon type={formData.media_type} className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="mt-6 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                                placeholder="Enter practice title..."
                            />
                        </div>

                        {/* Description */}
                        <div className="mt-6 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white resize-none"
                                placeholder="Describe your daily practice..."
                            />
                        </div>
                    </div>

                    {/* Selection Options Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Music className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Categories & Options</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Goal Masters - Updated with React Selector */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Goal Masters
                                </label>
                                <GoalSelector
                                    options={goalMasters}
                                    selectedIds={formData.goalIds}
                                    onChange={handleGoalMasterChange}
                                    placeholder="Select goals..."
                                />
                            </div>

                            {/* Emotion */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Emotion
                                </label>
                                <select
                                    value={formData.emotionId}
                                    onChange={handleEmotionChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                                >
                                    <option value="">Select Emotion</option>
                                    {emotions.map(emotion => (
                                        <option key={emotion.id} value={emotion.id}>
                                            {emotion.title}
                                        </option>
                                    ))}
                                </select>
                                {formData.emotionId && (
                                    <div className="mt-2 p-2 bg-green-50 rounded-lg">
                                        <p className="text-sm text-green-700 font-medium">
                                            ✓ Emotion selected
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Singer Master */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Singer Master
                                </label>
                                <select
                                    value={formData.singerId}
                                    onChange={handleSingerMasterChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 hover:bg-white"
                                >
                                    <option value="">Select Singer</option>
                                    {singerMasters.map(singer => (
                                        <option key={singer.id} value={singer.id}>
                                            {singer.name}
                                        </option>
                                    ))}
                                </select>
                                {formData.singerId && (
                                    <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                                        <p className="text-sm text-purple-700 font-medium">
                                            ✓ Singer selected
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* Media Upload Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Upload className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Media Files</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Cover Image */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Cover Image
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                                    <input
                                        type="file"
                                        name="cover_image"
                                        accept="image/*"
                                        onChange={handleCoverImageChange}
                                        className="hidden"
                                        id="cover-upload"
                                    />
                                    <label htmlFor="cover-upload" className="cursor-pointer">
                                        {coverImagePreview ? (
                                            <div className="relative inline-block">
                                                <img
                                                    src={coverImagePreview}
                                                    alt="Cover preview"
                                                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeCoverImage}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-gray-500">
                                                <Upload className="w-8 h-8 mx-auto mb-2" />
                                                <p className="text-sm">Click to upload cover image</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                {coverImageError && (
                                    <p className="text-red-600 text-sm">{coverImageError}</p>
                                )}
                            </div>

                            {/* Main Media File */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Media File <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                                    <input
                                        type="file"
                                        accept={
                                            formData.media_type === 'video'
                                                ? 'video/*'
                                                : formData.media_type === 'audio'
                                                    ? 'audio/*'
                                                    : 'image/*'
                                        }
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="media-upload"
                                    />
                                    <label htmlFor="media-upload" className="cursor-pointer">
                                        {mediaFile ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <MediaTypeIcon type={formData.media_type} className="w-6 h-6 text-blue-500" />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {mediaFile.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={removeMediaFile}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {durationDisplay && formData.media_type !== 'image' && (
                                                    <p className="text-sm text-gray-600">
                                                        Duration: {durationDisplay}
                                                    </p>
                                                )}
                                                {mediaPreview && formData.media_type === 'image' && (
                                                    <img
                                                        src={mediaPreview}
                                                        alt="Media preview"
                                                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 mx-auto"
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-gray-500">
                                                <MediaTypeIcon type={formData.media_type} className="w-8 h-8 mx-auto mb-2" />
                                                <p className="text-sm">Click to upload {formData.media_type} file</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                {fileTypeError && (
                                    <p className="text-red-600 text-sm">{fileTypeError}</p>
                                )}
                            </div>
                        </div>

                        {/* Duration Input */}
                        {formData.media_type !== 'image' && (
                            <div className="mt-6 max-w-md">
                                <label className="block text-sm font-medium mb-1">
                                Duration (mm:ss format) *
                            </label>
                            <input
                                type="text"
                                name="total_length"
                                value={durationDisplay}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., 1:30, 12:45"
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {durationError && <p className="text-red-600 mt-1 text-sm">{durationError}</p>}

                        </div>
                    )}

                    {/* Show message for image type */}
                    {formData.media_type === 'image' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> Duration is not applicable for image media type.
                            </p>
                        </div>
                    )}
                </div>
                    {/* Debug section showing selected values */}
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Values:</h4>
                        <div className="text-xs text-gray-600 space-y-1">
                            <p><strong>Goal Masters:</strong> {JSON.stringify(formData.goalIds)}</p>
                            <p><strong>Emotion:</strong> {formData.emotionId || 'None selected'}</p>
                            <p><strong>Singer Masters:</strong> {JSON.stringify(formData.singerId)}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            type="submit"
                            disabled={loading || fileTypeError || coverImageError || durationError}
                            className="flex items-center bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                        <button
                            type="button"
                            onClick={onBack || (() => navigate('/admin/dashboard/daily-practices'))}
                            className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDailyPractice;