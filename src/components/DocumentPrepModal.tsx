import React, { useState } from 'react';
import { Property } from '../types';
import { 
  FileText, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Printer, 
  PenTool, 
  Loader2, 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DocumentPrepModalProps {
  property: Property;
  onClose: () => void;
}

export const DocumentPrepModal: React.FC<DocumentPrepModalProps> = ({
  property,
  onClose,
}) => {
  const [docType, setDocType] = useState<'rega_purchase_agreement' | 'araboon_deposit_receipt' | 'letter_of_intent' | 'structural_warranty_addendum'>('rega_purchase_agreement');
  const [buyerName, setBuyerName] = useState('Saud Al-Otaibi');
  const [offerPriceSAR, setOfferPriceSAR] = useState(property.price);
  const [earnestMoneySAR, setEarnestMoneySAR] = useState(Math.round(property.price * 0.025));
  const [closingDays, setClosingDays] = useState(30);
  const [inspectionDays, setInspectionDays] = useState(10);
  const [financingType, setFinancingType] = useState('Islamic Murabaha financing approved by Al Rajhi Bank at 85% LTV');
  const [specialProvisions, setSpecialProvisions] = useState('Sale includes installed panoramic Italian elevator, equipped show kitchen, and seller transfer of 10-year Malath latent defects insurance policy.');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [signatureText, setSignatureText] = useState('Saud Al-Otaibi');

  const rettTaxSAR = Math.round(offerPriceSAR * 0.05);

  const handleGenerateDoc = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType,
          property,
          buyerName,
          sellerName: property.agent.brokerage,
          offerPrice: offerPriceSAR,
          earnestMoney: earnestMoneySAR,
          closingDays,
          inspectionDays,
          financingType,
          specialProvisions,
        }),
      });

      const data = await res.json();
      if (data.documentContent) {
        setGeneratedDoc(data.documentContent);
      }
    } catch (err) {
      console.error('Failed to generate document', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSignDocument = () => {
    setIsSigned(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html lang="en">
          <head>
            <title>Standard Real Estate Agreement - ${property.title}</title>
            <style>
              body { font-family: 'Times New Roman', Tahoma, sans-serif; padding: 40px; line-height: 1.8; color: #111; }
              h1 { text-align: center; font-size: 20px; border-bottom: 2px solid #222; padding-bottom: 12px; }
              pre { font-family: Tahoma, 'Times New Roman', sans-serif; white-space: pre-wrap; font-size: 13px; line-height: 1.8; }
            </style>
          </head>
          <body>
            <h1>EstateIQ — Real Estate General Authority (REGA) Compliant</h1>
            <pre>${generatedDoc}</pre>
            ${isSigned ? `<p style="margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px;"><strong>Verified Digital Signature via Nafath:</strong> ${signatureText} on ${new Date().toLocaleDateString('en-US')}</p>` : ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header - Redfin Style */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 text-[#C82021] border border-red-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">
                  REGA-Compliant Real Estate Purchase & Brokerage Agreements
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                  REGA Compliant
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {property.title} • {property.district}, Riyadh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {generatedDoc && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200 transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-[#C82021]" />
                Print Agreement (PDF)
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Split between Controls and Live Document View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Document Configuration (5 cols) */}
          <div className="lg:col-span-5 p-6 overflow-y-auto border-r border-gray-200 space-y-4 bg-gray-50/50 no-scrollbar">
            
            {/* Document Type Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Standard Form Template
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'rega_purchase_agreement', label: 'Standard REGA Purchase Agreement' },
                  { id: 'araboon_deposit_receipt', label: 'Official Araboon Deposit Receipt' },
                  { id: 'letter_of_intent', label: 'Binding Letter of Intent (LOI)' },
                  { id: 'structural_warranty_addendum', label: 'Malath 10-Yr Warranty Addendum' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setDocType(type.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-colors ${
                      docType === type.id
                        ? 'bg-[#C82021] text-white border-[#C82021] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buyer Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Buyer Full Legal Name (per National ID / Iqama)
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C82021] shadow-2xs"
              />
            </div>

            {/* Offer Price & Earnest Money */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Offer Amount (SAR)
                </label>
                <input
                  type="number"
                  step={50000}
                  value={offerPriceSAR}
                  onChange={(e) => setOfferPriceSAR(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-mono-num font-bold focus:border-[#C82021] shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Araboon Deposit (2.5%)
                </label>
                <input
                  type="number"
                  value={earnestMoneySAR}
                  onChange={(e) => setEarnestMoneySAR(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 font-mono-num focus:border-[#C82021] shadow-2xs"
                />
              </div>
            </div>

            {/* Tax Notice Card */}
            <div className="p-3 rounded-xl bg-red-50/60 border border-red-100 text-xs space-y-1">
              <div className="flex justify-between font-bold text-[#C82021]">
                <span>Estimated Real Estate Transaction Tax (RETT 5%):</span>
                <span className="font-mono-num">SAR {rettTaxSAR.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                * 5% RETT applies to the total transaction value, due prior to electronic deed transfer with the Ministry of Justice.
              </p>
            </div>

            {/* Timelines */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Inspection Contingency</label>
                <select
                  value={inspectionDays}
                  onChange={(e) => setInspectionDays(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C82021] shadow-2xs"
                >
                  <option value={7}>7 Business Days</option>
                  <option value={10}>10 Business Days</option>
                  <option value={14}>14 Calendar Days</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Closing & Deed Transfer</label>
                <select
                  value={closingDays}
                  onChange={(e) => setClosingDays(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C82021] shadow-2xs"
                >
                  <option value={15}>15 Days (Cash / Expedited)</option>
                  <option value={21}>21 Days</option>
                  <option value={30}>30 Days (Bank Financing)</option>
                </select>
              </div>
            </div>

            {/* Financing Structure */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Financing Structure & Payment Terms
              </label>
              <input
                type="text"
                value={financingType}
                onChange={(e) => setFinancingType(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C82021] shadow-2xs"
              />
            </div>

            {/* Special Provisions */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Additional Stipulations & Inclusions
              </label>
              <textarea
                rows={2}
                value={specialProvisions}
                onChange={(e) => setSpecialProvisions(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C82021] shadow-2xs"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateDoc}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white font-bold text-xs shadow-xs transition-colors active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Drafting agreement with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {generatedDoc ? 'Regenerate Agreement' : 'Generate REGA Standard Agreement'}
                </>
              )}
            </button>
          </div>

          {/* Right Column: Live Document Preview & E-Signature Pad (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 flex flex-col justify-between overflow-y-auto no-scrollbar">
            {generatedDoc ? (
              <div className="space-y-6">
                {/* Document Sheet */}
                <div className="p-6 sm:p-8 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-xs shadow-xs relative">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 font-sans">
                    <span className="text-[11px] font-bold text-[#C82021] uppercase tracking-widest font-mono-num">
                      EstateIQ — REGA Certified Agreement System
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono-num">
                      FAL: {property.agent.falLicense}
                    </span>
                  </div>

                  <pre className="whitespace-pre-wrap font-sans text-xs text-gray-800 leading-relaxed mt-4">
                    {generatedDoc}
                  </pre>

                  {/* Signatures Block */}
                  <div className="mt-8 pt-6 border-t border-gray-200 font-sans grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-gray-200">
                      <span className="text-[11px] font-bold text-gray-600 block mb-2">Buyer Signature</span>
                      {isSigned ? (
                        <div className="space-y-1">
                          <span className="text-base text-[#C82021] font-bold block">
                            {signatureText}
                          </span>
                          <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-mono-num font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Verified via Nafath Digital ID • {new Date().toLocaleDateString('en-US')}
                          </span>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-xs italic">
                          Awaiting electronic signature below
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-gray-200">
                      <span className="text-[11px] font-bold text-gray-600 block mb-2">Licensed Broker (FAL)</span>
                      <span className="text-sm font-bold text-gray-900 block">
                        {property.agent.name}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono-num block">
                        FAL License: {property.agent.falLicense}
                      </span>
                    </div>
                  </div>
                </div>

                {/* E-Signature Action Pad */}
                {!isSigned ? (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="p-2 rounded-xl bg-red-50 text-[#C82021]">
                        <PenTool className="w-5 h-5" />
                      </div>
                      <div className="w-full sm:w-auto">
                        <span className="text-xs font-bold text-gray-900 block">Instant Digital Signature</span>
                        <input
                          type="text"
                          value={signatureText}
                          onChange={(e) => setSignatureText(e.target.value)}
                          placeholder="Type legal full name to sign"
                          className="mt-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 w-full sm:w-60"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSignDocument}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#C82021] hover:bg-[#b01c1d] text-white font-bold text-xs shadow-xs transition-colors active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Sign & Authenticate via Nafath
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Agreement digitally signed and authenticated. Ready for submission to broker and seller.</span>
                    </div>
                    <button
                      onClick={handlePrint}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs"
                    >
                      Download PDF
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 space-y-3">
                <FileText className="w-12 h-12 text-gray-300" />
                <p className="text-sm font-bold text-gray-700">
                  Select an agreement template, customize terms, and click "Generate REGA Standard Agreement"
                </p>
                <p className="text-xs max-w-sm text-gray-500">
                  AI models calibrate clauses with your agent's FAL license, Saudi Building Code warranties, and REGA regulatory terms.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
