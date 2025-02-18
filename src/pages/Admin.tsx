import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Shield, AlertTriangle, Settings, Users, MessageSquare } from 'lucide-react';
import type { Admin as AdminType } from '../types';
import { readJsonFile, writeJsonFile } from '../services/dataService';
import toast from 'react-hot-toast';

export function Admin() {
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [newAdmin, setNewAdmin] = useState('');
  const [messageTemplate, setMessageTemplate] = useState({
    text: '',
    imageUrl: ''
  });
  const [settings, setSettings] = useState({
    taskReward: 10,
    supportReward: 5
  });
  const [telegramApiKey, setTelegramApiKey] = useState('');

  useEffect(() => {
    const loadAdminData = async () => {
      const data = await readJsonFile<{
        admins: AdminType[];
        messageTemplate: { text: string; imageUrl: string };
        settings: { taskReward: number; supportReward: number };
        telegramApiKey: string;
      }>('admin.json');
      
      let initialAdmins = data?.admins || [];
      const johndoeAdmin = { username: '@johndoe' };

      if (!initialAdmins.some(admin => admin.username === johndoeAdmin.username)) {
        initialAdmins = [...initialAdmins, johndoeAdmin];
      }

      setAdmins(initialAdmins);
      setMessageTemplate(data?.messageTemplate || { text: '', imageUrl: '' });
      setSettings(data?.settings || { taskReward: 10, supportReward: 5 });
      setTelegramApiKey(data?.telegramApiKey || '');
    };
    loadAdminData();
  }, []);

  const handleAddAdmin = async () => {
    if (newAdmin) {
      const updatedAdmins = [...admins, { username: newAdmin }];
      const success = await writeJsonFile('admin.json', {
        admins: updatedAdmins,
        messageTemplate,
        settings,
        telegramApiKey
      });

      if (success) {
        setAdmins(updatedAdmins);
        setNewAdmin('');
      }
    }
  };

  const handleRemoveAdmin = async (username: string) => {
    const updatedAdmins = admins.filter(admin => admin.username !== username);
    const success = await writeJsonFile('admin.json', {
      admins: updatedAdmins,
      messageTemplate,
      settings,
      telegramApiKey
    });

    if (success) {
      setAdmins(updatedAdmins);
    }
  };

  const handleSaveTemplate = async () => {
    const success = await writeJsonFile('admin.json', {
      admins,
      messageTemplate,
      settings,
      telegramApiKey
    });

    if (success) {
      toast.success('Template saved successfully!');
    } else {
      toast.error('Failed to save template.');
    }
  };

  const handleSaveSettings = async () => {
    const success = await writeJsonFile('admin.json', {
      admins,
      messageTemplate,
      settings,
      telegramApiKey
    });

    if (success) {
      toast.success('Settings saved successfully!');
    } else {
      toast.error('Failed to save settings.');
    }
  };

  const handleSaveApiKey = async () => {
    const success = await writeJsonFile('admin.json', {
      admins,
      messageTemplate,
      settings,
      telegramApiKey
    });

    if (success) {
      toast.success('Telegram API Key saved successfully!');
    } else {
      toast.error('Failed to save Telegram API Key.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newAdmin}
                onChange={(e) => setNewAdmin(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Enter admin username"
              />
              <Button onClick={handleAddAdmin}>Add Admin</Button>
            </div>
            <div className="divide-y">
              {admins.map((admin) => (
                <div key={admin.username} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{admin.username}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600"
                    onClick={() => handleRemoveAdmin(admin.username)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Message Template
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message Text
              </label>
              <textarea
                value={messageTemplate.text}
                onChange={(e) => setMessageTemplate(prev => ({ ...prev, text: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={4}
              />
              <p className="mt-1 text-sm text-gray-500">
                Available variables: @kullanıcıadı, (Platform)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                value={messageTemplate.imageUrl}
                onChange={(e) => setMessageTemplate(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <Button onClick={handleSaveTemplate}>Save Template</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Task Reward (MemeX)
              </label>
              <input
                type="number"
                value={settings.taskReward}
                onChange={(e) => setSettings(prev => ({ ...prev, taskReward: Number(e.target.value) }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Support Reward (MemeX)
              </label>
              <input
                type="number"
                value={settings.supportReward}
                onChange={(e) => setSettings(prev => ({ ...prev, supportReward: Number(e.target.value) }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Telegram API Key
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                API Key
              </label>
              <input
                type="text"
                value={telegramApiKey}
                onChange={(e) => setTelegramApiKey(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <Button onClick={handleSaveApiKey}>Save API Key</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
