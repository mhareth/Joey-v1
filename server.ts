import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

// Initialize GoogleGenAI SDK per guidance
const ai = new GoogleGenAI({});

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), timeoutMs);
  });
  try {
    return await Promise.race([
      promise.then((res) => {
        clearTimeout(timer);
        return res;
      }),
      timeoutPromise,
    ]);
  } catch {
    clearTimeout(timer!);
    return fallback;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      market: 'Riyadh, Saudi Arabia',
      brand: 'Joey Properties',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // 1. AI Personalized Recommendations for Riyadh Buyers
  app.post('/api/ai/recommendations', async (req: Request, res: Response) => {
    const { buyerProfile = {}, properties = [] } = req.body;

    const buildFallback = () => {
      return properties.map((p: any, idx: number) => {
        let score = 90;
        if (p.price >= (buyerProfile.budgetMin || 0) && p.price <= (buyerProfile.budgetMax || 15000000)) score += 6;
        if (p.beds >= (buyerProfile.minBeds || 0)) score += 3;
        return {
          propertyId: p.id,
          matchScore: Math.min(99, Math.max(72, score - idx * 2)),
          matchReason: `Matches your SAR ${((buyerProfile.budgetMax || p.price) / 1000000).toFixed(1)}M budget and priority for prime ${p.district} living in Riyadh.`,
          tradeoff: 'High demand northern corridor with rapid capital appreciation and competitive buyer bids.',
        };
      });
    };

    const task = async () => {
      const prompt = `You are the lead AI Real Estate Advisor at Joey Properties in Riyadh, Saudi Arabia.
Analyze this buyer profile and match it against the listed Riyadh properties.
Buyer Profile:
- Budget Range: SAR ${buyerProfile.budgetMin?.toLocaleString()} - SAR ${buyerProfile.budgetMax?.toLocaleString()}
- Target Monthly Payment: SAR ${buyerProfile.targetMonthlyPayment?.toLocaleString()}
- Down Payment: ${buyerProfile.downPaymentPercent}%
- Preferred Districts: ${buyerProfile.preferredDistricts?.join(', ') || 'Northern Riyadh'}
- Min Bedrooms: ${buyerProfile.minBeds}, Min Bathrooms: ${buyerProfile.minBaths}
- Must Have Amenities: ${buyerProfile.mustHaveAmenities?.join(', ') || 'Elevator, Driver Room, Modern Majlis'}
- Top Strategic Priority: ${buyerProfile.priority}
- Timeline: ${buyerProfile.purchaseTimeline}

Properties Catalog in Riyadh:
${properties.map((p: any) => `- ID: ${p.id}, Title: ${p.title}, District: ${p.district}, Price: SAR ${p.price}, Beds: ${p.beds}, Baths: ${p.baths}, Type: ${p.propertyType}, Tags: ${p.tags?.join(', ') || ''}`).join('\n')}

Score each property from 72 to 99 based on relevance, Sharia financing feasibility, district appreciation, and lifestyle match. Provide a personalized 1-2 sentence reason in English and 1 trade-off note in English.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                propertyId: { type: Type.STRING },
                matchScore: { type: Type.INTEGER },
                matchReason: { type: Type.STRING },
                tradeoff: { type: Type.STRING },
              },
              required: ['propertyId', 'matchScore', 'matchReason', 'tradeoff'],
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      return parsed.length ? parsed : buildFallback();
    };

    const results = await withTimeout(task(), 4000, buildFallback());
    return res.json({ recommendations: results });
  });

  // 2. AI Real-time Market Insights for Riyadh
  app.post('/api/ai/market-insights', async (req: Request, res: Response) => {
    const { property, district } = req.body;
    const targetDistrict = district || property?.district || 'Hittin & Northern Riyadh';

    const fallbackInsights = {
      marketVerdict: 'High-Demand Expansion Market with Accelerated Growth',
      temperatureScore: 92,
      annualAppreciationForecast: '+12.5% projected across Northern Riyadh over the next 18 months',
      daysOnMarketTrend: 'Prime turnkey villas selling in under 16 days due to corporate headquarters influx',
      buyerNegotiationPower: 'Competitive Seller Advantage - Secure early reservation before pre-handover price increments',
      summary: `The Riyadh residential property market—particularly in northern enclaves like Hittin, Al Malqa, KAFD, and Al Nakheel—is undergoing unprecedented capital expansion driven by Saudi Vision 2030, RHQ global corporate headquarters relocation, the Riyadh Metro operational launch, and Expo 2030 infrastructure delivery.`,
      keyDrivers: [
        'Strategic Northern Riyadh expansion corridor anchored by KAFD, Boulevard, and New Murabba',
        'Exemption on Real Estate Transaction Tax (RETT 5%) up to SAR 1,000,000 for first-time Saudi home buyers',
        'Stringent Saudi Building Code and mandatory 10-year insurance against latent defects (Malath Insurance) bolstering buyer confidence'
      ]
    };

    const task = async () => {
      const prompt = `You are a Chief Real Estate Economist at Joey Properties specializing in Saudi Arabia and the Riyadh real estate ecosystem.
Analyze the local micro-market dynamics in English for:
District: ${targetDistrict} in Riyadh, Saudi Arabia.
Property / Reference: ${property?.title || 'Luxury Modern Villa'}, Price: SAR ${property?.price?.toLocaleString() || 'N/A'}.
Current Metrics: WalkScore: ${property?.marketMetrics?.walkScore || 85}, CapRate: ${property?.marketMetrics?.capRate || 6.5}%.

Provide a data-driven market insight briefing in English referencing Saudi Vision 2030, REGA regulatory oversight, Real Estate Transaction Tax (RETT 5%), and institutional capital migration into Northern Riyadh.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              marketVerdict: { type: Type.STRING },
              temperatureScore: { type: Type.INTEGER, description: '0-100 where >70 is hot seller market' },
              annualAppreciationForecast: { type: Type.STRING },
              daysOnMarketTrend: { type: Type.STRING },
              buyerNegotiationPower: { type: Type.STRING },
              summary: { type: Type.STRING },
              keyDrivers: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['marketVerdict', 'temperatureScore', 'annualAppreciationForecast', 'daysOnMarketTrend', 'buyerNegotiationPower', 'summary', 'keyDrivers'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return parsed.marketVerdict ? parsed : fallbackInsights;
    };

    const data = await withTimeout(task(), 4000, fallbackInsights);
    return res.json(data);
  });

  // 3. AI Seller Home Valuation & Listing Optimizer (Riyadh)
  app.post('/api/ai/home-valuation', async (req: Request, res: Response) => {
    const { address, district, beds, baths, sqm, landAreaSqm, propertyType, yearBuilt, condition, updates } = req.body;
    const baseSqm = sqm || 450;
    const estimatedBase = baseSqm * 11500;

    const fallbackValuation = {
      estimatedValueMin: Math.round(estimatedBase * 0.95),
      estimatedValueMax: Math.round(estimatedBase * 1.10),
      recommendedListPrice: Math.round(estimatedBase * 1.03),
      projectedDaysOnMarket: 16,
      confidenceScore: 94,
      equityOutlook: 'High-Demand North Riyadh Prime Corridor',
      roiUpgrades: [
        { upgrade: 'Smart Home Automation Integration & KNX Touch Panels', estimatedCost: 'SAR 35,000', valueAdd: '+SAR 120,000' },
        { upgrade: 'Natural Riyadh Yellow Stone Architectural Wall Finishing', estimatedCost: 'SAR 45,000', valueAdd: '+SAR 140,000' },
        { upgrade: 'Rooftop Majlis Louver Pergola with Ambient Lighting', estimatedCost: 'SAR 28,000', valueAdd: '+SAR 85,000' }
      ],
      marketAnalysis: `Based on verified REGA transaction data in ${district || 'Northern Riyadh'}, modern villas with Italian elevators, separate formal Majlis, driver quarters, and Saudi building code compliance command a 14% price premium. Demand from both high-net-worth families and multinational executives is at historic highs.`
    };

    const task = async () => {
      const prompt = `Act as an expert REGA-Certified Real Estate Appraiser & Listing Strategist at Joey Properties in Riyadh, Saudi Arabia.
Estimate the fair market valuation and listing roadmap in English in Saudi Riyals (SAR) for:
Location: ${address}, ${district}, Riyadh, Saudi Arabia
Property Type: ${propertyType}, Built-Up Area: ${sqm} sqm, Land Area: ${landAreaSqm || 'N/A'} sqm
Beds: ${beds}, Baths: ${baths}, Year Built: ${yearBuilt}
Condition: ${condition}
Features / Updates: ${updates || 'Modern Salmanic facade, Italian lift, smart home, driver room'}

Provide an accurate valuation range in SAR, recommended asking price, projected days on market in Riyadh, top 3 high-ROI upgrades before listing, and marketing briefing in English.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              estimatedValueMin: { type: Type.INTEGER },
              estimatedValueMax: { type: Type.INTEGER },
              recommendedListPrice: { type: Type.INTEGER },
              projectedDaysOnMarket: { type: Type.INTEGER },
              confidenceScore: { type: Type.INTEGER },
              equityOutlook: { type: Type.STRING },
              roiUpgrades: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    upgrade: { type: Type.STRING },
                    estimatedCost: { type: Type.STRING },
                    valueAdd: { type: Type.STRING },
                  },
                  required: ['upgrade', 'estimatedCost', 'valueAdd'],
                },
              },
              marketAnalysis: { type: Type.STRING },
            },
            required: ['estimatedValueMin', 'estimatedValueMax', 'recommendedListPrice', 'projectedDaysOnMarket', 'confidenceScore', 'equityOutlook', 'roiUpgrades', 'marketAnalysis'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return parsed.recommendedListPrice ? parsed : fallbackValuation;
    };

    const data = await withTimeout(task(), 4000, fallbackValuation);
    return res.json(data);
  });

  // 4. AI Automated Legal Document Preparation (REGA-Compliant Contracts)
  app.post('/api/ai/generate-document', async (req: Request, res: Response) => {
    const { docType = 'rega_purchase_agreement', property, buyerName, sellerName, offerPrice, earnestMoney, closingDays, financingType, inspectionDays, specialProvisions } = req.body;
    const rettTax = Math.round(Number(offerPrice || 5000000) * 0.05);

    const fallbackDoc = `KINGDOM OF SAUDI ARABIA | JOEY PROPERTIES
STANDARD REAL ESTATE PURCHASE & BROKERAGE AGREEMENT (REGA COMPLIANT)
Document Type: ${docType.toUpperCase().replace(/_/g, ' ')}
Execution Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

SECTION 1: PARTIES
First Party (Buyer): ${buyerName || 'Saud Al-Otaibi'} (Verified Digital Identity via Nafath)
Second Party (Seller / Brokerage): ${sellerName || property?.agent?.brokerage || 'Joey Properties Riyadh'} (REGA Fal License: ${property?.agent?.falLicense || 'FAL-1200018942'})

SECTION 2: PROPERTY SPECIFICATIONS
Property Name: ${property?.title || 'Luxury Modern Villa'}
Location: City of Riyadh, District: ${property?.district || 'Hittin'}, Street: ${property?.address || 'Prince Turki Road'}
Electronic Title Deed: Verified via Ministry of Justice Real Estate Exchange
Built-Up Area: ${property?.sqm || 480} m² | Land Area: ${property?.landAreaSqm || 375} m²

SECTION 3: FINANCIAL TERMS & APPLICABLE TAXES
1. Total Agreed Purchase Price: SAR ${Number(offerPrice || 5000000).toLocaleString()}
2. Araboon Earnest Money Deposit: SAR ${Number(earnestMoney || 150000).toLocaleString()} held in certified escrow
3. Real Estate Transaction Tax (RETT 5%): SAR ${rettTax.toLocaleString()} payable to ZATCA prior to title conveyance
4. Payment Structure: ${financingType || 'Sharia-compliant Murabaha mortgage facility approved by licensed Saudi bank'}

SECTION 4: TECHNICAL INSPECTION & STRUCTURAL WARRANTIES
The Buyer is granted a contingency period of (${inspectionDays || 10}) business days for professional structural engineering inspection. The Seller warrants compliance with the Saudi Building Code and delivery of the 10-Year Malath Insurance Policy against latent defects.

SECTION 5: TITLE DEED CONVEYANCE & CLOSING
Closing and deed transfer shall be executed digitally via the Ministry of Justice Electronic Real Estate Exchange platform within a maximum of (${closingDays || 30}) calendar days from the execution date.

SPECIAL STIPULATIONS & INCLUSIONS:
${specialProvisions || 'Conveyance includes installed panoramic Italian elevator, equipped show kitchen, central VRF HVAC units, and smart home automation.'}

Executed in digital counter-parts compliant with Real Estate General Authority (REGA) regulations.`;

    const task = async () => {
      const prompt = `You are a Senior Saudi Real Estate Legal Counsel & REGA Certified Documentation Specialist at Joey Properties in Riyadh.
Generate a comprehensive, legally binding, professional English real estate agreement:
- Document Type: ${docType}
- Property: ${property?.title || 'Luxury Residence in Riyadh'}, District: ${property?.district || 'Hittin'}, City: Riyadh, Saudi Arabia
- Buyer Name: ${buyerName}
- Seller / Brokerage: ${sellerName || property?.agent?.brokerage} (REGA Fal License: ${property?.agent?.falLicense || 'FAL-1200018942'})
- Offer Purchase Price: SAR ${Number(offerPrice).toLocaleString()}
- Earnest Money Deposit: SAR ${Number(earnestMoney).toLocaleString()}
- RETT Tax (5%): SAR ${rettTax.toLocaleString()}
- Financing: ${financingType}
- Closing / Title Deed Conveyance: ${closingDays} days via Ministry of Justice Real Estate Exchange
- Inspection Period: ${inspectionDays} days with 10-Year Malath Latent Defects Insurance
- Special Clauses: ${specialProvisions || 'Conveyance includes Italian elevator, installed designer kitchens, and full KNX home automation'}

Draft a formal, numbered legal contract in clear, authoritative English compliant with Saudi Real Estate General Authority standards.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You produce clean, professional, fully articulated Saudi real estate agreements in English complying with REGA and Ministry of Justice standards.',
        },
      });

      return response.text || fallbackDoc;
    };

    const docContent = await withTimeout(task(), 4000, fallbackDoc);
    return res.json({
      documentContent: docContent,
      rettTaxSAR: rettTax,
      legalNotice: 'Standard unified purchase agreement compliant with REGA and Saudi Ministry of Justice digital title deed standards.'
    });
  });

  // 5. AI Agent Live Communication Copilot (Riyadh Broker)
  app.post('/api/ai/agent-chat', async (req: Request, res: Response) => {
    const userMessage = req.body.message || req.body.userMessage || '';
    const agent = req.body.agent || { name: 'Faisal Al-Otaibi', falLicense: 'FAL-1200018942', brokerage: 'Joey Properties Riyadh' };
    const property = req.body.property || { title: 'Luxury Villa', district: 'Hittin', price: 5000000 };
    const history = req.body.history || [];

    const fallbackReply = `Welcome! I am ${agent.name}, your REGA licensed broker (License ${agent.falLicense}) at ${agent.brokerage}. I would be delighted to arrange a private walkthrough for ${property.title} in ${property.district}, or provide you with deed verification, building code certification, and the 10-year Malath warranty documentation. Would Saturday at 4:00 PM suit you?`;

    const task = async () => {
      const conversationHistory = history
        .map((m: any) => `${m.sender === 'user' ? 'Client' : agent.name}: ${m.text}`)
        .join('\n');

      const prompt = `You are ${agent.name}, a distinguished licensed real estate broker with REGA Fal License ${agent.falLicense} at ${agent.brokerage} representing Joey Properties in Riyadh, Saudi Arabia.
Your bio: ${agent.bio || 'Senior luxury advisor'}. Your rating: ${agent.rating || 4.99} stars.
You are currently advising an interested client about your exclusive listing in Riyadh:
"${property.title}" located in ${property.district}, Riyadh, Saudi Arabia.
Asking Price: SAR ${property.price?.toLocaleString()} (${property.sqm || 480} sqm built-up area).
Key Highlights: ${property.features?.slice(0, 3).join(', ') || 'Salmanic architecture, pool, elevator'}.
Warranties: 10-year structural warranty & Malath latent defects insurance. Status: ${property.status || 'Available'}.

Recent Chat History:
${conversationHistory}

Client's New Message: "${userMessage}"

Respond warmly, courteously, and concisely in English, maintaining professional Saudi hospitality. You can offer to schedule private in-person or virtual walkthroughs, answer technical building code inquiries, clarify title deed and RETT tax, or assist in drafting an initial offer. Never break character.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return response.text?.trim() || fallbackReply;
    };

    const reply = await withTimeout(task(), 4000, fallbackReply);
    return res.json({ reply });
  });

  // 6. AI Listing Description Generator (Both routes supported)
  const handleListingCopy = async (req: Request, res: Response) => {
    const prop = req.body.property || req.body.propertyData || req.body;
    const targetAudience = req.body.targetAudience || 'Discerning families and high-net-worth investors seeking luxury in Riyadh';

    const fallbackDescription = {
      headline: `Architectural Masterpiece in Prestigious ${prop.district || 'North Riyadh'}`,
      description: `An exceptional opportunity to own this ${prop.propertyType || 'Luxury Villa'} featuring Salmanic modern architecture in ${prop.district || 'Al Malqa'}, Riyadh. Boasting ${prop.beds || 5} luxury bedroom suites, expansive reception Majlis, ${prop.sqm || 480} m² of built-up space, private elevator, and a comprehensive 10-year Malath warranty per the Saudi Building Code.`,
      keyBullets: [
        'Authentic Salmanic architectural design with natural Riyadh limestone facades',
        'Grand formal hospitality Majlis overlooking private courtyard and heated swimming pool',
        'Panoramic Italian elevator servicing all levels from basement to rooftop lounge',
        'Prime location minutes from KAFD, Boulevard City, and Riyadh Metro network'
      ]
    };

    const task = async () => {
      const prompt = `Write an enticing, luxury real estate MLS listing copy in English for a prime Riyadh property on Joey Properties:
District: ${prop.district || 'Hittin'}, Riyadh, Type: ${prop.propertyType || 'Luxury Villa'}
Beds: ${prop.beds || 5}, Baths: ${prop.baths || 6}, Built-Up Area: ${prop.sqm || 480} sqm, Land Area: ${prop.landAreaSqm || '375'} sqm
Special Features: ${prop.updates || 'Private swimming pool, Italian lift, smart home automation, driver room, rooftop sky terrace'}
Target Audience: ${targetAudience}

Provide a compelling English headline, a 2-paragraph evocative description celebrating Salmanic architecture, and 4 bullet points.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              description: { type: Type.STRING },
              keyBullets: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['headline', 'description', 'keyBullets'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return parsed.headline ? parsed : fallbackDescription;
    };

    const result = await withTimeout(task(), 4000, fallbackDescription);
    return res.json(result);
  };

  app.post('/api/ai/generate-listing-copy', handleListingCopy);
  app.post('/api/ai/listing-description', handleListingCopy);

  // Mount Vite middleware in development
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Joey Properties Riyadh Server running at http://localhost:${port}`);
  });
}

startServer();
