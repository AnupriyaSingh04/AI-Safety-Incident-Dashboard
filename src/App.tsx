import React, { useState } from 'react';
import Navbar from './components/Navbar';
import IncidentCarousel from './components/IncidentCarousel';
import NewsletterBanner from './components/NewsletterBanner';
import NewsletterModal from './components/NewsletterModal';
import FilterControls from './components/FilterControls';
import IncidentList from './components/IncidentList';
import Modal from './components/Modal';
import NewIncidentForm from './components/NewIncidentForm';
import IncidentModal from './components/IncidentModal';
import { useIncidents } from './hooks/useIncidents';
import { Plus } from 'lucide-react';

function App() {
  const {
    incidents,
    severityFilter,
    sortOrder,
    selectedIncident,
    setSeverityFilter,
    setSortOrder,
    selectIncident,
    closeIncidentModal,
    addNewIncident,
    shareIncident,
    handleVote
  } = useIncidents();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

  const handleNewIncidentSubmit = (formData: Parameters<typeof addNewIncident>[0]) => {
    addNewIncident(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        incidents={incidents}
        onSelectIncident={selectIncident}
        onVote={handleVote}
      />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <IncidentCarousel 
              incidents={incidents} 
              onLearnMore={selectIncident} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Incident Reports</h2>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Report New Incident
                    </button>
                  </div>
                  
                  <FilterControls
                    severityFilter={severityFilter}
                    sortOrder={sortOrder}
                    onSeverityChange={setSeverityFilter}
                    onSortChange={setSortOrder}
                  />
                  
                  <IncidentList
                    incidents={incidents}
                    onShare={shareIncident}
                    onVote={handleVote}
                    onViewDetails={selectIncident}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <NewsletterBanner 
                  onSubscribe={() => setIsNewsletterModalOpen(true)} 
                />
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Incidents</h3>
                  <div className="space-y-4">
                    {incidents
                      .sort((a, b) => b.upvotes - a.upvotes)
                      .slice(0, 3)
                      .map(incident => (
                        <button
                          key={incident.id}
                          onClick={() => selectIncident(incident.id)}
                          className="block w-full text-left hover:bg-gray-50 p-3 rounded-lg transition-colors"
                        >
                          <h4 className="text-sm font-medium text-gray-900 mb-1">{incident.title}</h4>
                          <p className="text-xs text-gray-500 line-clamp-2">{incident.description}</p>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Report New Incident"
      >
        <NewIncidentForm
          onSubmit={handleNewIncidentSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={closeIncidentModal}
          onShare={() => shareIncident(selectedIncident.id)}
          onVote={(vote) => handleVote(selectedIncident.id, vote)}
        />
      )}

      <NewsletterModal
        isOpen={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
      />
    </div>
  );
}

export default App;