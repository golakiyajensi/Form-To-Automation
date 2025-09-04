import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { ArrowLeft, Send, Upload, CheckCircle } from 'lucide-react';

const FormViewer = ({ formId, onNavigate }) => {
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/forms/${formId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setForm(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch form');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleFileChange = (fieldId, file) => {
    setFiles(prev => ({
      ...prev,
      [fieldId]: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('submitted_by', 'Anonymous User');

      // Add text responses
      Object.entries(responses).forEach(([fieldId, value]) => {
        formData.append(fieldId, value);
      });

      // Add file uploads
      Object.entries(files).forEach(([fieldId, file]) => {
        if (file) {
          formData.append(fieldId, file);
        }
      });

      const response = await fetch(`http://localhost:5000/api/forms/${formId}/submit`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setResponses({});
        setFiles({});
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field) => {
    const fieldId = field.id;
    const value = responses[fieldId] || '';

    switch (field.field_type) {
      case 'text':
        return (
          <Input
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(fieldId, e.target.value)}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(fieldId, e.target.value)}
            required={field.required}
            rows={4}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(fieldId, e.target.value)}
            required={field.required}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(fieldId, e.target.value)}
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(fieldId, e.target.value)}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${fieldId}-${index}`}
                  name={`field-${fieldId}`}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(fieldId, e.target.value)}
                  required={field.required}
                />
                <Label htmlFor={`${fieldId}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${fieldId}-${index}`}
                  value={option}
                  checked={value.includes?.(option) || false}
                  onChange={(e) => {
                    const currentValues = value ? value.split(',') : [];
                    if (e.target.checked) {
                      handleInputChange(fieldId, [...currentValues, option].join(','));
                    } else {
                      handleInputChange(fieldId, currentValues.filter(v => v !== option).join(','));
                    }
                  }}
                />
                <Label htmlFor={`${fieldId}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <input
              type="file"
              onChange={(e) => handleFileChange(fieldId, e.target.files[0])}
              required={field.required}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {files[fieldId] && (
              <p className="text-sm text-gray-600">
                Selected: {files[fieldId].name}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">Thank you for your response.</p>
            <div className="space-x-4">
              <Button onClick={() => window.location.reload()}>
                Submit Another Response
              </Button>
              <Button variant="outline" onClick={() => onNavigate('dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertDescription>Form not found or you don't have permission to view it.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submit Form</h1>
          <p className="text-gray-600">Fill out the form below</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{form.title}</CardTitle>
          {form.description && (
            <CardDescription className="text-base">{form.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields?.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderField(field)}
              </div>
            ))}

            <div className="pt-4">
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Submit Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormViewer;

