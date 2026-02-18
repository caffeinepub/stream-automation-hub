import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Wallet, Plus, Trash2, Edit, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

type WalletConnection = {
  id: string;
  type: string;
  address: string;
  label: string;
};

type Donation = {
  id: string;
  amount: number;
  source: string;
  date: Date;
};

export default function DonationManager() {
  const [wallets, setWallets] = useState<WalletConnection[]>([
    { id: '1', type: 'PayPal', address: 'user@example.com', label: 'Primary PayPal' },
  ]);
  const [donations, setDonations] = useState<Donation[]>([
    { id: '1', amount: 50, source: 'PayPal', date: new Date(2026, 1, 10) },
    { id: '2', amount: 25, source: 'Crypto', date: new Date(2026, 1, 15) },
  ]);

  const [walletType, setWalletType] = useState('PayPal');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletLabel, setWalletLabel] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const addWallet = () => {
    if (!walletAddress.trim() || !walletLabel.trim()) return;

    const newWallet: WalletConnection = {
      id: Date.now().toString(),
      type: walletType,
      address: walletAddress,
      label: walletLabel,
    };

    setWallets([...wallets, newWallet]);
    setWalletAddress('');
    setWalletLabel('');
    setDialogOpen(false);
  };

  const removeWallet = (id: string) => {
    setWallets(wallets.filter((w) => w.id !== id));
  };

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-2xl">Total Donations Received</CardTitle>
            <CardDescription>Lifetime earnings from donations</CardDescription>
          </div>
          <DollarSign className="h-8 w-8 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">${totalDonations.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Tabs defaultValue="wallets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wallets" className="gap-2">
            <Wallet className="h-4 w-4" />
            Connected Wallets
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Donation History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment Wallets</CardTitle>
                  <CardDescription>Manage your connected payment methods</CardDescription>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Wallet
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Connect Payment Wallet</DialogTitle>
                      <DialogDescription>
                        Add a new payment method to receive donations
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="wallet-type">Wallet Type</Label>
                        <Select value={walletType} onValueChange={setWalletType}>
                          <SelectTrigger id="wallet-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PayPal">PayPal</SelectItem>
                            <SelectItem value="Venmo">Venmo</SelectItem>
                            <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                            <SelectItem value="Ethereum">Ethereum</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wallet-address">Wallet Address/Email</Label>
                        <Input
                          id="wallet-address"
                          placeholder="Enter wallet address or email"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wallet-label">Label</Label>
                        <Input
                          id="wallet-label"
                          placeholder="e.g., Primary PayPal"
                          value={walletLabel}
                          onChange={(e) => setWalletLabel(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addWallet} disabled={!walletAddress.trim() || !walletLabel.trim()}>
                        Add Wallet
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {wallets.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No wallets connected yet</p>
              ) : (
                <div className="space-y-3">
                  {wallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Wallet className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{wallet.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {wallet.type} • {wallet.address}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWallet(wallet.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>Track all donations you've received</CardDescription>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No donations yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>{donation.date.toLocaleDateString()}</TableCell>
                        <TableCell>{donation.source}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          ${donation.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
