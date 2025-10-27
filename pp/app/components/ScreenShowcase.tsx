import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Bell,
  Home,
  Calendar,
  Plus,
  Settings,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Shield,
} from "lucide-react";

export function ScreenShowcase() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-slate-900 mb-4">
            Beautifully designed, thoughtfully crafted
          </h2>
          <p className="text-slate-600 text-lg">
            Every screen is designed to help you get things done quickly and
            intuitively
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Home Dashboard Mockup */}
          <Card className="p-6 bg-gradient-to-br from-slate-50 to-white border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-slate-900">Home Dashboard</h3>
                <Bell className="w-5 h-5 text-slate-400" />
              </div>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700">
                        Your trip to Japan is in 3 months—check your passport
                        expiry
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button className="text-xs text-emerald-600 hover:text-emerald-700">
                          👍 More like this
                        </button>
                        <button className="text-xs text-slate-400 hover:text-slate-600">
                          👎 Less like this
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-sm text-slate-900">Dental checkup</p>
                        <p className="text-xs text-slate-500">
                          Tomorrow at 2:00 PM
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Health
                    </Badge>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      <div>
                        <p className="text-sm text-slate-900">
                          Car insurance renewal
                        </p>
                        <p className="text-xs text-slate-500">In 7 days</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Subscriptions
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4">
                <button className="p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <Home className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-blue-700">Home</p>
                </button>
                <button className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <Calendar className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-700">Health</p>
                </button>
                <button className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <Plus className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-700">Taxes</p>
                </button>
              </div>
            </div>
          </Card>

          {/* Add Task Mockup */}
          <Card className="p-6 bg-gradient-to-br from-slate-50 to-white border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-slate-900">Add New Task</h3>
                <button className="text-sm text-emerald-600">Save</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-600 mb-2 block">
                    Title
                  </label>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      placeholder="e.g., Renew passport"
                      className="w-full text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent"
                      value="Renew passport"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 mb-2 block">
                    Category
                  </label>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-sm text-slate-900">Travel</span>
                    <Badge className="bg-purple-100 text-purple-700 border-0">
                      Custom
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 mb-2 block">
                    Due Date
                  </label>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-900">
                      March 15, 2025
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 mb-2 block">
                    Attachments
                  </label>
                  <div className="bg-white p-4 rounded-xl border-2 border-dashed border-slate-200 text-center">
                    <Sparkles className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-600">
                      Tap to scan or attach document
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 mb-2 block">
                    Notes
                  </label>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <textarea
                      placeholder="Add any additional details..."
                      className="w-full text-sm text-slate-600 placeholder-slate-400 outline-none bg-transparent resize-none"
                      rows={3}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Settings Mockup */}
          <Card className="p-6 bg-gradient-to-br from-slate-50 to-white border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-slate-900">Settings</h3>
                <Settings className="w-5 h-5 text-slate-400" />
              </div>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-900">Calendar Sync</p>
                      <p className="text-xs text-slate-500">
                        Google Calendar connected
                      </p>
                    </div>
                    <div className="w-11 h-6 bg-emerald-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-900">
                        Assistant Suggestions
                      </p>
                      <p className="text-xs text-slate-500">
                        Smart reminders enabled
                      </p>
                    </div>
                    <div className="w-11 h-6 bg-emerald-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-900">Notifications</p>
                      <p className="text-xs text-slate-500">
                        Daily digest at 9:00 AM
                      </p>
                    </div>
                    <div className="w-11 h-6 bg-emerald-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-emerald-900">Data Privacy</p>
                      <p className="text-xs text-emerald-700">
                        All data stored locally on your device
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-sm text-slate-900 mb-3">
                  Manage Categories
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline" className="justify-center py-2">
                    🏠 Home
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    ❤️ Health
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    💼 Taxes
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    🔄 Subscriptions
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    ✈️ Travel
                  </Badge>
                  <Badge
                    variant="outline"
                    className="justify-center py-2 border-dashed"
                  >
                    + New
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Assistant Suggestions Mockup */}
          <Card className="p-6 bg-gradient-to-br from-slate-50 to-white border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-slate-900">Assistant Suggestions</h3>
                <Sparkles className="w-5 h-5 text-emerald-500" />
              </div>

              <div className="space-y-3">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 mb-1">
                        Time for your biannual dental checkup
                      </p>
                      <p className="text-xs text-slate-600 mb-3">
                        You last visited Dr. Smith 6 months ago
                      </p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-white rounded-lg text-xs text-emerald-600 border border-emerald-200 hover:bg-emerald-50">
                          Schedule Now
                        </button>
                        <button className="px-3 py-1.5 bg-white/50 rounded-lg text-xs text-slate-600 hover:bg-white">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 mb-1">
                        Car insurance renewal coming up
                      </p>
                      <p className="text-xs text-slate-600 mb-3">
                        Policy expires in 7 days. Consider comparing quotes.
                      </p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-white rounded-lg text-xs text-blue-600 border border-blue-200 hover:bg-blue-50">
                          View Policy
                        </button>
                        <button className="px-3 py-1.5 bg-white/50 rounded-lg text-xs text-slate-600 hover:bg-white">
                          Remind Later
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Home className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 mb-1">
                        HVAC filter replacement due
                      </p>
                      <p className="text-xs text-slate-600">
                        Last replaced 3 months ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-slate-500 text-center">
                  React with 👍 or 👎 to train your assistant
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
