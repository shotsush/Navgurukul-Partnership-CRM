import React, { useState, useEffect } from 'react';
import { Users, Building2, Phone, Mail, Calendar, Clock, CheckCircle2, AlertCircle, Plus, Search, Bell, BarChart3, ArrowRight, MessageSquare, FileText, Send, X, ChevronDown, GripVertical, Sparkles, TrendingUp, Target, HeartHandshake, Edit2, Trash2, Filter, MoreVertical } from 'lucide-react';

// Sample data for demonstration
const initialPartners = [
  {
    id: 1,
    name: "TechCorp Foundation",
    contactPerson: "Priya Sharma",
    email: "priya@techcorp.org",
    phone: "+91 98765 43210",
    type: "Corporate",
    stage: "negotiation",
    value: "₹15,00,000",
    lastContact: "2024-02-12",
    nextFollowUp: "2024-02-16",
    notes: "Interested in sponsoring 50 students for web development bootcamp",
    activities: [
      { id: 1, type: "call", date: "2024-02-12", note: "Discussed partnership terms, they want CSR compliance docs" },
      { id: 2, type: "email", date: "2024-02-10", note: "Sent initial proposal with curriculum details" },
      { id: 3, type: "meeting", date: "2024-02-05", note: "Intro meeting with CSR head - very positive" }
    ]
  },
  {
    id: 2,
    name: "Global Education Trust",
    contactPerson: "Amit Kumar",
    email: "amit@globaledu.org",
    phone: "+91 87654 32109",
    type: "NGO",
    stage: "proposal",
    value: "₹8,00,000",
    lastContact: "2024-02-10",
    nextFollowUp: "2024-02-15",
    notes: "Want to collaborate on rural education initiative",
    activities: [
      { id: 1, type: "email", date: "2024-02-10", note: "Sent detailed proposal for rural centers" }
    ]
  },
  {
    id: 3,
    name: "StartupHub Accelerator",
    contactPerson: "Neha Gupta",
    email: "neha@startuphub.in",
    phone: "+91 76543 21098",
    type: "Accelerator",
    stage: "lead",
    value: "₹5,00,000",
    lastContact: "2024-02-08",
    nextFollowUp: "2024-02-14",
    notes: "Interested in hiring our graduates",
    activities: [
      { id: 1, type: "call", date: "2024-02-08", note: "Initial discovery call - interested in talent pipeline" }
    ]
  },
  {
    id: 4,
    name: "Ministry of Skill Development",
    contactPerson: "Dr. Rajesh Verma",
    email: "rajesh.verma@gov.in",
    phone: "+91 65432 10987",
    type: "Government",
    stage: "closed",
    value: "₹25,00,000",
    lastContact: "2024-02-01",
    nextFollowUp: null,
    notes: "3-year partnership for skill development program",
    activities: [
      { id: 1, type: "meeting", date: "2024-02-01", note: "MoU signed! Partnership officially begins" },
      { id: 2, type: "meeting", date: "2024-01-25", note: "Final review meeting with ministry officials" }
    ]
  },
  {
    id: 5,
    name: "CloudTech Solutions",
    contactPerson: "Vikram Singh",
    email: "vikram@cloudtech.io",
    phone: "+91 54321 09876",
    type: "Corporate",
    stage: "conversation",
    value: "₹12,00,000",
    lastContact: "2024-02-11",
    nextFollowUp: "2024-02-18",
    notes: "Exploring internship and placement partnership",
    activities: [
      { id: 1, type: "call", date: "2024-02-11", note: "Follow-up call, scheduling office visit" }
    ]
  }
];

const stages = [
  { id: 'lead', name: 'New Lead', color: 'from-slate-400 to-slate-500', icon: Target },
  { id: 'conversation', name: 'In Conversation', color: 'from-blue-400 to-blue-500', icon: MessageSquare },
  { id: 'proposal', name: 'Proposal Sent', color: 'from-amber-400 to-amber-500', icon: FileText },
  { id: 'negotiation', name: 'Negotiation', color: 'from-purple-400 to-purple-500', icon: HeartHandshake },
  { id: 'closed', name: 'Partnership Won', color: 'from-emerald-400 to-emerald-500', icon: CheckCircle2 }
];

