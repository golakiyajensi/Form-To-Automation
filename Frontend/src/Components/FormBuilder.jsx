import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Type, 
  Mail, 
  Hash, 
  List, 
  CheckSquare, 
  Upload,
  Save,
  ArrowLeft
} from 'lucide-react';

const FIELD_TYPES = [
  { value: 'text', label: 'Short Text', icon: Type },
  { value: 'textarea', label: 'Long Text', icon: Type },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'select', label: 'Dropdown', icon: List },
  { value: 'radio', label: 'Multiple Choice', icon: CheckSquare },
  { value: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
  { value: 'file', label: 'File Upload', icon: Upload },
];

const FormBuilder = ({ onNavigate, formId = null }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    fields: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (formId) {
      fetchForm();
    }
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
    }
  };

  const handleFormChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addField = () => {
    const newField = {
      id: Date.now(),
      field_type: 'text',
      label: '',
      placeholder: '',
      required: false,
      options: [],
      order_index: form.fields.length
    };
    
    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId, updates) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const addOption = (fieldId) => {
    updateField(fieldId, {
      options: [...(form.fields.find(f => f.id === fieldId)?.options || []), '']
    });
  };

  const updateOption = (fieldId, optionIndex, value) => {
    const field = form.fields.find(f => f.id === fieldId);
    const newOptions = [...field.options];
    newOptions[optionIndex] = value;
    updateField(fieldId, { options: newOptions });
  };

  const removeOption = (fieldId, optionIndex) => {
    const field = form.fields.find(f => f.id === fieldId);
    const newOptions = field.options.filter((_, index) => index !== optionIndex);
    updateField(fieldId, { options: newOptions });
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('Form title is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = formId 
        ? `http://localhost:5000/api/forms/${formId}`
        : 'http://localhost:5000/api/forms';
      
      const method = formId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(formId ? 'Form updated successfully!' : 'Form created successfully!');
        if (!formId) {
          setTimeout(() => onNavigate('dashboard'), 2000);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save form');
    } finally {
      setLoading(false);
    }
  };

  const renderFieldEditor = (field) => {
    const FieldIcon = FIELD_TYPES.find(type => type.value === field.field_type)?.icon || Type;
    
    return (
      <Card key={field.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <FieldIcon className="w-4 h-4 text-blue-600" />
              <select
                value={field.field_type}
                onChange={(e) => updateField(field.id, { field_type: e.target.value })}
                className="text-sm border-none bg-transparent font-medium focus:outline-none"
              >
                {FIELD_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeField(field.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Field Label</Label>
            <Input
              placeholder="Enter field label"
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
            />
          </div>
          
          {!['select', 'radio', 'checkbox'].includes(field.field_type) && (
            <div>
              <Label>Placeholder</Label>
              <Input
                placeholder="Enter placeholder text"
                value={field.placeholder}
                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
              />
            </div>
          )}

          {['select', 'radio', 'checkbox'].includes(field.field_type) && (
            <div>
              <Label>Options</Label>
              <div className="space-y-2">
                {field.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(field.id, index, e.target.value)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeOption(field.id, index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addOption(field.id)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Option
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`required-${field.id}`}
              checked={field.required}
              onChange={(e) => updateField(field.id, { required: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor={`required-${field.id}`}>Required field</Label>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {formId ? 'Edit Form' : 'Create New Form'}
            </h1>
            <p className="text-gray-600 mt-1">
              {formId ? 'Update your form details and fields' : 'Build your form by adding fields'}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {formId ? 'Update Form' : 'Save Form'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Settings */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
              <CardDescription>Configure your form details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Form Title</Label>
                <Input
                  placeholder="Enter form title"
                  value={form.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Enter form description"
                  value={form.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              <Button onClick={addField} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Form Fields */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Form Fields</h2>
            {form.fields.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Type className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No fields yet</h3>
                  <p className="text-gray-600 mb-6">Add fields to start building your form</p>
                  <Button onClick={addField}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Field
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div>
                {form.fields.map(renderFieldEditor)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;

