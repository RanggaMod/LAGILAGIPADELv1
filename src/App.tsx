import React, { useState } from 'react';
import { PadelProTournamentApp } from './components/PadelProTournamentApp';
import { Footer } from './components/Footer';
import { X } from 'lucide-react';

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F6FAF9] flex flex-col font-sans selection:bg-[#006A6A] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191C1C] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200 border border-[#D8DFDE]/20 max-w-md">
          <span className="flex-1">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#6F7978] hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Tournament & Referee Live Scoring Application */}
      <main className="flex-1">
        <PadelProTournamentApp />
      </main>

      {/* Official Platform Footer */}
      <Footer />
    </div>
  );
}
