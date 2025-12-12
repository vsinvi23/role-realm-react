import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Globe,
  Shield,
  Bell,
  Mail,
  Palette,
  Database,
  Key,
  Upload,
  Save,
  RefreshCw,
  Server,
  Clock,
  Languages,
  FileText,
  Lock,
  Users,
  Zap,
  HardDrive,
  Link,
  AlertTriangle,
} from 'lucide-react';

// General Settings State
interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  supportEmail: string;
  timezone: string;
  dateFormat: string;
  language: string;
  maintenanceMode: boolean;
}

// Security Settings State
interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSpecial: boolean;
  passwordExpiryDays: number;
  ipWhitelistEnabled: boolean;
  ipWhitelist: string;
}

// Email Settings State
interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpEncryption: string;
  fromName: string;
  fromEmail: string;
  emailVerificationRequired: boolean;
}

// Notification Settings State
interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  contentApprovalNotify: boolean;
  userRegistrationNotify: boolean;
  systemAlertsNotify: boolean;
  weeklyDigest: boolean;
  realTimeUpdates: boolean;
}

// Content Settings State
interface ContentSettings {
  defaultContentStatus: string;
  autoSaveInterval: number;
  maxFileUploadSize: number;
  allowedFileTypes: string;
  enableVersioning: boolean;
  maxVersionsToKeep: number;
  enableComments: boolean;
  moderateComments: boolean;
  enableRatings: boolean;
}

// Integration Settings State
interface IntegrationSettings {
  googleAnalyticsId: string;
  googleTagManagerId: string;
  facebookPixelId: string;
  slackWebhookUrl: string;
  discordWebhookUrl: string;
  apiRateLimit: number;
  enablePublicApi: boolean;
}

