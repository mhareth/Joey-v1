import React, { useState, useMemo } from 'react';
import { Property, PropertyType, PriceAlert } from './types';
import { INITIAL_PROPERTIES, INITIAL_PRICE_ALERTS } from './data/mockProperties';
import { Navbar, NavTab } from './components/Navbar';
import { InteractiveMap } from './components/InteractiveMap';
import { PropertyCard } from './components/PropertyCard';
import { FilterToolbar } from './components/FilterToolbar';
import { VirtualTourModal } from './components/VirtualTourModal';
import { AgentChatModal } from './components/AgentChatModal';
import { RecommendationHub } from './components/RecommendationHub';
import { MarketInsightsHub } from './components/MarketInsightsHub';
import { MortgageHub } from './components/MortgageHub';
import { DocumentPrepModal } from './components/DocumentPrepModal';
import { SellHub } from './components/SellHub';
import { SavedPropertiesModal } from './components/SavedPropertiesModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import { PriceAlertsListModal } from './components/PriceAlertsListModal';
import { PriceDropToast } from './components/PriceDropToast';
import { 
  Sparkles, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  Calculator, 
  FileText,
  Eye,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('explore');
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(['prop-riyadh-hittin-palace']);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(INITIAL_PROPERTIES[0]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Modal States
  const [virtualTourProperty, setVirtualTourProperty] = useState<Property | null>(null);
  const [agentChatProperty, setAgentChatProperty] = useState<Property | null>(null);
  const [documentPrepProperty, setDocumentPrepProperty] = useState<Property | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);

  // Price Alert States
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    try {
      const stored = localStorage.getItem('joey_price_alerts');
      return stored ? JSON.parse(stored) : INITIAL_PRICE_ALERTS;
    } catch {
      return INITIAL_PRICE_ALERTS;
    }
  });
  const [isSetAlertModalOpen, setIsSetAlertModalOpen] = useState<boolean>(false);
  const [isAlertsListModalOpen, setIsAlertsListModalOpen] = useState<boolean>(false);
  const [selectedAlertProperty, setSelectedAlertProperty] = useState<Property | null>(null);
  const [activeToastAlert, setActiveToastAlert] = useState<PriceAlert | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('All Districts');
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(25000000);
  const [minBeds, setMinBeds] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');

  // Filter & Search Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Search query (title, address, district, zip, tags)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch = 
          p.title.toLowerCase().includes(q) ||
          (p.titleAr && p.titleAr.toLowerCase().includes(q)) ||
          p.address.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // District filter in Riyadh
      if (selectedCity !== 'All Districts' && !p.district.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false;
      }

      // Property type filter
      if (selectedType !== 'All Types') {
        if (selectedType === 'Palaces & Luxury Villas') {
          if (!p.propertyType.toLowerCase().includes('palace') && !p.propertyType.toLowerCase().includes('villa')) return false;
        } else if (selectedType === 'Penthouses & Apartments') {
          if (!p.propertyType.toLowerCase().includes('penthouse') && !p.propertyType.toLowerCase().includes('apartment')) return false;
        } else if (selectedType === 'Townhomes & Duplexes') {
          if (!p.propertyType.toLowerCase().includes('townhome') && !p.propertyType.toLowerCase().includes('duplex')) return false;
        } else if (p.propertyType !== selectedType) {
          return false;
        }
      }

      // Price filter
      if (p.price > maxPrice) return false;

      // Beds filter
      if (minBeds > 0 && p.beds < minBeds) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'sqft-desc') return b.sqm - a.sqm;
      // Default: AI Match score or featured
      return (b.aiMatchScore || 0) - (a.aiMatchScore || 0);
    });
  }, [properties, searchQuery, selectedCity, selectedType, maxPrice, minBeds, sortBy]);

  const handleOpenPropertyDetail = (prop: Property) => {
    setSelectedProperty(prop);
    setIsDetailModalOpen(true);
  };

  const handleToggleSave = (prop: Property) => {
    setSavedPropertyIds((prev) =>
      prev.includes(prop.id) ? prev.filter((id) => id !== prop.id) : [...prev, prop.id]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('All Districts');
    setSelectedType('All Types');
    setMinPrice(0);
    setMaxPrice(25000000);
    setMinBeds(0);
    setSortBy('featured');
  };

  const handleSaveAlert = (newAlert: PriceAlert) => {
    setPriceAlerts((prev) => {
      const updated = [newAlert, ...prev];
      try {
        localStorage.setItem('joey_price_alerts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleToggleAlertActive = (alertId: string) => {
    setPriceAlerts((prev) => {
      const updated = prev.map((a) => (a.id === alertId ? { ...a, active: !a.active } : a));
      try {
        localStorage.setItem('joey_price_alerts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteAlert = (alertId: string) => {
    setPriceAlerts((prev) => {
      const updated = prev.filter((a) => a.id !== alertId);
      try {
        localStorage.setItem('joey_price_alerts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleSimulatePriceDrop = (alertId: string) => {
    const targetAlert = priceAlerts.find((a) => a.id === alertId);
    if (!targetAlert) return;

    const propId = targetAlert.propertyId || properties[0].id;
    const prop = properties.find((p) => p.id === propId) || properties[0];

    const dropPercentage = targetAlert.targetDropPercent || 5;
    const oldPrice = prop.price;
    const newPrice = Math.round(oldPrice * (1 - dropPercentage / 100));
    const savings = oldPrice - newPrice;

    // 1. Update property price in catalog
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === prop.id) {
          return {
            ...p,
            price: newPrice,
            originalPrice: oldPrice,
            status: 'Price Drop' as const,
          };
        }
        return p;
      })
    );

    // 2. Mark alert as triggered
    const triggeredData = {
      oldPrice,
      newPrice,
      savingsSAR: savings,
      dropPercent: dropPercentage,
      date: 'Just now',
    };

    const updatedAlert: PriceAlert = {
      ...targetAlert,
      currentPrice: newPrice,
      isTriggered: true,
      triggeredDetails: triggeredData,
    };

    setPriceAlerts((prev) => {
      const updated = prev.map((a) => (a.id === alertId ? updatedAlert : a));
      try {
        localStorage.setItem('joey_price_alerts', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 3. Show floating toast notification!
    setActiveToastAlert(updatedAlert);
  };

  const handleAddProperty = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
    setSelectedProperty(newProp);
  };

  const savedPropertiesList = useMemo(() => {
    return properties.filter((p) => savedPropertyIds.includes(p.id));
  }, [properties, savedPropertyIds]);

  const triggeredAlertsCount = useMemo(() => {
    return priceAlerts.filter((a) => a.isTriggered).length;
  }, [priceAlerts]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col selection:bg-red-50 selection:text-[#C82021]">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedPropertyIds.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        priceAlertsCount={priceAlerts.length}
        triggeredAlertsCount={triggeredAlertsCount}
        onOpenPriceAlerts={() => setIsAlertsListModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Rendered Based on Active Tab */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: EXPLORE & MAP VIEW */}
        {activeTab === 'explore' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Filter and View Mode Switcher */}
            <FilterToolbar
              viewMode={viewMode}
              setViewMode={setViewMode}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minBeds={minBeds}
              setMinBeds={setMinBeds}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onResetFilters={handleResetFilters}
              onOpenSearchPriceAlert={() => {
                setSelectedAlertProperty(null);
                setIsSetAlertModalOpen(true);
              }}
              totalCount={filteredProperties.length}
            />

            {/* View Mode Layouts */}
            {viewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left 6 Columns: Interactive Map */}
                <div className="lg:col-span-6 lg:sticky lg:top-28">
                  <InteractiveMap
                    properties={filteredProperties}
                    selectedProperty={selectedProperty}
                    onSelectProperty={handleOpenPropertyDetail}
                    onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
                    onOpenAgentChat={(p) => setAgentChatProperty(p)}
                  />
                </div>

                {/* Right 6 Columns: Property Listings Grid */}
                <div className="lg:col-span-6 space-y-6">
                  {filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                      {filteredProperties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          isSaved={savedPropertyIds.includes(property.id)}
                          hasAlert={priceAlerts.some((a) => a.propertyId === property.id && a.active)}
                          onOpenPriceAlert={(p) => {
                            setSelectedAlertProperty(p);
                            setIsSetAlertModalOpen(true);
                          }}
                          onToggleSave={handleToggleSave}
                          onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
                          onOpenAgentChat={(p) => setAgentChatProperty(p)}
                          onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
                          onSelectProperty={handleOpenPropertyDetail}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-white border border-gray-200 rounded-2xl shadow-xs space-y-3">
                      <p className="text-sm text-gray-500">No properties match your current search filters.</p>
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white font-bold text-xs transition-colors shadow-2xs"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {viewMode === 'grid' && (
              <div>
                {filteredProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isSaved={savedPropertyIds.includes(property.id)}
                        hasAlert={priceAlerts.some((a) => a.propertyId === property.id && a.active)}
                        onOpenPriceAlert={(p) => {
                          setSelectedAlertProperty(p);
                          setIsSetAlertModalOpen(true);
                        }}
                        onToggleSave={handleToggleSave}
                        onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
                        onOpenAgentChat={(p) => setAgentChatProperty(p)}
                        onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
                        onSelectProperty={handleOpenPropertyDetail}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white border border-gray-200 rounded-2xl shadow-xs space-y-3">
                    <p className="text-sm text-gray-500">No properties match your current search filters.</p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white font-bold text-xs transition-colors shadow-2xs"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {viewMode === 'map' && (
              <div className="w-full">
                <InteractiveMap
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                  onSelectProperty={handleOpenPropertyDetail}
                  onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
                  onOpenAgentChat={(p) => setAgentChatProperty(p)}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI RECOMMENDATIONS & BUYER MATCHMAKER */}
        {activeTab === 'recommendations' && (
          <RecommendationHub
            properties={properties}
            onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
            onOpenAgentChat={(p) => setAgentChatProperty(p)}
            onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
            onOpenPriceAlert={(p) => {
              setSelectedAlertProperty(p);
              setIsSetAlertModalOpen(true);
            }}
            onApplyRecommendations={(ranked) => {
              setProperties(ranked);
              setActiveTab('explore');
            }}
          />
        )}

        {/* TAB 3: REAL-TIME MARKET INSIGHTS */}
        {activeTab === 'market' && (
          <MarketInsightsHub
            properties={properties}
            onSelectProperty={(p) => handleOpenPropertyDetail(p)}
          />
        )}

        {/* TAB 4: SELL WITH AI HUB */}
        {activeTab === 'sell' && (
          <SellHub
            onAddProperty={handleAddProperty}
            onViewExplore={() => setActiveTab('explore')}
          />
        )}

        {/* TAB 5: MORTGAGE RATES & FINANCING */}
        {activeTab === 'mortgage' && (
          <MortgageHub
            selectedProperty={selectedProperty}
            onSelectProperty={(p) => handleOpenPropertyDetail(p)}
          />
        )}
      </main>

      {/* Global Modals */}
      {/* Property Details Modal with Nearby Amenities (Schools, Hospitals, Parks) */}
      {isDetailModalOpen && selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          isSaved={savedPropertyIds.includes(selectedProperty.id)}
          hasAlert={priceAlerts.some((a) => a.propertyId === selectedProperty.id && a.active)}
          onClose={() => setIsDetailModalOpen(false)}
          onToggleSave={handleToggleSave}
          onOpenPriceAlert={(p) => {
            setSelectedAlertProperty(p);
            setIsSetAlertModalOpen(true);
          }}
          onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
          onOpenAgentChat={(p) => setAgentChatProperty(p)}
          onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
        />
      )}

      {virtualTourProperty && (
        <VirtualTourModal
          property={virtualTourProperty}
          onClose={() => setVirtualTourProperty(null)}
          onOpenAgentChat={(p) => setAgentChatProperty(p)}
          onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
        />
      )}

      {agentChatProperty && (
        <AgentChatModal
          property={agentChatProperty}
          onClose={() => setAgentChatProperty(null)}
          onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
        />
      )}

      {documentPrepProperty && (
        <DocumentPrepModal
          property={documentPrepProperty}
          onClose={() => setDocumentPrepProperty(null)}
        />
      )}

      {isSavedModalOpen && (
        <SavedPropertiesModal
          savedProperties={savedPropertiesList}
          onClose={() => setIsSavedModalOpen(false)}
          onRemoveSaved={handleToggleSave}
          onOpenVirtualTour={(p) => setVirtualTourProperty(p)}
          onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
          onSelectProperty={(p) => handleOpenPropertyDetail(p)}
        />
      )}

      {/* Set Price Alert Modal */}
      {isSetAlertModalOpen && (
        <PriceAlertModal
          property={selectedAlertProperty}
          searchCriteria={selectedAlertProperty ? null : {
            district: selectedCity,
            propertyType: selectedType,
            maxBudget: maxPrice,
          }}
          onClose={() => {
            setIsSetAlertModalOpen(false);
            setSelectedAlertProperty(null);
          }}
          onSaveAlert={handleSaveAlert}
        />
      )}

      {/* Saved Price Alerts List Modal */}
      {isAlertsListModalOpen && (
        <PriceAlertsListModal
          alerts={priceAlerts}
          properties={properties}
          onClose={() => setIsAlertsListModalOpen(false)}
          onToggleActive={handleToggleAlertActive}
          onDeleteAlert={handleDeleteAlert}
          onSimulatePriceDrop={handleSimulatePriceDrop}
          onSelectProperty={(p) => handleOpenPropertyDetail(p)}
          onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
          onOpenSetAlertModal={() => {
            setSelectedAlertProperty(null);
            setIsSetAlertModalOpen(true);
          }}
        />
      )}

      {/* Real-time Price Drop Toast Notification */}
      {activeToastAlert && (
        <PriceDropToast
          alert={activeToastAlert}
          property={properties.find((p) => p.id === activeToastAlert.propertyId)}
          onClose={() => setActiveToastAlert(null)}
          onViewProperty={(p) => handleOpenPropertyDetail(p)}
          onOpenDocumentPrep={(p) => setDocumentPrepProperty(p)}
        />
      )}

      {/* Redfin-style Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-gray-900 font-sans tracking-tight">Joey <span className="text-[#C82021]">Properties</span></span>
            <span className="text-gray-400">· Riyadh, Kingdom of Saudi Arabia</span>
          </div>
          <p className="text-gray-400 text-center sm:text-right text-[11px]">
            Licensed and verified in accordance with Real Estate General Authority (REGA) standards · All rights reserved © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
