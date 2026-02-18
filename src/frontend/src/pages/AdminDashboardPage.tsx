import { useState } from 'react';
import { useIsUserOwner, useGetAllSubscriptionPlans, useCreateSubscriptionPlan, useUpdateSubscriptionPlan, useDeleteSubscriptionPlan, useToggleSubscriptionPlanStatus } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield, Plus, Edit, Trash2, Power, Loader2, DollarSign } from 'lucide-react';
import { SubscriptionTier } from '../backend';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const { data: isOwner, isLoading: ownerLoading } = useIsUserOwner();
  const { data: plans, isLoading: plansLoading } = useGetAllSubscriptionPlans();
  const createPlan = useCreateSubscriptionPlan();
  const updatePlan = useUpdateSubscriptionPlan();
  const deletePlan = useDeleteSubscriptionPlan();
  const toggleStatus = useToggleSubscriptionPlanStatus();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tier: 'monthly' as 'monthly' | 'annual',
    priceInCents: '',
    features: '',
  });

  if (ownerLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You do not have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Only the app owner can manage subscription plans and settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreatePlan = async () => {
    const features = formData.features.split('\n').filter(f => f.trim());
    await createPlan.mutateAsync({
      name: formData.name,
      description: formData.description,
      tier: formData.tier === 'monthly' ? SubscriptionTier.monthly : SubscriptionTier.annual,
      priceInCents: BigInt(formData.priceInCents),
      features,
    });
    setCreateDialogOpen(false);
    resetForm();
  };

  const handleUpdatePlan = async () => {
    if (!selectedPlan) return;
    const features = formData.features.split('\n').filter(f => f.trim());
    await updatePlan.mutateAsync({
      planId: selectedPlan.id,
      name: formData.name,
      description: formData.description,
      priceInCents: BigInt(formData.priceInCents),
      features,
      isActive: selectedPlan.isActive,
    });
    setEditDialogOpen(false);
    setSelectedPlan(null);
    resetForm();
  };

  const handleDeletePlan = async (planId: bigint) => {
    await deletePlan.mutateAsync(planId);
  };

  const handleToggleStatus = async (planId: bigint) => {
    await toggleStatus.mutateAsync(planId);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      tier: 'monthly',
      priceInCents: '',
      features: '',
    });
  };

  const openEditDialog = (plan: any) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      tier: plan.tier === 'monthly' ? 'monthly' : 'annual',
      priceInCents: plan.priceInCents.toString(),
      features: plan.features.join('\n'),
    });
    setEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage subscription plans and pricing
            </p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Subscription Plan</DialogTitle>
                <DialogDescription>
                  Add a new subscription plan with pricing and features
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Plan Name</Label>
                  <Input
                    id="create-name"
                    placeholder="e.g., Premium Monthly"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-description">Description</Label>
                  <Textarea
                    id="create-description"
                    placeholder="Brief description of the plan"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-tier">Billing Period</Label>
                    <Select value={formData.tier} onValueChange={(value: 'monthly' | 'annual') => setFormData({ ...formData, tier: value })}>
                      <SelectTrigger id="create-tier">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-price">Price (in cents)</Label>
                    <Input
                      id="create-price"
                      type="number"
                      placeholder="e.g., 10000 for $100"
                      value={formData.priceInCents}
                      onChange={(e) => setFormData({ ...formData, priceInCents: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-features">Features (one per line)</Label>
                  <Textarea
                    id="create-features"
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    rows={5}
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePlan} disabled={createPlan.isPending || !formData.name || !formData.priceInCents}>
                  {createPlan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Plan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {plansLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <Card key={plan.id.toString()} className={!plan.isActive ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {plan.name}
                        <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">{plan.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-3xl font-bold text-foreground">
                      ${(Number(plan.priceInCents) / 100).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">
                      / {plan.tier === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Features:</p>
                    <ul className="space-y-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                          <DollarSign className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => openEditDialog(plan)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleToggleStatus(plan.id)}
                      disabled={toggleStatus.isPending}
                    >
                      <Power className="h-4 w-4" />
                      {plan.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="gap-2">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Subscription Plan?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the "{plan.name}" plan. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePlan(plan.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No subscription plans yet. Create your first plan to get started.</p>
            </CardContent>
          </Card>
        )}

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Subscription Plan</DialogTitle>
              <DialogDescription>
                Update the plan details, pricing, and features
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Plan Name</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Premium Monthly"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Brief description of the plan"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (in cents)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  placeholder="e.g., 10000 for $100"
                  value={formData.priceInCents}
                  onChange={(e) => setFormData({ ...formData, priceInCents: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-features">Features (one per line)</Label>
                <Textarea
                  id="edit-features"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  rows={5}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePlan} disabled={updatePlan.isPending || !formData.name || !formData.priceInCents}>
                {updatePlan.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
