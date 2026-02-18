import { useState } from 'react';
import { useGetCallerUserProfile, useGetAllSubscriptionPlans, useCreateSubscriptionPlan, useUpdateSubscriptionPlan, useDeleteSubscriptionPlan, useToggleSubscriptionPlanStatus } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { SubscriptionTier, SubscriptionPlan } from '../backend';
import { Crown, Plus, Edit, Trash2, Power } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: plans = [], isLoading: plansLoading } = useGetAllSubscriptionPlans();
  const createPlan = useCreateSubscriptionPlan();
  const updatePlan = useUpdateSubscriptionPlan();
  const deletePlan = useDeleteSubscriptionPlan();
  const toggleStatus = useToggleSubscriptionPlanStatus();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tier: 'monthly' as 'monthly' | 'annual',
    priceInCents: '',
    features: '',
  });

  const isOwner = userProfile?.isOwner === true;

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to access the admin dashboard. Only the app owner (CelestiNix) can access this area.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      tier: 'monthly',
      priceInCents: '',
      features: '',
    });
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.description || !formData.priceInCents || !formData.features) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createPlan.mutateAsync({
        name: formData.name,
        description: formData.description,
        tier: formData.tier === 'monthly' ? SubscriptionTier.monthly : SubscriptionTier.annual,
        priceInCents: BigInt(formData.priceInCents),
        features: formData.features.split('\n').filter(f => f.trim()),
      });
      toast.success('Subscription plan created successfully');
      setShowCreateDialog(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create plan');
    }
  };

  const handleEdit = async () => {
    if (!selectedPlan || !formData.name || !formData.description || !formData.priceInCents || !formData.features) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await updatePlan.mutateAsync({
        planId: selectedPlan.id,
        name: formData.name,
        description: formData.description,
        priceInCents: BigInt(formData.priceInCents),
        features: formData.features.split('\n').filter(f => f.trim()),
        isActive: selectedPlan.isActive,
      });
      toast.success('Subscription plan updated successfully');
      setShowEditDialog(false);
      setSelectedPlan(null);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update plan');
    }
  };

  const handleDelete = async () => {
    if (!selectedPlan) return;

    try {
      await deletePlan.mutateAsync(selectedPlan.id);
      toast.success('Subscription plan deleted successfully');
      setShowDeleteDialog(false);
      setSelectedPlan(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete plan');
    }
  };

  const handleToggleStatus = async (planId: bigint) => {
    try {
      await toggleStatus.mutateAsync(planId);
      toast.success('Plan status updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle status');
    }
  };

  const openEditDialog = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    const tierValue = plan.tier === SubscriptionTier.monthly ? 'monthly' : 'annual';
    setFormData({
      name: plan.name,
      description: plan.description,
      tier: tierValue,
      priceInCents: plan.priceInCents.toString(),
      features: plan.features.join('\n'),
    });
    setShowEditDialog(true);
  };

  const getTierLabel = (tier: SubscriptionTier) => {
    return tier === SubscriptionTier.monthly ? 'Monthly' : 'Annual';
  };

  const getTierPeriod = (tier: SubscriptionTier) => {
    return tier === SubscriptionTier.monthly ? 'month' : 'year';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">Manage subscription plans and application settings</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Create and manage subscription tiers for your users</CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {plansLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No subscription plans yet.</p>
              <p className="text-sm mt-2">Create your first plan to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((plan) => (
                <Card key={plan.id.toString()}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                            {plan.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline">
                            {getTierLabel(plan.tier)}
                          </Badge>
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                        <p className="text-2xl font-bold mt-2">
                          ${(Number(plan.priceInCents) / 100).toFixed(2)}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{getTierPeriod(plan.tier)}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleToggleStatus(plan.id)}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(plan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedPlan(plan);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p className="text-sm font-medium mb-2">Features:</p>
                      {plan.features.map((feature, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="text-primary">✓</span>
                          {feature}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Subscription Plan</DialogTitle>
            <DialogDescription>Add a new subscription tier for your users</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Premium"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
              />
            </div>
            <div>
              <Label htmlFor="tier">Billing Period</Label>
              <Select value={formData.tier} onValueChange={(value: 'monthly' | 'annual') => setFormData({ ...formData, tier: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Price (in cents)</Label>
              <Input
                id="price"
                type="number"
                value={formData.priceInCents}
                onChange={(e) => setFormData({ ...formData, priceInCents: e.target.value })}
                placeholder="e.g., 999 for $9.99"
              />
            </div>
            <div>
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createPlan.isPending}>
              {createPlan.isPending ? 'Creating...' : 'Create Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription Plan</DialogTitle>
            <DialogDescription>Update the subscription plan details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Plan Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Price (in cents)</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.priceInCents}
                onChange={(e) => setFormData({ ...formData, priceInCents: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-features">Features (one per line)</Label>
              <Textarea
                id="edit-features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={updatePlan.isPending}>
              {updatePlan.isPending ? 'Updating...' : 'Update Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedPlan?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deletePlan.isPending}>
              {deletePlan.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
