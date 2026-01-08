import React, { useState } from 'react';
import { Contact } from '../../types';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  safeWord: string;
  setSafeWord: (word: string) => void;
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  safeWord,
  setSafeWord,
  contacts,
  setContacts
}) => {
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'contacts'>('general');

  if (!isOpen) return null;

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      name: newContactName,
      phone: newContactPhone,
      role: contacts.length === 0 ? 'PRIMARY' : 'SECONDARY'
    };

    setContacts([...contacts, newContact]);
    setNewContactName('');
    setNewContactPhone('');
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={onClose}
      ></div>

      {/* Drawer Content */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-[85vh] sm:h-[600px] rounded-t-[32px] sm:rounded-[32px] shadow-2xl shadow-black overflow-hidden flex flex-col pointer-events-auto transform transition-transform animate-slide-up border border-slate-200 dark:border-slate-800">
        
        {/* Handle for dragging (visual cue) */}
        <div className="w-full flex justify-center pt-4 pb-2" onClick={onClose}>
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-800 transition-colors">
            <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-4 gap-2">
            <button 
                onClick={() => setActiveTab('general')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
                Voice Trigger
            </button>
            <button 
                onClick={() => setActiveTab('contacts')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'contacts' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
                Trusted Contacts
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-0">
            
            {activeTab === 'general' && (
                <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                        <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                            Safe Word
                        </label>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                            Saying this word aloud will immediately trigger an escalation.
                        </p>
                        <input 
                            type="text" 
                            value={safeWord}
                            onChange={(e) => setSafeWord(e.target.value)}
                            className="w-full text-2xl font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none placeholder-slate-400"
                            placeholder="e.g. Help"
                        />
                    </div>
                </div>
            )}

            {activeTab === 'contacts' && (
                <div className="space-y-6">
                     {/* Add Contact Form */}
                    <form onSubmit={handleAddContact} className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300">Add New Contact</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <input 
                                type="text" 
                                placeholder="Name (e.g. Mom)"
                                value={newContactName}
                                onChange={e => setNewContactName(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none text-sm text-slate-800 dark:text-white placeholder-slate-400"
                                required
                            />
                            <input 
                                type="tel" 
                                placeholder="Phone Number"
                                value={newContactPhone}
                                onChange={e => setNewContactPhone(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none text-sm text-slate-800 dark:text-white placeholder-slate-400"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
                            Add Contact
                        </button>
                    </form>

                    {/* Contact List */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Your Circle</h3>
                        {contacts.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                                No contacts added yet.
                            </div>
                        ) : (
                            contacts.map(contact => (
                                <div key={contact.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${contact.role === 'PRIMARY' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                                            {contact.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{contact.name}</div>
                                            <div className="text-xs text-slate-400 dark:text-slate-500">{contact.phone}</div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeContact(contact.id)}
                                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SettingsDrawer;