export default function SettingsPage() {
  // General Settings
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'GeekGully',
    siteDescription: 'A comprehensive learning management platform',
    siteUrl: 'https://geekgully.com',
    adminEmail: 'admin@geekgully.com',
    supportEmail: 'support@geekgully.com',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    language: 'en',
    maintenanceMode: false,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecial: true,
    passwordExpiryDays: 90,
    ipWhitelistEnabled: false,
    ipWhitelist: '',
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    fromName: 'GeekGully',
    fromEmail: 'noreply@geekgully.com',
    emailVerificationRequired: true,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    contentApprovalNotify: true,
    userRegistrationNotify: true,
    systemAlertsNotify: true,
    weeklyDigest: false,
    realTimeUpdates: true,
  });

  // Content Settings
  const [contentSettings, setContentSettings] = useState<ContentSettings>({
    defaultContentStatus: 'draft',
    autoSaveInterval: 30,
    maxFileUploadSize: 50,
    allowedFileTypes: 'jpg,jpeg,png,gif,pdf,doc,docx,mp4,mp3',
    enableVersioning: true,
    maxVersionsToKeep: 10,
    enableComments: true,
    moderateComments: true,
    enableRatings: true,
  });

  // Integration Settings
  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings>({
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: '',
    slackWebhookUrl: '',
    discordWebhookUrl: '',
    apiRateLimit: 1000,
    enablePublicApi: false,
  });

  const handleSaveSettings = (section: string) => {
    toast.success(`${section} settings saved successfully`);
  };

  const handleTestEmail = () => {
    toast.success('Test email sent successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">System Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure system-wide settings and preferences
            </p>
          </div>
          <Badge variant="outline" className="gap-1">
            <Server className="w-3 h-3" />
            System Admin Only
          </Badge>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-1">
            <TabsTrigger value="general" className="gap-1.5 text-xs py-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5 text-xs py-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-1.5 text-xs py-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5 text-xs py-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-1.5 text-xs py-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-1.5 text-xs py-2">
              <Link className="w-4 h-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Site Information
                </CardTitle>
                <CardDescription>
                  Basic site configuration and branding settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      value={generalSettings.siteUrl}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={generalSettings.adminEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, adminEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Regional Settings
                </CardTitle>
                <CardDescription>
                  Configure timezone, date format, and language preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={generalSettings.timezone}
                      onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50">
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                        <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={generalSettings.dateFormat}
                      onValueChange={(value) => setGeneralSettings({ ...generalSettings, dateFormat: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50">
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Default Language</Label>
                    <Select
                      value={generalSettings.language}
                      onValueChange={(value) => setGeneralSettings({ ...generalSettings, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-warning/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-5 h-5" />
                  Maintenance Mode
                </CardTitle>
                <CardDescription>
                  Enable maintenance mode to temporarily disable public access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">
                      When enabled, only administrators can access the site
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, maintenanceMode: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => handleSaveSettings('General')}>
                <Save className="w-4 h-4 mr-2" />
                Save General Settings
              </Button>
            </div>
          </TabsContent>

          {/* Security Settings Tab */}
          <TabsContent value="security" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Authentication Settings
                </CardTitle>
                <CardDescription>
                  Configure login and session security options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all admin users
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Password Policy
                </CardTitle>
                <CardDescription>
                  Set password strength requirements for all users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiryDays">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiryDays"
                      type="number"
                      value={securitySettings.passwordExpiryDays}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiryDays: parseInt(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">Set to 0 to disable expiry</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-sm">Require Uppercase Letters</p>
                    </div>
                    <Switch
                      checked={securitySettings.passwordRequireUppercase}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, passwordRequireUppercase: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-sm">Require Numbers</p>
                    </div>
                    <Switch
                      checked={securitySettings.passwordRequireNumbers}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, passwordRequireNumbers: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-sm">Require Special Characters</p>
                    </div>
                    <Switch
                      checked={securitySettings.passwordRequireSpecial}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, passwordRequireSpecial: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  IP Whitelist
                </CardTitle>
                <CardDescription>
                  Restrict admin access to specific IP addresses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Enable IP Whitelist</p>
                    <p className="text-sm text-muted-foreground">
                      Only allow admin access from whitelisted IPs
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.ipWhitelistEnabled}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, ipWhitelistEnabled: checked })}
                  />
                </div>
                {securitySettings.ipWhitelistEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="ipWhitelist">Whitelisted IP Addresses</Label>
                    <Textarea
                      id="ipWhitelist"
                      placeholder="Enter one IP address per line"
                      value={securitySettings.ipWhitelist}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })}
                      rows={4}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => handleSaveSettings('Security')}>
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </div>
          </TabsContent>

          {/* Email Settings Tab */}
          <TabsContent value="email" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  SMTP Configuration
                </CardTitle>
                <CardDescription>
                  Configure outgoing email server settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpEncryption">Encryption</Label>
                  <Select
                    value={emailSettings.smtpEncryption}
                    onValueChange={(value) => setEmailSettings({ ...emailSettings, smtpEncryption: value })}
                  >
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Identity
                </CardTitle>
                <CardDescription>
                  Configure sender information for outgoing emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromName">From Name</Label>
                    <Input
                      id="fromName"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Require Email Verification</p>
                    <p className="text-sm text-muted-foreground">
                      New users must verify their email before accessing the platform
                    </p>
                  </div>
                  <Switch
                    checked={emailSettings.emailVerificationRequired}
                    onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, emailVerificationRequired: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleTestEmail}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Send Test Email
              </Button>
              <Button onClick={() => handleSaveSettings('Email')}>
                <Save className="w-4 h-4 mr-2" />
                Save Email Settings
              </Button>
            </div>
          </TabsContent>

          {/* Notification Settings Tab */}
          <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Channels
                </CardTitle>
                <CardDescription>
                  Configure how notifications are delivered
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Send browser push notifications
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, pushNotifications: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Real-Time Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Show live updates without page refresh
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.realTimeUpdates}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, realTimeUpdates: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Notification Events
                </CardTitle>
                <CardDescription>
                  Choose which events trigger notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Content Approval Requests</p>
                    <p className="text-sm text-muted-foreground">
                      Notify when content is submitted for review
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.contentApprovalNotify}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, contentApprovalNotify: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">New User Registrations</p>
                    <p className="text-sm text-muted-foreground">
                      Notify admins when new users register
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.userRegistrationNotify}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, userRegistrationNotify: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">System Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Notify about system errors and warnings
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemAlertsNotify}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, systemAlertsNotify: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Weekly Digest</p>
                    <p className="text-sm text-muted-foreground">
                      Send weekly summary of platform activity
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyDigest}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, weeklyDigest: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => handleSaveSettings('Notification')}>
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </div>
          </TabsContent>

          {/* Content Settings Tab */}
          <TabsContent value="content" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Content Defaults
                </CardTitle>
                <CardDescription>
                  Configure default settings for new content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultContentStatus">Default Content Status</Label>
                    <Select
                      value={contentSettings.defaultContentStatus}
                      onValueChange={(value) => setContentSettings({ ...contentSettings, defaultContentStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50">
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="autoSaveInterval">Auto-Save Interval (seconds)</Label>
                    <Input
                      id="autoSaveInterval"
                      type="number"
                      value={contentSettings.autoSaveInterval}
                      onChange={(e) => setContentSettings({ ...contentSettings, autoSaveInterval: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  File Upload Settings
                </CardTitle>
                <CardDescription>
                  Configure file upload restrictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxFileUploadSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileUploadSize"
                      type="number"
                      value={contentSettings.maxFileUploadSize}
                      onChange={(e) => setContentSettings({ ...contentSettings, maxFileUploadSize: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                    <Input
                      id="allowedFileTypes"
                      value={contentSettings.allowedFileTypes}
                      onChange={(e) => setContentSettings({ ...contentSettings, allowedFileTypes: e.target.value })}
                      placeholder="jpg,png,pdf,doc"
                    />
                    <p className="text-xs text-muted-foreground">Comma-separated list of extensions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HardDrive className="w-5 h-5" />
                  Version Control
                </CardTitle>
                <CardDescription>
                  Configure content versioning settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Enable Version History</p>
                    <p className="text-sm text-muted-foreground">
                      Keep track of all content changes
                    </p>
                  </div>
                  <Switch
                    checked={contentSettings.enableVersioning}
                    onCheckedChange={(checked) => setContentSettings({ ...contentSettings, enableVersioning: checked })}
                  />
                </div>
                {contentSettings.enableVersioning && (
                  <div className="space-y-2">
                    <Label htmlFor="maxVersionsToKeep">Max Versions to Keep</Label>
                    <Input
                      id="maxVersionsToKeep"
                      type="number"
                      value={contentSettings.maxVersionsToKeep}
                      onChange={(e) => setContentSettings({ ...contentSettings, maxVersionsToKeep: parseInt(e.target.value) })}
                      className="w-full md:w-[200px]"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Engagement
                </CardTitle>
                <CardDescription>
                  Configure comments and ratings features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Enable Comments</p>
                    <p className="text-sm text-muted-foreground">
                      Allow users to comment on content
                    </p>
                  </div>
                  <Switch
                    checked={contentSettings.enableComments}
                    onCheckedChange={(checked) => setContentSettings({ ...contentSettings, enableComments: checked })}
                  />
                </div>
                {contentSettings.enableComments && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Moderate Comments</p>
                        <p className="text-sm text-muted-foreground">
                          Require approval before comments are visible
                        </p>
                      </div>
                      <Switch
                        checked={contentSettings.moderateComments}
                        onCheckedChange={(checked) => setContentSettings({ ...contentSettings, moderateComments: checked })}
                      />
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Enable Ratings</p>
                    <p className="text-sm text-muted-foreground">
                      Allow users to rate content
                    </p>
                  </div>
                  <Switch
                    checked={contentSettings.enableRatings}
                    onCheckedChange={(checked) => setContentSettings({ ...contentSettings, enableRatings: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => handleSaveSettings('Content')}>
                <Save className="w-4 h-4 mr-2" />
                Save Content Settings
              </Button>
            </div>
          </TabsContent>

          {/* Integrations Settings Tab */}
          <TabsContent value="integrations" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Analytics & Tracking
                </CardTitle>
                <CardDescription>
                  Configure third-party analytics integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                    <Input
                      id="googleAnalyticsId"
                      placeholder="G-XXXXXXXXXX"
                      value={integrationSettings.googleAnalyticsId}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, googleAnalyticsId: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
                    <Input
                      id="googleTagManagerId"
                      placeholder="GTM-XXXXXXX"
                      value={integrationSettings.googleTagManagerId}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, googleTagManagerId: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                  <Input
                    id="facebookPixelId"
                    placeholder="XXXXXXXXXXXXXXXX"
                    value={integrationSettings.facebookPixelId}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, facebookPixelId: e.target.value })}
                    className="w-full md:w-1/2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Webhook Integrations
                </CardTitle>
                <CardDescription>
                  Connect to external notification services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slackWebhookUrl">Slack Webhook URL</Label>
                  <Input
                    id="slackWebhookUrl"
                    placeholder="https://hooks.slack.com/services/..."
                    value={integrationSettings.slackWebhookUrl}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, slackWebhookUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discordWebhookUrl">Discord Webhook URL</Label>
                  <Input
                    id="discordWebhookUrl"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={integrationSettings.discordWebhookUrl}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, discordWebhookUrl: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  API Settings
                </CardTitle>
                <CardDescription>
                  Configure public API access and rate limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Enable Public API</p>
                    <p className="text-sm text-muted-foreground">
                      Allow external applications to access the API
                    </p>
                  </div>
                  <Switch
                    checked={integrationSettings.enablePublicApi}
                    onCheckedChange={(checked) => setIntegrationSettings({ ...integrationSettings, enablePublicApi: checked })}
                  />
                </div>
                {integrationSettings.enablePublicApi && (
                  <div className="space-y-2">
                    <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                    <Input
                      id="apiRateLimit"
                      type="number"
                      value={integrationSettings.apiRateLimit}
                      onChange={(e) => setIntegrationSettings({ ...integrationSettings, apiRateLimit: parseInt(e.target.value) })}
                      className="w-full md:w-[200px]"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => handleSaveSettings('Integration')}>
                <Save className="w-4 h-4 mr-2" />
                Save Integration Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}