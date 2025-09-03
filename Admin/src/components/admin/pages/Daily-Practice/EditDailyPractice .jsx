
import React, { useState, useEffect } from "react";
import { ArrowLeft, Upload, Save, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_FRONTEND_API_URL;

// API Services
const getCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/api/categories`);
        const data = await response.json();
        return data.status ? data.data : [];
    } catch (error) {
        console.error("Error fetching categories:", error);
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


const getDailyPracticeById = async (id) => {
    try {
        console.log("Fetching practice with ID:", id);
        const response = await fetch(`${API_URL}/api/daily-practices/${id}`);
        const data = await response.json();
        console.log("API Response:", data);
        return data.status ? data.data : null;
    } catch (error) {
        console.error("Error fetching daily practice:", error);
        return null;
    }
};

const updateDailyPractice = async (id, formData) => {
    try {
        const response = await fetch(`${API_URL}/api/daily-practices/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
            },
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating daily practice:", error);
        return { status: false, message: "Network error" };
    }
};

const EditDailyPractice = ({ onBack, onSuccess }) => {
    // Get ID from URL parameters
    const { id: practiceId } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [goals, setGoals] = useState([]);
    const [emotions, setEmotions] = useState([]);
    const [singers, setSingers] = useState([]);
    
    const [formData, setFormData] = useState({
        category_id: "",
        title: "",
        description: "",
        media_type: "video",
        media_url: "",
        cover_image: "",
        total_length: "",
        total_view_count: 1,
        emotionId: "",
        goalIds: [],
        singerId: "",
    });
    
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaFilePreview, setMediaFilePreview] = useState("");
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    // Add state to track if cover image should be deleted
    const [deleteCoverImage, setDeleteCoverImage] = useState(false);
    const [deleteMediaFile, setDeleteMediaFile] = useState(false);

    // Fetch all required data on component mount
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [categoriesData, goalsData, emotionsData, singersData] = await Promise.all([
                    getCategories(),
                    getGoalMasters (),
                    getEmotions(),
                    getSingerMasters()
                ]);
                
                setCategories(categoriesData);
                setGoals(goalsData);
                setEmotions(emotionsData);
                setSingers(singersData);
            } catch (error) {
                console.error("Error loading data:", error);
                setError("Failed to load required data");
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchAllData();
    }, []);

    // Fetch practice data
    useEffect(() => {
        const fetchPractice = async () => {
            if (!practiceId) {
                setError("Practice ID not found in URL");
                setLoadingData(false);
                return;
            }

            try {
                console.log("Starting to fetch practice with ID:", practiceId);
                const practice = await getDailyPracticeById(practiceId);

                if (practice) {
                    console.log("Practice data received:", practice);
                    
                    // Parse goalIds if it's a string
                    let goalIds = [];
                    if (practice.goalIds) {
                        try {
                            goalIds = typeof practice.goalIds === 'string' 
                                ? JSON.parse(practice.goalIds) 
                                : practice.goalIds;
                            // Ensure it's an array
                            goalIds = Array.isArray(goalIds) ? goalIds : [];
                        } catch (e) {
                            console.error("Error parsing goalIds:", e);
                            goalIds = [];
                        }
                    }
                    
                    setFormData({
                        category_id: practice.category_id || "",
                        title: practice.title || "",
                        description: practice.description || "",
                        media_type: practice.media_type || "video",
                        media_url: practice.media_url || "",
                        cover_image: practice.cover_image || "",
                        total_length: practice.total_length || "",
                        total_view_count: practice.total_view_count || 1,
                        emotionId: practice.emotionId || "",
                        goalIds: goalIds,
                        singerId: practice.singerId || "",
                    });
                    
                    // Set existing cover image preview
                    if (practice.cover_image) {
                        setCoverImagePreview(`${API_URL}${practice.cover_image}`);
                    }

                    // Set existing media file preview if it's an image
                    if (practice.media_url && practice.media_type === 'image') {
                        setMediaFilePreview(`${API_URL}${practice.media_url}`);
                    }
                    
                    setError(""); // Clear any previous errors
                } else {
                    setError("Practice not found or failed to load");
                }
            } catch (error) {
                console.error("Error in fetchPractice:", error);
                setError("Failed to load practice data");
            } finally {
                setLoadingData(false);
            }
        };

        fetchPractice();
    }, [practiceId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGoalChange = (goalId) => {
        setFormData((prev) => {
            const currentGoalIds = prev.goalIds || [];
            const isSelected = currentGoalIds.includes(parseInt(goalId));
            
            let newGoalIds;
            if (isSelected) {
                // Remove the goal
                newGoalIds = currentGoalIds.filter(id => id !== parseInt(goalId));
            } else {
                // Add the goal
                newGoalIds = [...currentGoalIds, parseInt(goalId)];
            }
            
            return {
                ...prev,
                goalIds: newGoalIds,
            };
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
            setDeleteMediaFile(false); // Reset delete flag when new file is selected
            const fileType = file.type.split("/")[0];
            
            // Update media type based on file type
            if (fileType === "audio" || fileType === "video" || fileType === "image") {
                setFormData((prev) => ({
                    ...prev,
                    media_type: fileType,
                }));
            }

            // Create preview for images
            if (fileType === "image") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setMediaFilePreview(e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                // Clear preview for non-image files
                setMediaFilePreview("");
            }
        }
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError("Please select an image file for cover image");
                return;
            }
            
            setCoverImageFile(file);
            setDeleteCoverImage(false); // Reset delete flag when new file is selected
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeCoverImage = () => {
        setCoverImageFile(null);
        setCoverImagePreview("");
        setDeleteCoverImage(true); // Set flag to delete cover image
        setFormData(prev => ({
            ...prev,
            cover_image: ""
        }));
        
        // Clear the file input
        const fileInput = document.getElementById('coverImageInput');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const removeMediaFile = () => {
        setMediaFile(null);
        setMediaFilePreview("");
        setDeleteMediaFile(true); // Set flag to delete media file
        
        // Clear the file input
        const fileInput = document.getElementById('mediaFileInput');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const submitData = new FormData();

            // Add all form data
            Object.keys(formData).forEach((key) => {
                if (key === 'goalIds') {
                    // Convert goalIds array to JSON string
                    submitData.append(key, JSON.stringify(formData[key]));
                } else if (formData[key] !== "") {
                    submitData.append(key, formData[key]);
                }
            });

            if (mediaFile) {
                submitData.append("mediaFile", mediaFile);
            }

            if (coverImageFile) {
                submitData.append("coverImage", coverImageFile);
            }

            // Add flags to indicate if files should be deleted
            if (deleteCoverImage) {
                submitData.append("deleteCoverImage", "true");
            }

            if (deleteMediaFile) {
                submitData.append("deleteMediaFile", "true");
            }

            const result = await updateDailyPractice(practiceId, submitData);

            if (result.status) {
                setSuccess("Daily practice updated successfully!");
                setTimeout(() => {
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        navigate("/admin/dashboard/daily-practices");
                    }
                }, 1500);
            } else {
                setError(result.message || "Failed to update daily practice");
            }
        } catch (error) {
            setError("An error occurred while updating the practice");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate("/admin/dashboard/daily-practices");
        }
    };

    // Helper function to get selected goal names
    const getSelectedGoalNames = () => {
        if (!formData.goalIds || formData.goalIds.length === 0) return "No goals selected";
        return formData.goalIds
            .map(goalId => {
                const goal = goals.find(g => g.id === goalId);
                return goal ? goal.title || goal.name : `Goal ${goalId}`;
            })
            .join(", ");
    };

    // Helper function to get emotion name
    const getEmotionName = (emotionId) => {
        if (!emotionId) return "";
        const emotion = emotions.find(e => e.id === parseInt(emotionId));
        return emotion ? emotion.title || emotion.name : "";
    };

    // Helper function to get singer name
    const getSingerName = (singerId) => {
        if (!singerId) return "";
        const singer = singers.find(s => s.id === parseInt(singerId));
        return singer ? singer.name || singer.title : "";
    };

    // Show loading state while data is being fetched
    if (loadingData || loadingCategories) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="ml-3 text-gray-600">
                    {loadingData ? "Loading practice data..." : "Loading categories..."}
                </p>
            </div>
        );
    }

    // Show error if practice ID is missing
    if (!practiceId) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                        <p className="text-gray-600 mb-4">Practice ID not found in URL</p>
                        <button
                            onClick={handleBack}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto md:p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                    <button
                        onClick={handleBack}
                        className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl md:text-3xl font-bold text-gray-800">
                        Edit Daily Practice {practiceId && `(ID: ${practiceId})`}
                    </h1>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Category</option>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>
                                        No categories available
                                    </option>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Media Type *
                            </label>
                            <select
                                name="media_type"
                                value={formData.media_type}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                                <option value="audio">Audio</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            maxLength="100"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* New section for Emotion, Singer, and Goals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Emotion
                            </label>
                            <select
                                name="emotionId"
                                value={formData.emotionId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Emotion</option>
                                {emotions.map((emotion) => (
                                    <option key={emotion.id} value={emotion.id}>
                                        {emotion.title || emotion.name}
                                    </option>
                                ))}
                            </select>
                            {formData.emotionId && (
                                <p className="mt-1 text-sm text-gray-600">
                                    Selected: {getEmotionName(formData.emotionId)}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Singer
                            </label>
                            <select
                                name="singerId"
                                value={formData.singerId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Singer</option>
                                {singers.map((singer) => (
                                    <option key={singer.id} value={singer.id}>
                                        {singer.name || singer.title}
                                    </option>
                                ))}
                            </select>
                            {formData.singerId && (
                                <p className="mt-1 text-sm text-gray-600">
                                    Selected: {getSingerName(formData.singerId)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Goals Multi-Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Goals (Multiple Selection)
                        </label>
                        <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                            {goals.length > 0 ? (
                                goals.map((goal) => (
                                    <div key={goal.id} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            id={`goal-${goal.id}`}
                                            checked={formData.goalIds.includes(goal.id)}
                                            onChange={() => handleGoalChange(goal.id)}
                                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label
                                            htmlFor={`goal-${goal.id}`}
                                            className="text-sm text-gray-700 cursor-pointer"
                                        >
                                            {goal.title || goal.name}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No goals available</p>
                            )}
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            <strong>Selected Goals:</strong> {getSelectedGoalNames()}
                        </p>
                    </div>

                    {/* Cover Image and Media File Upload - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cover Image Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Image
                            </label>
                            
                            {/* Current Cover Image or Preview */}
                            {coverImagePreview && (
                                <div className="mb-4 relative inline-block">
                                    <img
                                        src={coverImagePreview}
                                        alt="Cover preview"
                                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeCoverImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            
                            {/* Cover Image Upload */}
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-6 h-6 mb-2 text-gray-500" />
                                        <p className="mb-1 text-xs text-gray-500">
                                            <span className="font-semibold">Click to upload</span>
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
                                    </div>
                                    <input
                                        id="coverImageInput"
                                        type="file"
                                        onChange={handleCoverImageChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {coverImageFile && (
                                <p className="mt-2 text-sm text-gray-600">
                                    New cover image: {coverImageFile.name}
                                </p>
                            )}
                            {deleteCoverImage && !coverImageFile && (
                                <p className="mt-2 text-sm text-red-600">
                                    Cover image will be deleted
                                </p>
                            )}
                        </div>

                        {/* Media File Upload Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload New Media File
                            </label>
                            
                            {/* Media File Preview (only for images) */}
                            {mediaFilePreview && (
                                <div className="mb-4 relative inline-block">
                                    <img
                                        src={mediaFilePreview}
                                        alt="Media preview"
                                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeMediaFile}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-6 h-6 mb-2 text-gray-500" />
                                        <p className="mb-1 text-xs text-gray-500">
                                            <span className="font-semibold">Click to upload</span>
                                        </p>
                                        <p className="text-xs text-gray-500">MP4, MP3, WAV, Images</p>
                                    </div>
                                    <input
                                        id="mediaFileInput"
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="video/*,audio/*,image/*"
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {mediaFile && (
                                <p className="mt-2 text-sm text-gray-600">
                                    New file: {mediaFile.name}
                                </p>
                            )}
                            {deleteMediaFile && !mediaFile && (
                                <p className="mt-2 text-sm text-red-600">
                                    Media file will be deleted
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="md:flex space-x-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? "Updating..." : "Update Practice"}
                        </button>
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 my-4 md:my-0 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDailyPractice;