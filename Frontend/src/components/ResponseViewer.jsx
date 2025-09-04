import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Label } from '@/components/ui/label.jsx';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  User, 
  FileText, 
  BarChart3,
  Table
} from 'lucide-react';

const ResponseViewer = ({ formId, onNavigate }) => {
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  useEffect(() => {
    fetchFormAndResponses();
  }, [formId]);

  const fetchFormAndResponses = async () => {
    try {
      // Fetch form details
      const formResponse = await fetch(`http://localhost:5000/api/forms/${formId}`, {
        credentials: 'include'
      });
      const formData = await formResponse.json();
      
      if (formData.success) {
        setForm(formData.data);
      }

      // Fetch responses
      const responsesResponse = await fetch(`http://localhost:5000/api/forms/${formId}/responses`, {
        credentials: 'include'
      });
      const responsesData = await responsesResponse.json();
      
      if (responsesData.success) {
        setResponses(responsesData.data);
      } else {
        setError(responsesData.message);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/forms/${formId}/responses/export`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        // Convert to CSV format
        const csvContent = [
          data.data.headers.join(','),
          ...data.data.rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.data.form_title}_responses.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to export data');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAnswerValue = (response, fieldId) => {
    const answer = response.answers.find(a => a.field_id === fieldId);
    if (!answer) return '-';
    
    if (answer.answer_file_path) {
      return `[FILE: ${answer.answer_file_path.split('/').pop()}]`;
    }
    
    return answer.answer_text || '-';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertDescription>Form not found or you don't have permission to view responses.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Form Responses</h1>
            <p className="text-gray-600 mt-1">{form.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <Table className="w-4 h-4 mr-1" />
            Table
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            <FileText className="w-4 h-4 mr-1" />
            Cards
          </Button>
          <Button onClick={exportData} disabled={responses.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Form Fields</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{form.fields?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Response</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {responses.length > 0 
                ? formatDate(responses[responses.length - 1].submitted_at)
                : 'No responses yet'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responses */}
      {responses.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
            <p className="text-gray-600 mb-6">Share your form to start collecting responses</p>
            <Button onClick={() => onNavigate('view', formId)}>
              View Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === 'table' ? (
            <Card>
              <CardHeader>
                <CardTitle>Response Data</CardTitle>
                <CardDescription>All form submissions in table format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Submitted By</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                        {form.fields?.map(field => (
                          <th key={field.id} className="border border-gray-300 px-4 py-2 text-left">
                            {field.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map(response => (
                        <tr key={response.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">{response.id}</td>
                          <td className="border border-gray-300 px-4 py-2">{response.submitted_by}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            {formatDate(response.submitted_at)}
                          </td>
                          {form.fields?.map(field => (
                            <td key={field.id} className="border border-gray-300 px-4 py-2">
                              {getAnswerValue(response, field.id)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {responses.map(response => (
                <Card key={response.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Response #{response.id}</CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-1">
                          <User className="w-3 h-3" />
                          <span>{response.submitted_by}</span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {formatDate(response.submitted_at)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {form.fields?.map(field => (
                        <div key={field.id}>
                          <Label className="text-sm font-medium text-gray-700">
                            {field.label}
                          </Label>
                          <p className="text-sm text-gray-900 mt-1">
                            {getAnswerValue(response, field.id)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResponseViewer;

