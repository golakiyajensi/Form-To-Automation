import React, { useState, useRef, useEffect } from 'react';

const PrivacyTermsEditor = () => {
  const [activeTab, setActiveTab] = useState('privacy');
  const [privacyContent, setPrivacyContent] = useState('');
  const [termsContent, setTermsContent] = useState('');
  const [privacyId, setPrivacyId] = useState(null);
  const [termsId, setTermsId] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isTinyMCELoaded, setIsTinyMCELoaded] = useState(false);
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const editorRef = useRef(null);
  const scriptLoadedRef = useRef(false);
  const currentContentRef = useRef('');
  const contentChangingRef = useRef(false);
  const editorInstanceRef = useRef(null);

  // API Configuration
  const API_URL = import.meta.env.VITE_FRONTEND_API_URL; // Replace with your actual API URL

  // Get API key from environment (use 'no-api-key' as fallback for testing)
  const getApiKey = () => {
    return import.meta.env.VITE_TINYMCE_API_KEY; // Replace with your actual TinyMCE API key
  };

  // Get auth token (you'll need to implement this based on your auth system)
  const getAuthToken = () => {
    return localStorage?.getItem("admin_token");
  };

  // API call helper
  const makeAPICall = async (endpoint, method = 'GET', data = null) => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token && token !== 'your-auth-token-here') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'API call failed');
      }
      
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Load existing content on component mount
  useEffect(() => {
    loadExistingContent();
  }, []);

  const loadExistingContent = async () => {
    setIsLoading(true);
    try {
      // Load Privacy Policy
      try {
        const privacyResponse = await makeAPICall('/api/admin/privacy-policy/');
        if (privacyResponse.status && privacyResponse.data && privacyResponse.data.length > 0) {
          const latestPolicy = privacyResponse.data[0];
          setPrivacyContent(latestPolicy.detail || '');
          setPrivacyId(latestPolicy.id);
        }
      } catch (error) {
        console.log('No existing privacy policy found or error loading:', error.message);
      }

      // Load Terms & Conditions
      try {
        const termsResponse = await makeAPICall('/api/admin/terms-conditions/');
        if (termsResponse.status && termsResponse.data && termsResponse.data.length > 0) {
          const latestTerms = termsResponse.data[0];
          setTermsContent(latestTerms.detail || '');
          setTermsId(latestTerms.id);
        }
      } catch (error) {
        console.log('No existing terms found or error loading:', error.message);
      }
    } catch (error) {
      console.error('Error loading existing content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // TinyMCE configuration
  const editorConfig = {
    apiKey: getApiKey(),
    height: 500,
    menubar: true,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | ' +
      'bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help',
    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
    skin: 'oxide',
    content_css: 'default',
    branding: false,
    promotion: false,
    setup: (editor) => {
      editorInstanceRef.current = editor;
      
      editor.on('init', () => {
        console.log('Editor initialized for tab:', activeTab);
        setEditorInitialized(true);
        
        // Set initial content based on active tab
        const content = activeTab === 'privacy' ? privacyContent : termsContent;
        if (content && !contentChangingRef.current) {
          editor.setContent(content);
        }
        currentContentRef.current = content;
      });
      
      // Use a debounced approach to handle content changes
      let changeTimeout;
      editor.on('input change keyup paste', () => {
        if (contentChangingRef.current) return;
        
        clearTimeout(changeTimeout);
        changeTimeout = setTimeout(() => {
          const content = editor.getContent();
          currentContentRef.current = content;
          handleEditorChange(content);
        }, 300); // 300ms debounce
      });
    }
  };

  // Load TinyMCE from CDN
  useEffect(() => {
    if (scriptLoadedRef.current || window.tinymce) {
      setIsTinyMCELoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://cdn.tiny.cloud/1/${getApiKey()}/tinymce/6/tinymce.min.js`;
    script.referrerPolicy = 'origin';
    
    script.onload = () => {
      scriptLoadedRef.current = true;
      setIsTinyMCELoaded(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load TinyMCE');
    };

    document.head.appendChild(script);

    return () => {
      if (window.tinymce) {
        window.tinymce.remove();
      }
    };
  }, []);

  // Initialize TinyMCE when loaded - REMOVED content dependencies
  useEffect(() => {
    if (!isTinyMCELoaded || !window.tinymce) return;

    const initEditor = () => {
      // Remove existing editor if any
      if (window.tinymce.get('tinymce-editor')) {
        window.tinymce.get('tinymce-editor').destroy();
      }

      // Reset initialization state
      setEditorInitialized(false);

      // Initialize new editor
      window.tinymce.init({
        selector: '#tinymce-editor',
        ...editorConfig
      });
    };

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(initEditor, 100);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [isTinyMCELoaded]); // Removed activeTab, privacyContent, termsContent dependencies

  // Handle tab switching with proper content management
  useEffect(() => {
    if (!editorInstanceRef.current || !editorInitialized) return;

    const editor = editorInstanceRef.current;
    const newContent = activeTab === 'privacy' ? privacyContent : termsContent;
    
    // Only update editor content if it's different and we're not in the middle of editing
    if (newContent !== currentContentRef.current && !contentChangingRef.current) {
      contentChangingRef.current = true;
      editor.setContent(newContent || '');
      currentContentRef.current = newContent;
      setTimeout(() => {
        contentChangingRef.current = false;
      }, 100);
    }
  }, [activeTab, privacyContent, termsContent, editorInitialized]);

  // Handle content changes
  const handleEditorChange = (content) => {
    if (contentChangingRef.current) return;
    
    if (activeTab === 'privacy') {
      setPrivacyContent(content);
    } else {
      setTermsContent(content);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Get the latest content from editor before saving
      let contentToSave = '';
      if (editorInstanceRef.current) {
        contentToSave = editorInstanceRef.current.getContent();
        handleEditorChange(contentToSave);
      } else {
        contentToSave = getCurrentContent();
      }

      // Validate content
      if (!contentToSave || contentToSave.trim() === '' || contentToSave === '<p></p>') {
        alert('Please add some content before saving.');
        return;
      }

      if (activeTab === 'privacy') {
        // Save Privacy Policy
        const endpoint = '/api/admin/privacy-policy/manage';
        const payload = {
          detail: contentToSave,
        };

        if (privacyId) {
          payload.id = privacyId;
        }

        const response = await makeAPICall(endpoint, 'POST', payload);
        
        if (response.status) {
          if (!privacyId && response.data && response.data.id) {
            setPrivacyId(response.data.id);
          }
          alert('Privacy Policy saved successfully!');
        } else {
          throw new Error(response.message || 'Failed to save privacy policy');
        }
      } else {
        // Save Terms & Conditions
        const endpoint = '/api/admin/terms-conditions/manage';
        const payload = {
          detail: contentToSave,
        };

        if (termsId) {
          payload.id = termsId;
        }

        const response = await makeAPICall(endpoint, 'POST', payload);
        
        if (response.status) {
          if (!termsId && response.data && response.data.id) {
            setTermsId(response.data.id);
          }
          alert('Terms & Conditions saved successfully!');
        } else {
          throw new Error(response.message || 'Failed to save terms & conditions');
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`Error saving content: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrentContent = () => {
    return activeTab === 'privacy' ? privacyContent : termsContent;
  };

  const handleTabSwitch = (tab) => {
    // Save current content before switching
    if (editorInstanceRef.current) {
      const content = editorInstanceRef.current.getContent();
      handleEditorChange(content);
    }
    setActiveTab(tab);
  };

  const getWordCount = (content) => {
    if (!content) return 0;
    return content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
  };

  const hasApiKey = () => {
    const apiKey = getApiKey();
    return apiKey && apiKey !== 'no-api-key';
  };

  const loadTemplate = (type) => {
    let template = '';
    if (type === 'privacy') {
      template = `<h2>Privacy Policy</h2>
<p><strong>Effective Date:</strong> ${new Date().toLocaleDateString()}</p>
<h3>Information We Collect</h3>
<p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
<h3>How We Use Your Information</h3>
<p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
<h3>Information Sharing</h3>
<p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
<h3>Contact Us</h3>
<p>If you have any questions about this Privacy Policy, please contact us at [your-email@example.com].</p>`;
      
      contentChangingRef.current = true;
      setPrivacyContent(template);
      setActiveTab('privacy');
      
      setTimeout(() => {
        if (editorInstanceRef.current) {
          editorInstanceRef.current.setContent(template);
        }
        contentChangingRef.current = false;
      }, 200);
    } else {
      template = `<h2>Terms of Service</h2>
<p><strong>Effective Date:</strong> ${new Date().toLocaleDateString()}</p>
<h3>Acceptance of Terms</h3>
<p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p>
<h3>Use License</h3>
<p>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.</p>
<h3>Disclaimer</h3>
<p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied.</p>
<h3>Contact Information</h3>
<p>Questions about the Terms of Service should be sent to us at [your-email@example.com].</p>`;
      
      contentChangingRef.current = true;
      setTermsContent(template);
      setActiveTab('terms');
      
      setTimeout(() => {
        if (editorInstanceRef.current) {
          editorInstanceRef.current.setContent(template);
        }
        contentChangingRef.current = false;
      }, 200);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading existing content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 bg-white min-h-screen">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Privacy Policy & Terms of Service Editor
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Create and edit your privacy policy and terms of service documents
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 sm:mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => handleTabSwitch('privacy')}
          className={`flex-1 py-2 px-2 sm:px-4 rounded-md font-medium transition-colors text-sm sm:text-base ${
            activeTab === 'privacy'
              ? 'bg-blue-100 text-blue-600 shadow-sm border border-blue-200'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Privacy Policy {privacyId && <span className="text-xs">(ID: {privacyId})</span>}
        </button>
        <button
          onClick={() => handleTabSwitch('terms')}
          className={`flex-1 py-2 px-2 sm:px-4 rounded-md font-medium transition-colors text-sm sm:text-base ${
            activeTab === 'terms'
              ? 'bg-blue-100 text-blue-600 shadow-sm border border-blue-200'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Terms of Service {termsId && <span className="text-xs">(ID: {termsId})</span>}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm sm:text-base"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={loadExistingContent}
            disabled={isLoading}
            className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Reload Content'}
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Content'}
        </button>
      </div>

      {/* Editor or Preview */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {isPreview ? (
          <div className="p-3 sm:p-6 bg-white min-h-[400px] sm:min-h-[500px]">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
              {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h2>
            <div 
              className="prose max-w-none text-gray-700 leading-relaxed text-sm sm:text-base"
              dangerouslySetInnerHTML={{ 
                __html: getCurrentContent() || '<p class="text-gray-500 italic">No content yet. Switch to edit mode to start writing.</p>' 
              }}
            />
          </div>
        ) : (
          <div className="relative">
            {!isTinyMCELoaded && (
              <div className="flex items-center justify-center h-[400px] sm:h-[500px] bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm sm:text-base">Loading TinyMCE Editor...</p>
                </div>
              </div>
            )}
            <textarea
              id="tinymce-editor"
              key={`editor-${activeTab}`}
              defaultValue={getCurrentContent()}
              className={`w-full min-h-[400px] sm:min-h-[500px] p-4 ${!isTinyMCELoaded ? 'hidden' : ''}`}
              placeholder="Start writing your content here..."
            />
          </div>
        )}
      </div>

      {/* Content Stats */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-500 gap-2 sm:gap-0">
        <div>
          Current: <span className="font-medium">{activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</span>
          {activeTab === 'privacy' && privacyId && <span className="ml-2">(ID: {privacyId})</span>}
          {activeTab === 'terms' && termsId && <span className="ml-2">(ID: {termsId})</span>}
        </div>
        <div>
          Word count: <span className="font-medium">{getWordCount(getCurrentContent())}</span>
        </div>
      </div>

      {/* API Key Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-3 sm:p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              API Configuration
            </h3>
            <div className="mt-2 text-xs sm:text-sm text-blue-700">
              <p>API URL: <code className="bg-blue-100 px-1 rounded">{API_URL}</code></p>
              <p className="mt-1">
                TinyMCE: {hasApiKey() ? '✅ Configured' : '⚠️ Using default (get free key at tiny.cloud)'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Templates */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">Privacy Policy Template</h3>
          <button
            onClick={() => loadTemplate('privacy')}
            className="text-xs sm:text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            Load Template
          </button>
        </div>
        
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">Terms of Service Template</h3>
          <button
            onClick={() => loadTemplate('terms')}
            className="text-xs sm:text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
          >
            Load Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyTermsEditor;