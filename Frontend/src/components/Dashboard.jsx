import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  Plus, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  BarChart3, 
  Calendar,
  Users,
  ExternalLink
} from 'lucide-react';

const Dashboard = ({ currentUser, onNavigate }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/forms', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setForms(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch forms');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async (formId) => {
    if (!confirm('Are you sure you want to delete this form?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/forms/${formId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setForms(forms.filter(form => form.id !== formId));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete form');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
          <p className="text-gray-600 mt-1">Create and manage your forms</p>
        </div>
        <Button onClick={() => onNavigate('create')} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create New Form</span>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forms.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forms.filter(f => f.is_active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{currentUser?.role}</div>
          </CardContent>
        </Card>
      </div>

      {/* Forms Grid */}
      {forms.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first form</p>
            <Button onClick={() => onNavigate('create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{form.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-3">
                      {form.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <Badge variant={form.is_active ? 'default' : 'secondary'}>
                    {form.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created {formatDate(form.created_at)}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onNavigate('view', form.id)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onNavigate('edit', form.id)}
                      className="flex items-center space-x-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onNavigate('responses', form.id)}
                      className="flex items-center space-x-1"
                    >
                      <BarChart3 className="w-3 h-3" />
                      <span>Responses</span>
                    </Button>
                  </div>
                  
                  {(currentUser?.role === 'admin' || form.created_by === currentUser?.id) && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteForm(form.id)}
                      className="flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

