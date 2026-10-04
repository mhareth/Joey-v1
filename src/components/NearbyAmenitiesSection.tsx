import React, { useState } from 'react';
import { Property, NearbyAmenity } from '../types';
import { getNearbyAmenitiesForProperty } from '../data/mockAmenities';
import { 
  GraduationCap, 
  Hospital, 
  Trees, 
  MapPin, 
  Clock, 
  Star, 
  Navigation,
  Compass,
  Building2,
  ExternalLink
} from 'lucide-react';

interface NearbyAmenitiesSectionProps {
  property: Property;
}

export const NearbyAmenitiesSection: React.FC<NearbyAmenitiesSectionProps> = ({
  property,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'school' | 'hospital' | 'park'>('all');
  const [activeAmenityId, setActiveAmenityId] = useState<string | null>(null);

  const amenities = getNearbyAmenitiesForProperty(property);

  const filteredAmenities = amenities.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.type === selectedCategory;
  });

  const activeAmenity = amenities.find((a) => a.id === activeAmenityId) || filteredAmenities[0];

  const getIconForType = (type: 'school' | 'hospital' | 'park') => {
    switch (type) {
      case 'school':
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case 'hospital':
        return <Hospital className="w-4 h-4 text-[#C82021]" />;
      case 'park':
        return <Trees className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getBadgeColor = (type: 'school' | 'hospital' | 'park') => {
    switch (type) {
      case 'school':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'hospital':
        return 'bg-red-50 text-[#C82021] border-red-200';
      case 'park':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getTypeLabel = (type: 'school' | 'hospital' | 'park') => {
    switch (type) {
      case 'school':
        return 'School / Academy';
      case 'hospital':
        return 'Hospital / Clinic';
      case 'park':
        return 'Park / Recreation';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900">
              Nearby Amenities & Services
            </h3>
            <span className="text-xs font-bold text-[#C82021] font-sans">
              Local Proximity
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Top-tier schools, specialized hospitals, and public parks surrounding this property in {property.district}
          </p>
        </div>

        {/* Category Filter Pills - Redfin Style */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-start sm:self-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-white text-gray-900 shadow-2xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({amenities.length})
          </button>
          <button
            onClick={() => setSelectedCategory('school')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === 'school'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Schools</span>
          </button>
          <button
            onClick={() => setSelectedCategory('hospital')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === 'hospital'
                ? 'bg-white text-[#C82021] shadow-2xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Hospital className="w-3.5 h-3.5" />
            <span>Hospitals</span>
          </button>
          <button
            onClick={() => setSelectedCategory('park')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === 'park'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span>Parks</span>
          </button>
        </div>
      </div>

      {/* Grid: Amenities List + Geolocation Map Point Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Amenities List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredAmenities.map((amenity) => {
            const isSelected = activeAmenity?.id === amenity.id;

            return (
              <div
                key={amenity.id}
                onClick={() => setActiveAmenityId(amenity.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-50/40 border-[#C82021] shadow-2xs'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-gray-100 border border-gray-200 shrink-0 mt-0.5">
                      {getIconForType(amenity.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-gray-900">
                          {amenity.name}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeColor(amenity.type)}`}>
                          {getTypeLabel(amenity.type)}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {amenity.address}
                      </p>

                      {amenity.curriculumOrSpecialty && (
                        <p className="text-[11px] text-gray-600 font-medium mt-1">
                          {amenity.curriculumOrSpecialty}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Distance & Travel Time Badges */}
                  <div className="text-left shrink-0 font-mono-num space-y-1">
                    <div className="flex items-center justify-end gap-1 text-xs font-bold text-gray-900">
                      <Navigation className="w-3 h-3 text-[#C82021]" />
                      <span>{amenity.distanceKm} km</span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-gray-500">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>~{amenity.driveTimeMins} mins</span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{amenity.rating}</span>
                      {amenity.reviewsCount && (
                        <span className="text-gray-400 font-normal">({amenity.reviewsCount})</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Geolocation Visual Map Preview (5 Cols) */}
        <div className="lg:col-span-5 bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-200">
            <span className="font-bold text-gray-800 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C82021]" />
              <span>Geolocation Proximity Radar</span>
            </span>
            <span className="text-[11px] font-mono-num text-gray-500">
              {property.coordinates.lat.toFixed(4)}°N, {property.coordinates.lng.toFixed(4)}°E
            </span>
          </div>

          {/* Mini Interactive Proximity Diagram */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white border border-gray-200 shadow-inner flex items-center justify-center">
            {/* Compass radial concentric circles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full border border-dashed border-gray-200" />
              <div className="w-32 h-32 rounded-full border border-dashed border-gray-200" />
              <div className="w-48 h-48 rounded-full border border-gray-200" />
            </div>

            {/* Central Property Pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="p-2 rounded-full bg-[#C82021] text-white shadow-md animate-pulse">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold text-gray-900 bg-white/95 px-1.5 py-0.5 rounded shadow-2xs mt-1 border border-gray-200 whitespace-nowrap">
                Subject Property
              </span>
            </div>

            {/* Active Amenity Pin plotted offset */}
            {activeAmenity && (
              <div
                className="absolute z-10 flex flex-col items-center transition-all duration-300"
                style={{
                  top: activeAmenity.type === 'school' ? '22%' : activeAmenity.type === 'hospital' ? '68%' : '30%',
                  right: activeAmenity.type === 'school' ? '18%' : activeAmenity.type === 'hospital' ? '25%' : '75%',
                }}
              >
                <div className="p-2 rounded-full bg-white text-gray-900 shadow-md border-2 border-[#C82021]">
                  {getIconForType(activeAmenity.type)}
                </div>
                <span className="text-[10px] font-bold text-gray-800 bg-white/95 px-1.5 py-0.5 rounded shadow-2xs mt-1 border border-gray-200 whitespace-nowrap max-w-[130px] truncate">
                  {activeAmenity.name}
                </span>
              </div>
            )}
          </div>

          {/* Active Highlight Summary */}
          {activeAmenity && (
            <div className="p-3 rounded-lg bg-white border border-gray-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{activeAmenity.name}</span>
                <span className="text-[11px] font-bold text-[#C82021] font-mono-num">
                  {activeAmenity.distanceKm} km · {activeAmenity.driveTimeMins} mins
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                GPS Coordinates: {activeAmenity.coordinates.lat}°N, {activeAmenity.coordinates.lng}°E
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
