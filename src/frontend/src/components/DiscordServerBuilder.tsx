import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Hash, Users, Shield, Settings, Plus, Trash2 } from 'lucide-react';
import { SiDiscord } from 'react-icons/si';

type Channel = {
  id: string;
  name: string;
  type: 'text' | 'voice';
};

type Role = {
  id: string;
  name: string;
  color: string;
};

export default function DiscordServerBuilder() {
  const [serverName, setServerName] = useState('');
  const [channels, setChannels] = useState<Channel[]>([
    { id: '1', name: 'general', type: 'text' },
    { id: '2', name: 'announcements', type: 'text' },
  ]);
  const [roles, setRoles] = useState<Role[]>([
    { id: '1', name: 'Admin', color: '#e74c3c' },
    { id: '2', name: 'Moderator', color: '#3498db' },
    { id: '3', name: 'Member', color: '#95a5a6' },
  ]);
  const [newChannelName, setNewChannelName] = useState('');
  const [newRoleName, setNewRoleName] = useState('');

  const addChannel = () => {
    if (!newChannelName.trim()) return;
    setChannels([...channels, { id: Date.now().toString(), name: newChannelName, type: 'text' }]);
    setNewChannelName('');
  };

  const removeChannel = (id: string) => {
    setChannels(channels.filter((c) => c.id !== id));
  };

  const addRole = () => {
    if (!newRoleName.trim()) return;
    setRoles([...roles, { id: Date.now().toString(), name: newRoleName, color: '#95a5a6' }]);
    setNewRoleName('');
  };

  const removeRole = (id: string) => {
    setRoles(roles.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#5865F2]/20">
        <CardHeader className="bg-gradient-to-r from-[#5865F2]/10 to-[#5865F2]/5">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <SiDiscord className="h-6 w-6 text-[#5865F2]" />
            Discord Server Builder
          </CardTitle>
          <CardDescription>
            Plan and configure your Discord server structure
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="server-name">Server Name</Label>
              <Input
                id="server-name"
                placeholder="My Awesome Server"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="channels" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="channels" className="gap-2">
            <Hash className="h-4 w-4" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-2">
            <Settings className="h-4 w-4" />
            Setup Guide
          </TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Channel Structure</CardTitle>
              <CardDescription>Organize your server channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="New channel name"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addChannel()}
                />
                <Button onClick={addChannel} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChannel(channel.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Role Management</CardTitle>
              <CardDescription>Define roles and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="New role name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addRole()}
                />
                <Button onClick={addRole} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: role.color }}
                      />
                      <span className="font-medium">{role.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRole(role.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Server Setup Guide</CardTitle>
              <CardDescription>Best practices for your Discord server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Welcome Channel
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Create a welcoming first impression with rules, introductions, and server info.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Moderation Setup
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Configure AutoMod, set up mod roles, and create a mod-only channel for coordination.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary" />
                    Channel Organization
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Group related channels into categories. Use clear naming conventions and descriptions.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Server Settings
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Enable 2FA for moderators, set verification level, and configure server insights.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
