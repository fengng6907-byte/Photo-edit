"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  User, Bell, Shield, CreditCard, Palette, Globe, Moon, Save,
  Trash2, LogOut, AlertTriangle
} from "lucide-react";

const SETTING_SECTIONS = [
  { id: "profile", label: "Profile", icon: <User size={15} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
  { id: "appearance", label: "Appearance", icon: <Palette size={15} /> },
  { id: "privacy", label: "Privacy & Security", icon: <Shield size={15} /> },
  { id: "billing", label: "Billing", icon: <CreditCard size={15} /> },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  return (
    <div className="flex h-screen bg-[#0a0828] overflow-hidden">
      <div className="hidden lg:flex flex-col">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>
          <div className="flex gap-6">
            {/* Sidebar nav */}
            <aside className="w-52 shrink-0 hidden sm:block">
              <nav className="space-y-1">
                {SETTING_SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all",
                      activeSection === s.id
                        ? "bg-brand-500/20 text-brand-300 border border-brand-500/20"
                        : "text-white/50 hover:text-white hover:bg-white/8"
                    )}
                  >
                    {s.icon}
                    {s.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {activeSection === "profile" && (
                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                        U
                      </div>
                      <div>
                        <Button variant="secondary" size="sm">Change Avatar</Button>
                        <p className="text-xs text-white/30 mt-1">JPG, PNG up to 2MB</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Input label="Full Name" placeholder="Your full name" defaultValue="" />
                      <Input label="Email" type="email" placeholder="you@example.com" defaultValue="" disabled hint="Contact support to change your email" />
                      <Textarea label="Bio" placeholder="Tell us about yourself..." rows={3} />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={handleSave} loading={saving} icon={<Save size={14} />}>Save Changes</Button>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Password</h2>
                    <div className="space-y-4">
                      <Input label="Current Password" type="password" placeholder="••••••••" />
                      <Input label="New Password" type="password" placeholder="••••••••" />
                      <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={handleSave} loading={saving} variant="secondary">Update Password</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "notifications" && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { label: "AI job completed", desc: "Get notified when your AI processing is done", enabled: true },
                      { label: "New filter releases", desc: "Be the first to know about new filters", enabled: true },
                      { label: "Usage alerts", desc: "Get alerts when you're near your credit limit", enabled: true },
                      { label: "Marketing emails", desc: "Promotions, tips, and product updates", enabled: false },
                      { label: "Weekly digest", desc: "Summary of your activity and stats", enabled: false },
                    ].map((n) => (
                      <div key={n.label} className="flex items-start justify-between py-3 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-sm text-white">{n.label}</p>
                          <p className="text-xs text-white/40">{n.desc}</p>
                        </div>
                        <div className={cn(
                          "w-10 h-5 rounded-full relative cursor-pointer transition-colors mt-0.5 shrink-0",
                          n.enabled ? "bg-brand-500" : "bg-white/15"
                        )}>
                          <div className={cn(
                            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                            n.enabled ? "left-5" : "left-0.5"
                          )} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "appearance" && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Appearance</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-white/70 mb-2">Theme</p>
                      <div className="grid grid-cols-3 gap-3">
                        {["Dark", "Light", "System"].map((theme) => (
                          <button
                            key={theme}
                            className={cn(
                              "flex items-center justify-center gap-2 p-3 rounded-xl border text-sm transition-all",
                              theme === "Dark"
                                ? "border-brand-500 bg-brand-500/15 text-brand-300"
                                : "border-white/10 text-white/50 hover:border-white/25"
                            )}
                          >
                            <Moon size={14} />
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-white/70 mb-2">Language</p>
                      <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500/50">
                        <option value="en">English (US)</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                        <option value="ko">한국어</option>
                        <option value="zh">中文</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "privacy" && (
                <div className="space-y-4">
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Privacy & Security</h2>
                    <div className="space-y-3">
                      {[
                        { label: "Two-Factor Authentication", value: "Disabled", action: "Enable" },
                        { label: "Active Sessions", value: "1 session", action: "Manage" },
                        { label: "Connected Accounts", value: "Google", action: "Manage" },
                        { label: "API Keys", value: "0 keys", action: "Create" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                          <div>
                            <p className="text-sm text-white">{item.label}</p>
                            <p className="text-xs text-white/40">{item.value}</p>
                          </div>
                          <Button variant="ghost" size="xs">{item.action}</Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6 border border-red-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={18} className="text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-red-400 mb-1">Danger Zone</h3>
                        <p className="text-xs text-white/40 mb-4">These actions are permanent and cannot be undone.</p>
                        <div className="flex gap-3">
                          <Button variant="danger" size="sm" icon={<LogOut size={13} />}>Sign Out All Devices</Button>
                          <Button variant="danger" size="sm" icon={<Trash2 size={13} />}>Delete Account</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "billing" && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-1">Billing & Subscription</h2>
                  <p className="text-sm text-white/40 mb-6">Manage your subscription and payment methods.</p>
                  <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">Free Plan</p>
                        <p className="text-xs text-white/40">10 credits/month</p>
                      </div>
                      <Badge variant="purple">Active</Badge>
                    </div>
                  </div>
                  <a href="/billing">
                    <Button icon={<CreditCard size={14} />}>Upgrade Plan</Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
