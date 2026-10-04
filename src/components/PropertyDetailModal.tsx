import React, { useState } from 'react';
import { Property } from '../types';
import { NearbyAmenitiesSection } from './NearbyAmenitiesSection';
import { 
  X, 
  Heart, 
  Bell, 
  Eye, 
  FileText, 
  MessageSquare, 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Share2
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property;
  isSaved: boolean;
  hasAlert?: boolean;
  onClose: () => void;
  onToggleSave: (property: Property) => void;
  onOpenPriceAlert: (property: Property) => void;
  onOpenVirtualTour: (property: Property) => void;
  onOpenAgentChat: (property: Property) => void;
  onOpenDocumentPrep: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isSaved,
  hasAlert,
  onClose,
  onToggleSave,
  onOpenPriceAlert,
  onOpenVirtualTour,
  onOpenAgentChat,
  onOpenDocumentPrep,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const isPriceDropped = Boolean(property.originalPrice && property.originalPrice > property.price);
  const priceDropAmount = isPriceDropped ? property.originalPrice! - property.price : 0;

  // Monthly estimate (15% down, 3.99% profit rate, 25 years)
  const loanSAR = property.price * 0.85;
  const monthlyRate = 0.0399 / 12;
  const n = 25 * 12;
  const estimatedMonthlyInstallment = Math.round(
    (loanSAR * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Sticky Header - Redfin Style */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-gray-900 font-mono-num">
                  SAR {property.price.toLocaleString()}
                </span>
                {isPriceDropped && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-700 text-white">
                    Price Drop
                  </span>
                )}
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800">
                  {property.propertyType}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {property.address}, {property.district}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPriceAlert(property)}
              className={`p-2 rounded-xl border transition-colors ${
                hasAlert
                  ? 'bg-[#C82021] text-white border-[#C82021]'
                  : 'bg-white border-gray-200 text-gray-700 hover:text-[#C82021]'
              }`}
              title="Set Price Alert"
            >
              <Bell className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleSave(property)}
              className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#C82021] transition-colors"
              title="Save Home"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#C82021] text-[#C82021]' : ''}`} />
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenDocumentPrep(property);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white text-xs font-bold transition-colors shadow-xs active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              Make Offer
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar bg-slate-50">
          
          {/* Photo Gallery Grid */}
          <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-xs space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-gray-100">
              <img
                src={property.images[selectedPhotoIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => onOpenVirtualTour(property)}
                className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-gray-900 text-xs font-bold shadow-md transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#C82021]" />
                Explore 3D Virtual Tour
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    selectedPhotoIndex === idx ? 'border-[#C82021] scale-102' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Key Facts & Overview Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-black text-gray-900 font-sans">
                  {property.title}
                </h2>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {property.address}, {property.district}, {property.city} {property.zip}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-900 font-mono-num">
                    SAR {property.price.toLocaleString()}
                  </span>
                  {isPriceDropped && (
                    <span className="text-xs text-gray-400 line-through font-mono-num">
                      SAR {property.originalPrice!.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 font-mono-num">
                  ~SAR {estimatedMonthlyInstallment.toLocaleString()}/mo · Est. Murabaha
                </span>
              </div>
            </div>

            {/* Specs row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-500 block">Bedrooms</span>
                <span className="text-base font-bold text-gray-900 font-mono-num">{property.beds} Beds</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-500 block">Bathrooms</span>
                <span className="text-base font-bold text-gray-900 font-mono-num">{property.baths} Baths</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-500 block">Built-up Area</span>
                <span className="text-base font-bold text-gray-900 font-mono-num">{property.sqm} m²</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-500 block">Price per m²</span>
                <span className="text-base font-bold text-[#C82021] font-mono-num">
                  SAR {property.pricePerSqm.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                Property Overview
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Key Features */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-2">
                Key Amenities & Structural Warranties
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {property.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NEARBY AMENITIES SECTION (Schools, Hospitals, Parks) */}
          <NearbyAmenitiesSection property={property} />

          {/* Agent & Showing Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={property.agent.avatar}
                alt={property.agent.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 shrink-0"
              />
              <div>
                <h4 className="text-sm font-bold text-gray-900">{property.agent.name}</h4>
                <p className="text-xs text-gray-500">
                  {property.agent.brokerage} • REGA Fal License: {property.agent.falLicense}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  ★ {property.agent.rating} ({property.agent.reviewsCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onOpenAgentChat(property);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Contact Agent
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenDocumentPrep(property);
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                Draft Purchase Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