const emailTemplates = [
  { id: 1, name: "Initial Outreach", subject: "Partnership Opportunity with NavGurukul", body: "Dear [Name],\n\nI hope this email finds you well..." },
  { id: 2, name: "Follow-up", subject: "Following up on our conversation", body: "Dear [Name],\n\nThank you for taking the time..." },
  { id: 3, name: "Proposal Cover", subject: "NavGurukul Partnership Proposal", body: "Dear [Name],\n\nPlease find attached our detailed partnership proposal..." }
];

export default function NavGurukulCRM() {
  const [partners, setPartners] = useState(initialPartners);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [activeView, setActiveView] = useState('pipeline');
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedPartner, setDraggedPartner] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Follow-up due: StartupHub Accelerator", type: "reminder", time: "Today" },
    { id: 2, message: "New activity logged for TechCorp Foundation", type: "activity", time: "2 hours ago" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newActivity, setNewActivity] = useState({ type: 'call', note: '' });

  const [newPartner, setNewPartner] = useState({
    name: '', contactPerson: '', email: '', phone: '', type: 'Corporate', value: '', notes: ''
  });

  const metrics = {
    totalPartners: partners.length,
    activeDeals: partners.filter(p => p.stage !== 'closed').length,
    closedDeals: partners.filter(p => p.stage === 'closed').length,
    totalValue: partners.reduce((sum, p) => sum + parseInt(p.value.replace(/[₹,]/g, '')) || 0, 0),
    pendingFollowUps: partners.filter(p => p.nextFollowUp && new Date(p.nextFollowUp) <= new Date()).length
  };

  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (partner) => {
    setDraggedPartner(partner);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (stageId) => {
    if (draggedPartner) {
      setPartners(partners.map(p => 
        p.id === draggedPartner.id ? { ...p, stage: stageId } : p
      ));
      setDraggedPartner(null);
    }
  };

  const addPartner = () => {
    const partner = {
      id: Date.now(),
      ...newPartner,
      stage: 'lead',
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      activities: []
    };
    setPartners([...partners, partner]);
    setNewPartner({ name: '', contactPerson: '', email: '', phone: '', type: 'Corporate', value: '', notes: '' });
    setShowAddPartner(false);
  };

  const addActivity = () => {
    if (selectedPartner && newActivity.note) {
      const activity = {
        id: Date.now(),
        type: newActivity.type,
        date: new Date().toISOString().split('T')[0],
        note: newActivity.note
      };
      setPartners(partners.map(p => 
        p.id === selectedPartner.id 
          ? { ...p, activities: [activity, ...p.activities], lastContact: activity.date }
          : p
      ));
      setSelectedPartner({
        ...selectedPartner,
        activities: [activity, ...selectedPartner.activities],
        lastContact: activity.date
      });
      setNewActivity({ type: 'call', note: '' });
    }
  };

  const deletePartner = (id) => {
    setPartners(partners.filter(p => p.id !== id));
    if (selectedPartner?.id === id) setSelectedPartner(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 font-sans">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <HeartHandshake className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">NavGurukul Partners</h1>
                <p className="text-xs text-slate-500">Partnership Management System</p>
              </div>
            </div>

            <div className="flex-1 max-w-sm mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search partners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white/80 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl bg-white border border-slate-200 hover:border-orange-300"
                >
                  <Bell className="w-4 h-4 text-slate-600" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                    <h3 className="font-semibold text-slate-800 mb-2 text-sm">Notifications</h3>
                    {notifications.map(n => (
                      <div key={n.id} className="flex items-start gap-2 p-2 hover:bg-slate-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${n.type === 'reminder' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        <div>
                          <p className="text-xs text-slate-700">{n.message}</p>
                          <p className="text-xs text-slate-400">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setShowAddPartner(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Partner
              </button>
            </div>
          </div>

          <nav className="flex gap-1 mt-3">
            {[
              { id: 'pipeline', label: 'Pipeline', icon: Target },
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'reminders', label: 'Follow-ups', icon: Clock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeView === tab.id 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-slate-600 hover:bg-white/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        
        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: 'Total Partners', value: metrics.totalPartners, icon: Users, color: 'from-blue-500 to-blue-600' },
                { label: 'Active Deals', value: metrics.activeDeals, icon: Target, color: 'from-amber-500 to-orange-500' },
                { label: 'Won', value: metrics.closedDeals, icon: CheckCircle2, color: 'from-emerald-500 to-green-500' },
                { label: 'Pipeline Value', value: `₹${(metrics.totalValue / 100000).toFixed(1)}L`, icon: TrendingUp, color: 'from-purple-500 to-violet-500' },
                { label: 'Pending', value: metrics.pendingFollowUps, icon: AlertCircle, color: 'from-red-500 to-rose-500' }
              ].map((metric, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-slate-500">{metric.label}</p>
                      <p className="text-2xl font-bold text-slate-800 mt-1">{metric.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                      <metric.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-3">
              {stages.map(stage => {
                const stagePartners = partners.filter(p => p.stage === stage.id);
                const stageValue = stagePartners.reduce((sum, p) => sum + parseInt(p.value.replace(/[₹,]/g, '')) || 0, 0);
                return (
                  <div key={stage.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stage.color} flex items-center justify-center`}>
                        <stage.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{stage.name}</p>
                        <p className="text-xs text-slate-500">{stagePartners.length} partners</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${stage.color} rounded-full`}
                        style={{ width: `${(stagePartners.length / partners.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-2">₹{(stageValue / 100000).toFixed(1)}L</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {partners.flatMap(p => p.activities.map(a => ({ ...a, partner: p.name }))).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activity.type === 'call' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'email' ? 'bg-amber-100 text-amber-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'call' ? <Phone className="w-4 h-4" /> :
                       activity.type === 'email' ? <Mail className="w-4 h-4" /> :
                       <Calendar className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">{activity.note}</p>
                      <p className="text-xs text-slate-400">{activity.partner} • {activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pipeline View */}
        {activeView === 'pipeline' && (
          <div className="flex gap-3 overflow-x-auto pb-4">
            {stages.map(stage => {
              const stagePartners = filteredPartners.filter(p => p.stage === stage.id);
              return (
                <div 
                  key={stage.id}
                  className="flex-1 min-w-[220px]"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(stage.id)}
                >
                  <div className={`bg-gradient-to-r ${stage.color} rounded-t-xl p-3`}>
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-1.5">
                        <stage.icon className="w-4 h-4" />
                        <span className="font-semibold text-sm">{stage.name}</span>
                      </div>
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                        {stagePartners.length}
                      </span>
                    </div>
                  </div>

                  <div className="min-h-[350px] bg-slate-100/50 rounded-b-xl p-2 space-y-2">
                    {stagePartners.map(partner => (
                      <div
                        key={partner.id}
                        draggable
                        onDragStart={() => handleDragStart(partner)}
                        onClick={() => setSelectedPartner(partner)}
                        className="bg-white rounded-lg p-3 cursor-pointer border border-slate-200/50 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800 text-xs">{partner.name}</h4>
                              <p className="text-xs text-slate-500">{partner.contactPerson}</p>
                            </div>
                          </div>
                          <GripVertical className="w-3 h-3 text-slate-300" />
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-emerald-600 font-semibold">{partner.value}</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                            partner.type === 'Corporate' ? 'bg-blue-100 text-blue-700' :
                            partner.type === 'NGO' ? 'bg-green-100 text-green-700' :
                            partner.type === 'Government' ? 'bg-purple-100 text-purple-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {partner.type}
                          </span>
                        </div>

                        {partner.nextFollowUp && new Date(partner.nextFollowUp) <= new Date() && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                            <AlertCircle className="w-3 h-3" />
                            Follow-up due!
                          </div>
                        )}
                      </div>
                    ))}

                    {stagePartners.length === 0 && (
                      <div className="text-center py-6 text-slate-400">
                        <Target className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        <p className="text-xs">Drop partners here</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Follow-ups View */}
        {activeView === 'reminders' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Upcoming Follow-ups</h2>
              <p className="text-sm text-slate-500">Stay on top of your partnership conversations</p>
            </div>
            <div className="divide-y divide-slate-100">
              {partners.filter(p => p.nextFollowUp).sort((a, b) => new Date(a.nextFollowUp) - new Date(b.nextFollowUp)).map(partner => {
                const isOverdue = new Date(partner.nextFollowUp) < new Date();
                const isToday = new Date(partner.nextFollowUp).toDateString() === new Date().toDateString();
                return (
                  <div 
                    key={partner.id}
                    onClick={() => setSelectedPartner(partner)}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isOverdue ? 'bg-red-100' : isToday ? 'bg-amber-100' : 'bg-slate-100'
                    }`}>
                      <Clock className={`w-5 h-5 ${
                        isOverdue ? 'text-red-600' : isToday ? 'text-amber-600' : 'text-slate-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 text-sm">{partner.name}</h4>
                      <p className="text-xs text-slate-500">{partner.contactPerson}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        isOverdue ? 'text-red-600' : isToday ? 'text-amber-600' : 'text-slate-600'
                      }`}>
                        {isOverdue ? 'Overdue' : isToday ? 'Today' : partner.nextFollowUp}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Partner Detail Sidebar */}
      {selectedPartner && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-slate-200 p-4 z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{selectedPartner.name}</h2>
                  <p className="text-sm text-slate-500">{selectedPartner.type}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPartner(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wide">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{selectedPartner.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{selectedPartner.email}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{selectedPartner.phone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-emerald-600 mb-1">Deal Value</p>
                <p className="text-xl font-bold text-emerald-700">{selectedPartner.value}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Stage</p>
                <p className="text-sm font-semibold text-blue-700 capitalize">{selectedPartner.stage}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wide">Notes</h3>
              <p className="text-sm text-slate-600 p-3 bg-slate-50 rounded-lg">{selectedPartner.notes}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setShowEmailComposer(true)}
                className="flex flex-col items-center gap-1 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">Email</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Call</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-purple-700 font-medium">Schedule</span>
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wide">Log Activity</h3>
              <div className="flex gap-1">
                {['call', 'email', 'meeting'].map(type => (
                  <button
                    key={type}
                    onClick={() => setNewActivity({ ...newActivity, type })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                      newActivity.type === type 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <textarea
                value={newActivity.note}
                onChange={(e) => setNewActivity({ ...newActivity, note: e.target.value })}
                placeholder="What happened?"
                className="w-full p-2 border border-slate-200 rounded-lg text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <button 
                onClick={addActivity}
                className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium text-sm"
              >
                Log Activity
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wide">Timeline</h3>
              <div className="space-y-2">
                {selectedPartner.activities.map(activity => (
                  <div key={activity.id} className="flex gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'call' ? 'bg-blue-100' :
                      activity.type === 'email' ? 'bg-amber-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'call' ? <Phone className="w-3 h-3 text-blue-600" /> :
                       activity.type === 'email' ? <Mail className="w-3 h-3 text-amber-600" /> :
                       <Calendar className="w-3 h-3 text-purple-600" />}
                    </div>
                    <div className="flex-1 p-2 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-700">{activity.note}</p>
                      <p className="text-xs text-slate-400 mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => deletePartner(selectedPartner.id)}
              className="w-full py-2 border border-red-200 text-red-600 rounded-lg font-medium text-sm hover:bg-red-50 flex items-center justify-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Remove Partner
            </button>
          </div>
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddPartner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddPartner(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Add New Partner</h2>
              <button onClick={() => setShowAddPartner(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name *</label>
                <input
                  type="text"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  placeholder="e.g., TechCorp Foundation"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    value={newPartner.contactPerson}
                    onChange={(e) => setNewPartner({ ...newPartner, contactPerson: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={newPartner.type}
                    onChange={(e) => setNewPartner({ ...newPartner, type: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option>Corporate</option>
                    <option>NGO</option>
                    <option>Government</option>
                    <option>Accelerator</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newPartner.email}
                    onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deal Value</label>
                <input
                  type="text"
                  value={newPartner.value}
                  onChange={(e) => setNewPartner({ ...newPartner, value: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  placeholder="₹10,00,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  value={newPartner.notes}
                  onChange={(e) => setNewPartner({ ...newPartner, notes: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none h-16"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => setShowAddPartner(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={addPartner}
                disabled={!newPartner.name || !newPartner.contactPerson}
                className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium disabled:opacity-50"
              >
                Add Partner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Composer Modal */}
      {showEmailComposer && selectedPartner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEmailComposer(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Compose Email</h2>
                  <p className="text-xs text-slate-500">to {selectedPartner.contactPerson}</p>
                </div>
              </div>
              <button onClick={() => setShowEmailComposer(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="mb-3">
              <p className="text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Quick Templates
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {emailTemplates.map(template => (
                  <button 
                    key={template.id}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs text-slate-600"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                <input
                  type="email"
                  value={selectedPartner.email}
                  readOnly
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Enter email subject..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea
                  placeholder="Write your message..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none h-32 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => setShowEmailComposer(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium text-sm"
              >
                Cancel
              </button>
              <button className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-1.5">
                <Send className="w-4 h-4" />
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
