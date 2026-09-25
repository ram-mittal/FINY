/* ============================================================
   RURAL ENTERPRISE ADVISOR — arthX
   
   Problem Statement Implementation:
   ─────────────────────────────────
   Module 1: Hyper-Local Business Feasibility Report
     1. Market Reach (5-10km radius consumer base)
     2. Opportunity Analysis (unserved/underserved niches)
     3. SWOT Analysis (tailored to micro-enterprise budget)
     4. Threats Identification (local risks)
     5. Competitor Mapping (density of existing businesses)
     6. Product Market Value (pricing + local purchasing power)
   
   Module 2: Smart Financial Calculator & Scheme Router
     7. Financial Structuring (Margin → Project Cost → Loan)
     8. Scheme Auto-Selection (Micro Finance vs Term Loan)
     9. EMI & Moratorium Generator (quarterly repayment schedule)

   Inputs: Location, Available Margin Capital, Business Category
============================================================ */

(function () {
  'use strict';

  const advisorForm = document.getElementById('advisorForm');
  const advisorDisplay = document.getElementById('advisorDisplay');
  let currentUser = null;

  document.addEventListener('arthx:auth', (e) => {
    currentUser = e.detail.user;
    if (currentUser) loadSavedReports();
  });

  // ══════════════════════════════════════════════════════════
  //  INDUSTRY KNOWLEDGE BASE
  //  Deep heuristic data for each business category
  // ══════════════════════════════════════════════════════════
  const INDUSTRY_DATA = {
    dairy: {
      label: 'Dairy Farming',
      avgRevenuePerLakh: 1.8,       // Revenue multiplier per lakh invested
      operatingCostRatio: 0.55,     // % of revenue spent on operations
      workingCapitalMonths: 4,      // Months of working capital needed
      marketReach: { radiusKm: 8, householdsPerKm: 120, penetrationRate: 0.35 },
      demandElasticity: 'Inelastic — Dairy is an essential daily commodity with near-guaranteed daily demand in rural clusters.',
      seasonality: 'Peak demand during festive season (Oct-Jan). Lean period in monsoon months due to fodder logistics.',
      supplyChainRisk: 'Medium — Cold chain infrastructure is the primary bottleneck. Perishability demands same-day distribution.',
      strengths: ['Essential commodity with daily demand cycle', 'Low entry barrier with minimal mechanization', 'Government subsidies available via NABARD dairy schemes', 'Strong cooperative ecosystem (Amul model replicable)'],
      weaknesses: ['High perishability — zero tolerance for logistics delay', 'Dependency on cattle health and veterinary access', 'Seasonal variation in milk yield and fodder costs', 'Thin margins without value-add processing (curd, paneer, ghee)'],
      opportunities: ['Value-added dairy products (paneer, ghee, flavoured milk) command 3-5x margins', 'Direct-to-consumer delivery via WhatsApp ordering', 'Organic/A2 milk premium positioning for semi-urban markets', 'Government push for dairy cooperatives under DEDS scheme'],
      threats: ['Large cooperative societies (Amul, Mother Dairy) dominate pricing', 'Lumpy Skin Disease and other cattle epidemics', 'Monsoon-driven fodder price spikes (+30-40%)', 'Price regulation by state dairy federations limiting margins'],
      competitors: { avgDensityPer10km: 4, vulnerability: 'Most are unbranded, lack cold storage, and do not offer processed dairy products.' },
      pricing: { unitName: 'litre', minPrice: 40, maxPrice: 70, avgLocal: 52 },
      govSchemes: ['Dairy Entrepreneurship Development Scheme (DEDS)', 'NABARD Dairy Infrastructure Fund', 'National Dairy Plan Phase II']
    },
    retail: {
      label: 'Retail / Kirana Store',
      avgRevenuePerLakh: 2.2,
      operatingCostRatio: 0.72,
      workingCapitalMonths: 3,
      marketReach: { radiusKm: 5, householdsPerKm: 180, penetrationRate: 0.60 },
      demandElasticity: 'Inelastic — FMCG and daily essentials have non-negotiable demand. Discretionary goods are elastic.',
      seasonality: 'Consistent year-round demand. Spike during harvest season when rural purchasing power peaks.',
      supplyChainRisk: 'Low — Established FMCG distribution networks reach most blocks. Wholesaler relationships are key.',
      strengths: ['Daily footfall for essentials ensures stable cash flow', 'Low spoilage risk for most FMCG products', 'Strong personal customer relationships in rural areas', 'Credit-based selling (khata system) builds loyalty'],
      weaknesses: ['Intense competition with low differentiation', 'High inventory holding costs with thin margins (8-15%)', 'Dependency on wholesaler credit terms', 'Limited scalability without significant capital infusion'],
      opportunities: ['Digital payments (UPI, Paytm) can capture semi-urban customers', 'Becoming a distribution hub for online platforms (Amazon Easy, JioMart)', 'Private labeling of staples (atta, rice, oil) for higher margins', 'Home delivery services for elderly/remote households'],
      threats: ['E-commerce platforms (JioMart, Flipkart Wholesale) eroding margins', 'New entrants with deeper pockets opening in the same radius', 'Wholesale price fluctuations squeezing already thin margins', 'GST compliance costs for small retailers'],
      competitors: { avgDensityPer10km: 8, vulnerability: 'Most lack digital billing, home delivery, and product variety beyond essentials.' },
      pricing: { unitName: 'monthly revenue', minPrice: 30000, maxPrice: 150000, avgLocal: 70000 },
      govSchemes: ['PM SVANidhi (Street Vendor support)', 'MUDRA Yojana — Kishore/Tarun', 'Stand-Up India']
    },
    textiles: {
      label: 'Textiles / Garments',
      avgRevenuePerLakh: 1.6,
      operatingCostRatio: 0.58,
      workingCapitalMonths: 5,
      marketReach: { radiusKm: 15, householdsPerKm: 100, penetrationRate: 0.25 },
      demandElasticity: 'Elastic — Highly seasonal, with demand spiking during festivals, weddings, and harvest.',
      seasonality: 'Strong peaks during Diwali (Oct-Nov), wedding season (Nov-Feb), and Eid. Lean period: Jun-Aug.',
      supplyChainRisk: 'Medium — Raw material sourcing from textile hubs (Surat, Tirupur) requires established networks.',
      strengths: ['High margins on branded/designer garments (40-60%)', 'Leverages local craft traditions (block print, handloom)', 'Festival/wedding demand creates bulk order opportunities', 'Low fixed costs with shop-based model'],
      weaknesses: ['Heavy inventory investment with seasonal risk', 'Fashion trend dependency requiring constant sourcing updates', 'Returns and unsold stock erode margins', 'Requires understanding of local taste preferences'],
      opportunities: ['Online sales via Instagram, Facebook Marketplace, Meesho', 'Handloom/khadi products attract government subsidies', 'Custom stitching + readymade combo shop model', 'Export potential for traditional Indian textiles'],
      threats: ['Fast fashion imports from China and Bangladesh', 'Online fashion platforms (Myntra, Meesho) lowering prices', 'Counterfeit branded goods diluting market trust', 'GST on textiles increasing compliance burden'],
      competitors: { avgDensityPer10km: 3, vulnerability: 'Most lack online presence and do not offer custom tailoring services.' },
      pricing: { unitName: 'garment', minPrice: 200, maxPrice: 2500, avgLocal: 600 },
      govSchemes: ['PMEGP for textile manufacturing', 'Handloom Weavers Comprehensive Welfare Scheme', 'Amended Technology Upgradation Fund Scheme (ATUFS)']
    },
    poultry: {
      label: 'Poultry Farming',
      avgRevenuePerLakh: 2.0,
      operatingCostRatio: 0.62,
      workingCapitalMonths: 3,
      marketReach: { radiusKm: 10, householdsPerKm: 110, penetrationRate: 0.40 },
      demandElasticity: 'Inelastic — Protein demand is consistent. Egg consumption is daily in most demographics.',
      seasonality: 'Winter demand peaks (Oct-Feb). Summer sees slight dip. Monsoon brings health risks.',
      supplyChainRisk: 'Medium-High — Disease outbreaks (Avian Flu) can devastate stock. Biosecurity is critical.',
      strengths: ['Quick revenue cycle (broilers in 35-40 days)', 'Consistent demand for eggs as daily protein source', 'Scalable — start small and expand based on demand', 'Low land requirement compared to cattle farming'],
      weaknesses: ['Disease vulnerability (Avian Flu, Newcastle disease)', 'Feed costs are volatile (60-70% of total costs)', 'Requires specialized knowledge of poultry management', 'High mortality rate without proper biosecurity'],
      opportunities: ['Processed poultry products (marinated, frozen) for urban markets', 'Contract farming agreements with companies like Suguna, Venky\'s', 'Organic/free-range eggs command 2-3x premium', 'Integration with fish farming for diversified income'],
      threats: ['Avian Influenza outbreaks causing mass culling', 'Feed price inflation (soybean, maize dependency)', 'Seasonal disease pressure during monsoon', 'Consumer scare during disease outbreaks tanking prices'],
      competitors: { avgDensityPer10km: 2, vulnerability: 'Most operate informally without cold chain or branding.' },
      pricing: { unitName: 'kg (broiler)', minPrice: 120, maxPrice: 220, avgLocal: 160 },
      govSchemes: ['NABARD Poultry Venture Capital Fund', 'National Livestock Mission', 'Rashtriya Krishi Vikas Yojana']
    },
    agriculture: {
      label: 'Agriculture / Horticulture',
      avgRevenuePerLakh: 1.4,
      operatingCostRatio: 0.50,
      workingCapitalMonths: 6,
      marketReach: { radiusKm: 12, householdsPerKm: 90, penetrationRate: 0.45 },
      demandElasticity: 'Inelastic for staples (rice, wheat). Elastic for horticulture (fruits, flowers).',
      seasonality: 'Kharif (Jun-Oct) and Rabi (Nov-Mar) cycles. Revenue concentrated post-harvest.',
      supplyChainRisk: 'High — Weather dependency, lack of cold storage, and mandi exploitation are systemic risks.',
      strengths: ['Land as a productive asset with multi-crop potential', 'Government MSP ensures minimum price floor for staples', 'Access to subsidized inputs (seeds, fertilizers)', 'Growing demand for organic produce at premium prices'],
      weaknesses: ['Weather and monsoon dependency creating yield uncertainty', 'Long cash conversion cycle (3-6 months per crop)', 'Post-harvest losses up to 25-30% without cold storage', 'Small landholdings limit economies of scale'],
      opportunities: ['Precision agriculture using IoT sensors and mobile apps', 'Direct-to-consumer via farmer markets and FPOs', 'Contract farming with corporates (ITC, Reliance)', 'Government pushing Agricultural Infrastructure Fund aggressively'],
      threats: ['Climate change increasing drought/flood frequency', 'Middlemen exploitation at mandis suppressing farmer income', 'Rising input costs (diesel, fertilizers, pesticides)', 'Land fragmentation across generations reducing viability'],
      competitors: { avgDensityPer10km: 12, vulnerability: 'Most farmers lack market access, quality certification, and value-addition capability.' },
      pricing: { unitName: 'quintal', minPrice: 1800, maxPrice: 4500, avgLocal: 2800 },
      govSchemes: ['PM-KISAN', 'Agriculture Infrastructure Fund (AIF)', 'Kisan Credit Card (KCC)', 'PM Fasal Bima Yojana']
    },
    food_processing: {
      label: 'Food Processing',
      avgRevenuePerLakh: 1.9,
      operatingCostRatio: 0.55,
      workingCapitalMonths: 4,
      marketReach: { radiusKm: 20, householdsPerKm: 130, penetrationRate: 0.30 },
      demandElasticity: 'Moderate — Processed snacks are discretionary but packaged staples have steady demand.',
      seasonality: 'Festival season drives demand spikes. Summer beverages and winter snacks follow patterns.',
      supplyChainRisk: 'Medium — FSSAI compliance, packaging, and shelf-life management are critical.',
      strengths: ['High value-addition margins (raw material → packaged product)', 'Leverages local agricultural surplus as cheap raw material', 'Growing consumer preference for packaged/branded food', 'Government actively promoting food processing via PMKSY'],
      weaknesses: ['FSSAI licensing and food safety compliance costs', 'Requires specialized equipment (packaging, sealing, labeling)', 'Shelf-life management and cold chain challenges', 'Brand building requires sustained marketing investment'],
      opportunities: ['Micro food processing units get 35% capital subsidy under PMFME', 'Export potential for pickles, spices, and snacks', 'E-commerce platforms enabling direct nationwide sales', 'Organic food processing commands premium pricing'],
      threats: ['Large FMCG brands dominating shelf space', 'Raw material price volatility impacting margins', 'Strict regulatory compliance increasing operational costs', 'Quality consistency challenges in manual production'],
      competitors: { avgDensityPer10km: 2, vulnerability: 'Most are home-based without proper FSSAI licensing or branded packaging.' },
      pricing: { unitName: 'kg (processed)', minPrice: 100, maxPrice: 500, avgLocal: 250 },
      govSchemes: ['PM Formalisation of Micro Food Processing Enterprises (PMFME)', 'PMKSY — Sampada', 'NABARD Food Processing Fund']
    },
    handicrafts: {
      label: 'Handicrafts / Artisanal',
      avgRevenuePerLakh: 1.5,
      operatingCostRatio: 0.45,
      workingCapitalMonths: 5,
      marketReach: { radiusKm: 25, householdsPerKm: 80, penetrationRate: 0.15 },
      demandElasticity: 'Elastic — Luxury/gift segment. High margins but inconsistent demand.',
      seasonality: 'Festival and wedding season (Oct-Feb). Tourism season in craft-heavy regions.',
      supplyChainRisk: 'Low — Primarily skill-based with locally sourced raw materials.',
      strengths: ['Unique products with cultural value and GI potential', 'Low raw material costs — value is in craftsmanship', 'Export demand for authentic Indian handicrafts', 'Government support through DC-Handicrafts'],
      weaknesses: ['Inconsistent demand outside festival/tourist seasons', 'Pricing power limited without brand recognition', 'Skill dependency — limited scalability without training', 'Long production cycles for high-quality pieces'],
      opportunities: ['E-commerce platforms (Amazon Karigar, GoCoop) for national reach', 'GI tagging for regional crafts increases perceived value', 'Corporate gifting market worth ₹30,000+ crore', 'Craft tourism and workshop experiences as revenue streams'],
      threats: ['Machine-made imitations flooding markets at lower prices', 'Declining interest among younger artisans', 'Seasonal demand volatility', 'Export challenges (compliance, logistics, payments)'],
      competitors: { avgDensityPer10km: 5, vulnerability: 'Most artisans lack e-commerce presence, branding, and direct market access.' },
      pricing: { unitName: 'piece', minPrice: 200, maxPrice: 5000, avgLocal: 800 },
      govSchemes: ['National Handicraft Development Programme', 'Mudra Yojana — Shishu/Kishore', 'SFURTI Cluster Scheme']
    },
    fishery: {
      label: 'Fishery / Aquaculture',
      avgRevenuePerLakh: 2.1,
      operatingCostRatio: 0.52,
      workingCapitalMonths: 5,
      marketReach: { radiusKm: 15, householdsPerKm: 100, penetrationRate: 0.35 },
      demandElasticity: 'Inelastic — Fish protein demand is stable in non-vegetarian demographics.',
      seasonality: 'Year-round demand with peaks in winter. Monsoon is breeding + lean fishing season.',
      supplyChainRisk: 'Medium — Cold chain essential. Disease management in aquaculture requires expertise.',
      strengths: ['High protein demand with growing health consciousness', 'Aquaculture has controlled, predictable yields', 'Multiple revenue streams (fish + prawn + crab)', 'Strong government support under Blue Revolution'],
      weaknesses: ['High initial infrastructure cost (ponds, aeration, feed)', 'Disease management requires technical knowledge', 'Cold chain dependency for quality maintenance', 'Water quality and availability dependency'],
      opportunities: ['Ornamental fish farming for urban hobbyist market', 'Fish seed production as standalone high-margin business', 'Integration with paddy farming (paddy-fish culture)', 'Export market for shrimp and prawn (₹47,000 crore)'],
      threats: ['Climate change affecting water temperatures and breeding', 'Antibiotic-resistant diseases in intensive aquaculture', 'Competition from imported fish (e.g., Basa from Vietnam)', 'Regulatory changes on fishing licenses and pond leases'],
      competitors: { avgDensityPer10km: 2, vulnerability: 'Most lack cold chain, branding, and value-added processing capabilities.' },
      pricing: { unitName: 'kg', minPrice: 150, maxPrice: 400, avgLocal: 220 },
      govSchemes: ['Pradhan Mantri Matsya Sampada Yojana (PMMSY)', 'Blue Revolution — NFDB', 'KCC for Fisheries']
    },
    transport: {
      label: 'Transport / Auto Services',
      avgRevenuePerLakh: 1.7,
      operatingCostRatio: 0.60,
      workingCapitalMonths: 2,
      marketReach: { radiusKm: 20, householdsPerKm: 150, penetrationRate: 0.30 },
      demandElasticity: 'Moderate — Goods transport is inelastic. Passenger transport is elastic.',
      seasonality: 'Harvest season creates high goods transport demand. Festivals increase passenger demand.',
      supplyChainRisk: 'Low — Fuel and vehicle maintenance are predictable costs.',
      strengths: ['Daily cash flow from passenger/goods movement', 'Low skill requirement for driving-based businesses', 'High demand in areas with poor public transport', 'Asset-backed business (vehicle has resale value)'],
      weaknesses: ['Fuel costs as volatile and significant operating expense', 'Vehicle depreciation and maintenance costs', 'Regulatory compliance (permits, insurance, fitness certificates)', 'Driver dependency and labor management challenges'],
      opportunities: ['Last-mile delivery for e-commerce companies', 'Shared mobility services for rural areas (auto-pooling)', 'Electric vehicle transition with government subsidies (FAME II)', 'Ambulance/medical transport services in underserved areas'],
      threats: ['Fuel price inflation directly impacting margins', 'Competition from aggregators (Ola, Uber, Rapido)', 'Road quality affecting vehicle maintenance costs', 'Regulatory changes on vehicle permits and emissions'],
      competitors: { avgDensityPer10km: 6, vulnerability: 'Most operate single vehicles without route optimization or fleet management.' },
      pricing: { unitName: 'trip', minPrice: 50, maxPrice: 500, avgLocal: 200 },
      govSchemes: ['FAME II (Electric Vehicle Subsidy)', 'MUDRA Yojana — Tarun', 'Stand-Up India']
    },
    salon: {
      label: 'Salon / Beauty Parlour',
      avgRevenuePerLakh: 2.3,
      operatingCostRatio: 0.40,
      workingCapitalMonths: 2,
      marketReach: { radiusKm: 5, householdsPerKm: 200, penetrationRate: 0.45 },
      demandElasticity: 'Moderate — Basic grooming is inelastic. Premium services are elastic.',
      seasonality: 'Wedding season (Oct-Feb) and festivals create peak demand. Lean period: Jul-Sep.',
      supplyChainRisk: 'Low — Consumables are widely available. Skill is the primary value driver.',
      strengths: ['High margins (60-70%) on services', 'Low initial investment with skill-based model', 'Recurring customer base with daily/weekly visits', 'Cross-selling opportunities (products + services)'],
      weaknesses: ['Skilled staff retention is a challenge', 'Location dependency — needs high footfall area', 'Quality inconsistency without training standards', 'Limited scalability without additional staff'],
      opportunities: ['Bridal and event styling services at premium rates', 'Product retail sales alongside services', 'Mobile beauty services for home visits', 'Men\'s grooming as rapidly growing segment'],
      threats: ['Branded salon chains (Lakme, Jawed Habib) entering semi-urban areas', 'Staff poaching by competitors', 'Hygiene complaints affecting reputation', 'Seasonal demand drops reducing cash flow'],
      competitors: { avgDensityPer10km: 4, vulnerability: 'Most lack trained professionals, branded products, and hygiene certifications.' },
      pricing: { unitName: 'service', minPrice: 50, maxPrice: 2000, avgLocal: 300 },
      govSchemes: ['PMKVY (Skill Development)', 'MUDRA Yojana', 'Stand-Up India (Women Entrepreneurs)']
    },
    flour_mill: {
      label: 'Flour Mill / Rice Mill',
      avgRevenuePerLakh: 1.8,
      operatingCostRatio: 0.55,
      workingCapitalMonths: 3,
      marketReach: { radiusKm: 10, householdsPerKm: 140, penetrationRate: 0.55 },
      demandElasticity: 'Inelastic — Flour and rice are daily staples with guaranteed demand.',
      seasonality: 'Post-harvest season (Oct-Dec, Mar-Apr) brings bulk processing demand.',
      supplyChainRisk: 'Low — Raw material (wheat, paddy) is locally abundant in rural areas.',
      strengths: ['Essential service with daily demand', 'Simple technology, easy to operate', 'High margins on custom milling services', 'Bulk processing for ration shops and PDS'],
      weaknesses: ['Electricity dependency and power cuts in rural areas', 'Dust and noise pollution compliance requirements', 'Equipment maintenance costs', 'Low margins on commodity milling without branding'],
      opportunities: ['Branded packaging for direct retail sales', 'Multi-grain and organic flour as premium products', 'Government procurement contracts for PDS', 'Spice grinding as additional service'],
      threats: ['Large commercial mills with economies of scale', 'Power cost increases affecting profitability', 'Competition from other local mills', 'Equipment breakdown causing service disruption'],
      competitors: { avgDensityPer10km: 3, vulnerability: 'Most offer only basic milling without branded packaging or product diversification.' },
      pricing: { unitName: 'kg (milling charge)', minPrice: 3, maxPrice: 10, avgLocal: 5 },
      govSchemes: ['PMFME (Food Processing)', 'PMEGP', 'MUDRA Yojana']
    },
    welding: {
      label: 'Welding / Fabrication',
      avgRevenuePerLakh: 1.6,
      operatingCostRatio: 0.50,
      workingCapitalMonths: 3,
      marketReach: { radiusKm: 12, householdsPerKm: 100, penetrationRate: 0.20 },
      demandElasticity: 'Moderate — Construction demand drives bulk orders. Repair work is consistent.',
      seasonality: 'Construction season (Oct-May) is peak. Monsoon brings lean period.',
      supplyChainRisk: 'Medium — Steel and iron prices are volatile and impact margins directly.',
      strengths: ['Essential trade for construction and agriculture', 'High skill premium commands good rates', 'Low competition from organized sector in rural areas', 'Diverse applications (gates, furniture, farm equipment)'],
      weaknesses: ['Raw material price volatility (steel, iron)', 'Physical labor intensity limiting output', 'Safety hazards and health risks', 'Power dependency for electric welding'],
      opportunities: ['Custom fabrication for agricultural equipment', 'Solar panel mounting structures (growing demand)', 'Modular steel furniture for rural housing', 'Government infrastructure projects requiring fabrication'],
      threats: ['Imported cheap metal products from China', 'Steel price inflation squeezing margins', 'Competition from semi-urban fabrication workshops', 'Health and safety regulations increasing compliance costs'],
      competitors: { avgDensityPer10km: 2, vulnerability: 'Most lack modern equipment, design capability, and formal business structure.' },
      pricing: { unitName: 'job', minPrice: 500, maxPrice: 25000, avgLocal: 5000 },
      govSchemes: ['PMEGP (Manufacturing)', 'MUDRA Yojana — Tarun', 'PMKVY for skill certification']
    },
    pharmacy: {
      label: 'Medical / Pharmacy',
      avgRevenuePerLakh: 2.5,
      operatingCostRatio: 0.70,
      workingCapitalMonths: 4,
      marketReach: { radiusKm: 8, householdsPerKm: 160, penetrationRate: 0.65 },
      demandElasticity: 'Inelastic — Healthcare is non-negotiable. Medicine demand is consistent.',
      seasonality: 'Monsoon and winter see demand spikes due to seasonal illnesses.',
      supplyChainRisk: 'Low — Pharmaceutical distribution networks are well-established.',
      strengths: ['Essential service with guaranteed daily demand', 'High community trust and repeat customers', 'Margins of 15-30% on medicines', 'Limited competition in rural areas'],
      weaknesses: ['Requires pharmacist license (D.Pharm minimum)', 'Inventory management complexity (expiry tracking)', 'Regulatory compliance (Drug License, GST)', 'Working capital locked in inventory'],
      opportunities: ['Generic medicines offering higher margins', 'Diagnostic services (BP check, sugar test) as add-on', 'Jan Aushadhi franchise for affordable medicines', 'Home delivery services for elderly patients'],
      threats: ['Online pharmacies (PharmEasy, 1mg) offering discounts', 'Regulatory inspections and compliance penalties', 'Counterfeit medicine liability risks', 'New pharmacy chains entering rural areas'],
      competitors: { avgDensityPer10km: 2, vulnerability: 'Most lack diagnostic services, home delivery, and digital inventory management.' },
      pricing: { unitName: 'prescription average', minPrice: 100, maxPrice: 800, avgLocal: 350 },
      govSchemes: ['Jan Aushadhi Franchise', 'MUDRA Yojana', 'Stand-Up India']
    },
    stationery: {
      label: 'Stationery / Xerox / Printing',
      avgRevenuePerLakh: 2.0,
      operatingCostRatio: 0.55,
      workingCapitalMonths: 2,
      marketReach: { radiusKm: 5, householdsPerKm: 180, penetrationRate: 0.40 },
      demandElasticity: 'Moderate — School season drives bulk demand. Government document work is consistent.',
      seasonality: 'School opening (Jun-Jul), exam season (Feb-Apr) are peaks.',
      supplyChainRisk: 'Low — Wholesale stationery suppliers deliver to most blocks.',
      strengths: ['Multiple revenue streams (stationery + xerox + printing + lamination)', 'Low investment, quick setup', 'Consistent demand from students and government offices', 'Cash-based business with immediate revenue'],
      weaknesses: ['Low individual transaction value', 'Seasonal dependency on academic calendar', 'Equipment maintenance (printer, copier) costs', 'Limited margins on basic stationery items'],
      opportunities: ['Digital services (photo printing, banner design, online form filling)', 'CSC (Common Service Centre) franchise for government services', 'Bulk supply contracts with schools and offices', 'Adding mobile accessories as high-margin add-on'],
      threats: ['Digital documentation reducing paper/printing demand', 'Online shopping for stationery items', 'Competition from established chains (Kokuyo Camlin stores)', 'Technology obsolescence for printing equipment'],
      competitors: { avgDensityPer10km: 3, vulnerability: 'Most offer only basic services without CSC integration or digital services.' },
      pricing: { unitName: 'per page', minPrice: 2, maxPrice: 10, avgLocal: 3 },
      govSchemes: ['CSC (Common Service Centre)', 'MUDRA Yojana — Shishu', 'PMEGP']
    },
    tailoring: {
      label: 'Tailoring / Boutique',
      avgRevenuePerLakh: 1.8,
      operatingCostRatio: 0.40,
      workingCapitalMonths: 3,
      marketReach: { radiusKm: 8, householdsPerKm: 150, penetrationRate: 0.30 },
      demandElasticity: 'Moderate — Custom stitching has steady demand. Designer wear is elastic.',
      seasonality: 'Wedding season (Oct-Feb) and festivals drive peak demand.',
      supplyChainRisk: 'Low — Fabric sourcing from local markets. Skill is the primary input.',
      strengths: ['High margins on custom work (50-70%)', 'Low fixed costs — primarily skill-based', 'Recurring demand for alterations and repairs', 'Personal relationships drive referrals'],
      weaknesses: ['Seasonal demand concentration', 'Physical strain from long working hours', 'Scalability limited by individual capacity', 'Fashion trend dependency'],
      opportunities: ['Designer boutique positioning for wedding market', 'Online orders via social media (Instagram, WhatsApp)', 'Uniform stitching contracts with schools and companies', 'Training programs generating additional income'],
      threats: ['Readymade garment industry growth', 'Fast fashion availability at low prices', 'Skilled tailor shortage in workforce', 'Machine embroidery replacing hand work'],
      competitors: { avgDensityPer10km: 5, vulnerability: 'Most offer only basic stitching without design innovation or online presence.' },
      pricing: { unitName: 'piece', minPrice: 150, maxPrice: 3000, avgLocal: 500 },
      govSchemes: ['PMKVY (Tailoring Skill)', 'MUDRA Yojana — Shishu/Kishore', 'Stand-Up India (Women)']
    },
    electronics: {
      label: 'Electronics Repair',
      avgRevenuePerLakh: 2.0,
      operatingCostRatio: 0.45,
      workingCapitalMonths: 2,
      marketReach: { radiusKm: 10, householdsPerKm: 130, penetrationRate: 0.35 },
      demandElasticity: 'Inelastic — Mobile and electronics repair is a necessity.',
      seasonality: 'Consistent year-round demand. Slight uptick post-monsoon (water damage repairs).',
      supplyChainRisk: 'Medium — Genuine spare parts sourcing can be challenging in rural areas.',
      strengths: ['Growing electronics penetration creating repair demand', 'High margins on repair services (60-80%)', 'Low fixed investment — primarily skill and tools', 'Multiple device categories (mobile, TV, appliance)'],
      weaknesses: ['Rapid technology changes requiring constant upskilling', 'Counterfeit spare parts risk damaging reputation', 'Customer expectation of quick turnaround', 'Warranty void concerns limiting brand phone repairs'],
      opportunities: ['Authorized service centre partnerships', 'Refurbished phone sales as additional revenue', 'Solar panel installation and maintenance', 'CCTV and networking services for businesses'],
      threats: ['Disposable electronics culture (buy new vs repair)', 'Warranty and authorized service networks expanding', 'Skill obsolescence with technology changes', 'Chinese spare parts quality inconsistency'],
      competitors: { avgDensityPer10km: 3, vulnerability: 'Most lack formal training, genuine parts sourcing, and service guarantees.' },
      pricing: { unitName: 'repair job', minPrice: 200, maxPrice: 3000, avgLocal: 500 },
      govSchemes: ['PMKVY (Electronics Skill)', 'MUDRA Yojana', 'CSC Digital Services']
    },
    tea_stall: {
      label: 'Tea Stall / Small Eatery',
      avgRevenuePerLakh: 2.5,
      operatingCostRatio: 0.50,
      workingCapitalMonths: 1,
      marketReach: { radiusKm: 3, householdsPerKm: 250, penetrationRate: 0.70 },
      demandElasticity: 'Inelastic — Tea and snacks are daily habits with extremely high frequency.',
      seasonality: 'Year-round demand. Winter is peak. Monsoon sees slight dip in outdoor stalls.',
      supplyChainRisk: 'Very Low — Ingredients (tea, milk, sugar, snacks) are universally available.',
      strengths: ['Lowest possible entry barrier', 'Daily cash flow from high-frequency purchases', 'Tea is culturally embedded — guaranteed demand', 'Location flexibility (roadside, market, bus stop)'],
      weaknesses: ['Very low per-transaction value (₹10-30)', 'Hygiene perception challenges', 'Weather dependency for outdoor setups', 'Physical exhaustion from long hours'],
      opportunities: ['Specialty teas (kulhad chai, green tea, masala variations)', 'Branded chain model (Chai Point, Chai Sutta Bar)', 'Adding snacks, breakfast items for higher tickets', 'Catering services for local events'],
      threats: ['Multiple existing tea stalls creating price wars', 'Health and hygiene regulations for food businesses', 'Rising milk and gas prices impacting margins', 'Competition from packaged tea/coffee vending machines'],
      competitors: { avgDensityPer10km: 10, vulnerability: 'Most lack seating, hygiene standards, and variety beyond basic chai.' },
      pricing: { unitName: 'cup', minPrice: 10, maxPrice: 40, avgLocal: 15 },
      govSchemes: ['PM SVANidhi', 'MUDRA Yojana — Shishu', 'PMFME (Food Processing)']
    },
    construction: {
      label: 'Construction Materials',
      avgRevenuePerLakh: 1.5,
      operatingCostRatio: 0.75,
      workingCapitalMonths: 4,
      marketReach: { radiusKm: 15, householdsPerKm: 100, penetrationRate: 0.20 },
      demandElasticity: 'Moderate — Housing demand drives construction. Government projects are consistent.',
      seasonality: 'Construction season (Oct-May) is peak. Monsoon is lean period.',
      supplyChainRisk: 'Medium — Cement, steel, and sand prices are volatile. Transport costs are significant.',
      strengths: ['Essential material for growing rural housing demand', 'Government housing schemes (PMAY) driving bulk demand', 'High-value transactions per customer', 'Credit-based business builds strong dealer relationships'],
      weaknesses: ['High inventory holding costs', 'Price volatility of raw materials (cement, steel, sand)', 'Heavy capital requirement for initial stock', 'Transport logistics challenges in remote areas'],
      opportunities: ['Government infrastructure projects (roads, bridges, housing)', 'PMAY-Gramin creating massive rural housing demand', 'Ready-mix concrete for rural construction', 'Solar panel and water tank retail as add-ons'],
      threats: ['Large dealers with bulk purchasing power', 'Sand mining regulations affecting availability', 'Price wars with established dealers', 'Bad debt from contractor credit defaults'],
      competitors: { avgDensityPer10km: 2, vulnerability: 'Most lack delivery services, product range, and technical advisory capability.' },
      pricing: { unitName: 'bag (cement)', minPrice: 350, maxPrice: 450, avgLocal: 390 },
      govSchemes: ['PMAY-Gramin', 'MUDRA Yojana — Tarun', 'PMEGP']
    }
  };

  // ══════════════════════════════════════════════════════════
  //  SCHEME DEFINITIONS (from problem statement)
  // ══════════════════════════════════════════════════════════
  const SCHEMES = {
    micro: {
      name: 'Micro Finance Scheme',
      maxProjectCost: 140000,
      maxLoan: 125000,
      interestRate: 6.5,
      tenureYears: 3,
      moratoriumMonths: 3,
      description: 'For small units with a project cost up to ₹1.40 Lakh. The funding agency provides up to 90% (max ₹1.25 Lakh) at 6.5% p.a., repayable over 3 years including a 3-month moratorium.'
    },
    term: {
      name: 'Term Loan Scheme',
      minProjectCost: 140001,
      maxProjectCost: 5000000,
      maxLoan: 4500000,
      interestRate: 8.0,
      tenureYears: 7,
      moratoriumMonths: 6,
      description: 'For projects costing ₹1.40 Lakh to ₹50.00 Lakh. The agency provides up to 90% (max ₹45 Lakh) at 8% p.a., repayable over 7 years including a 6-month moratorium.'
    }
  };

  // ══════════════════════════════════════════════════════════
  //  UTILITY FUNCTIONS
  // ══════════════════════════════════════════════════════════
  function formatCurrency(val) {
    if (window.formatINR) return window.formatINR(val);
    return '₹' + Math.round(val).toLocaleString('en-IN');
  }

  function calcEMI(principal, annualRate, months) {
    const r = annualRate / 12 / 100;
    if (r === 0) return principal / months;
    return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
  }

  function generateRepaymentSchedule(loanAmount, annualRate, tenureYears, moratoriumMonths) {
    const schedule = [];
    const totalMonths = tenureYears * 12;
    const repaymentMonths = totalMonths - moratoriumMonths;
    const emi = calcEMI(loanAmount, annualRate, repaymentMonths);
    const r = annualRate / 12 / 100;
    
    let balance = loanAmount;
    let quarterlyPrincipal = 0;
    let quarterlyInterest = 0;
    let quarterNum = 1;
    
    for (let month = 1; month <= totalMonths; month++) {
      if (month <= moratoriumMonths) {
        // During moratorium — interest accrues but no payment
        const interest = balance * r;
        quarterlyInterest += interest;
      } else {
        // Active repayment
        const interest = balance * r;
        const principal = emi - interest;
        balance -= principal;
        quarterlyPrincipal += principal;
        quarterlyInterest += interest;
      }
      
      if (month % 3 === 0) {
        schedule.push({
          quarter: quarterNum,
          isMoratorium: month <= moratoriumMonths,
          principal: quarterlyPrincipal,
          interest: quarterlyInterest,
          payment: month <= moratoriumMonths ? 0 : emi * 3,
          balance: Math.max(0, balance)
        });
        quarterlyPrincipal = 0;
        quarterlyInterest = 0;
        quarterNum++;
      }
    }
    
    return { schedule, emi, repaymentMonths };
  }

  // ══════════════════════════════════════════════════════════
  //  FEASIBILITY SCORING ENGINE
  // ══════════════════════════════════════════════════════════
  function calculateFeasibilityScore(data, industry) {
    let score = 50;
    
    // Factor 1: DSCR Quality (max +20)
    if (data.dscr >= 2.0) score += 20;
    else if (data.dscr >= 1.5) score += 15;
    else if (data.dscr >= 1.25) score += 10;
    else if (data.dscr >= 1.0) score += 5;
    else score -= 15;
    
    // Factor 2: Market Competition (max +15)
    const competitorDensity = industry.competitors.avgDensityPer10km;
    if (competitorDensity <= 2) score += 15;
    else if (competitorDensity <= 4) score += 10;
    else if (competitorDensity <= 6) score += 5;
    else score -= 5;
    
    // Factor 3: Operating Cost Efficiency (max +10)
    if (industry.operatingCostRatio <= 0.45) score += 10;
    else if (industry.operatingCostRatio <= 0.55) score += 7;
    else if (industry.operatingCostRatio <= 0.65) score += 3;
    
    // Factor 4: Demand Elasticity (max +10)
    if (industry.demandElasticity.startsWith('Inelastic')) score += 10;
    else if (industry.demandElasticity.startsWith('Moderate')) score += 5;
    
    // Factor 5: Revenue Potential vs Loan (max +5)
    if (data.projectedRevenue > data.loanAmount * 0.5) score += 5;
    
    return Math.max(0, Math.min(100, score));
  }

  // ══════════════════════════════════════════════════════════
  //  LOAD SAVED REPORTS
  // ══════════════════════════════════════════════════════════
  async function loadSavedReports() {
    const historyContainer = document.getElementById('advisorHistory');
    if (!historyContainer || !currentUser) return;
    
    const { data, error } = await window.supabaseClient
      .from('business_plans')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error || !data || data.length === 0) return;
    
    historyContainer.innerHTML = `
      <h3 style="color:var(--accent-sky); font-family:var(--font-serif); font-size:20px; font-weight:normal; margin-bottom:15px;">Previous Reports</h3>
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:15px;">
        ${data.map(r => `
          <div class="app-card" style="cursor:default;">
            <span class="mono" style="font-size:9px; color:var(--accent-sky);">${r.industry?.toUpperCase() || 'N/A'}</span>
            <h4 style="margin:5px 0; font-size:14px;">${r.business_name || 'Untitled'}</h4>
            <span style="font-size:12px; opacity:0.5;">${new Date(r.created_at).toLocaleDateString()}</span>
            <div style="margin-top:8px; font-size:13px;">
              Score: <strong style="color:${(r.feasibility_score || 0) >= 70 ? '#4CAF50' : '#FFC107'}">${r.feasibility_score || 'N/A'}/100</strong>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ══════════════════════════════════════════════════════════
  //  MAIN FORM HANDLER
  // ══════════════════════════════════════════════════════════
  if (advisorForm) {
    advisorForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Auth check
      if (!currentUser) {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (session && session.user) {
          currentUser = session.user;
        } else {
          if (window.showToast) window.showToast('Please log in first.', 'error');
          return;
        }
      }

      const btn = advisorForm.querySelector('button[type="submit"]');
      if (window.setLoading) window.setLoading(btn, true);

      // ── GATHER INPUTS ──
      const location = advisorForm.querySelector('[name="biz-location"]').value.trim();
      const marginCapital = parseFloat(advisorForm.querySelector('[name="biz-margin"]').value) || 0;
      const category = advisorForm.querySelector('[name="biz-category"]').value;
      
      const industry = INDUSTRY_DATA[category];
      if (!industry) {
        if (window.showToast) window.showToast('Invalid business category.', 'error');
        if (window.setLoading) window.setLoading(btn, false);
        return;
      }

      // ══════════════════════════════════════════════════════
      //  MODULE 2: SMART FINANCIAL CALCULATOR & SCHEME ROUTER
      // ══════════════════════════════════════════════════════
      
      // Step 1: Financial Structuring
      const projectCost = marginCapital / 0.10;  // Margin is 10% of project cost
      const loanAmount = projectCost * 0.90;     // 90% as concessional loan
      
      // Step 2: Auto Scheme Selection
      let selectedScheme;
      if (projectCost <= SCHEMES.micro.maxProjectCost) {
        selectedScheme = SCHEMES.micro;
      } else if (projectCost <= SCHEMES.term.maxProjectCost) {
        selectedScheme = SCHEMES.term;
      } else {
        selectedScheme = {
          name: 'Exceeds Scheme Limits',
          interestRate: 10,
          tenureYears: 7,
          moratoriumMonths: 6,
          description: `Project cost of ${formatCurrency(projectCost)} exceeds the maximum ₹50 Lakh limit. Consider splitting into phases or seeking alternative funding.`
        };
      }
      
      // Cap loan to scheme max
      const effectiveLoan = Math.min(loanAmount, selectedScheme.maxLoan || loanAmount);
      
      // Step 3: EMI & Repayment Schedule
      const repayment = generateRepaymentSchedule(
        effectiveLoan,
        selectedScheme.interestRate,
        selectedScheme.tenureYears,
        selectedScheme.moratoriumMonths
      );
      
      // ══════════════════════════════════════════════════════
      //  MODULE 1: HYPER-LOCAL BUSINESS FEASIBILITY REPORT
      // ══════════════════════════════════════════════════════
      
      // Market Reach Calculations
      const consumerBase = industry.marketReach.householdsPerKm * industry.marketReach.radiusKm * industry.marketReach.penetrationRate;
      const dailyFootfall = Math.round(consumerBase * 0.03); // ~3% daily conversion
      
      // Revenue Projections
      const projectedAnnualRevenue = (projectCost / 100000) * industry.avgRevenuePerLakh * 100000;
      const projectedMonthlyCosts = projectedAnnualRevenue * industry.operatingCostRatio / 12;
      const projectedAnnualCosts = projectedMonthlyCosts * 12;
      const noi = projectedAnnualRevenue - projectedAnnualCosts;
      const annualDebtService = repayment.emi * 12;
      const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;
      const workingCapital = projectedMonthlyCosts * industry.workingCapitalMonths;
      
      // Feasibility Score
      const feasibilityData = {
        dscr,
        projectedRevenue: projectedAnnualRevenue,
        loanAmount: effectiveLoan,
        noi
      };
      const score = calculateFeasibilityScore(feasibilityData, industry);
      
      // Stress Testing (Doomsday Scenario)
      const stressRevenue = projectedAnnualRevenue * 0.75; // 25% revenue drop
      const stressCosts = projectedAnnualCosts * 1.20;     // 20% cost increase
      const stressNoi = stressRevenue - stressCosts;
      const stressDscr = annualDebtService > 0 ? stressNoi / annualDebtService : 0;
      
      // Breakeven Analysis
      const monthlyEMI = repayment.emi;
      const monthlyFixedCosts = projectedMonthlyCosts * 0.4; // 40% of costs are fixed
      const monthlyVariableCostRatio = industry.operatingCostRatio * 0.6;
      const breakEvenRevenue = (monthlyFixedCosts + monthlyEMI) / (1 - monthlyVariableCostRatio);
      
      // ── SAVE TO SUPABASE ──
      try {
        await window.supabaseClient.from('business_plans').insert({
          user_id: currentUser.id,
          business_name: `${industry.label} — ${location}`,
          industry: category,
          projected_revenue: projectedAnnualRevenue,
          operating_costs: projectedAnnualCosts,
          loan_amount: effectiveLoan,
          interest_rate: selectedScheme.interestRate,
          loan_tenure_years: selectedScheme.tenureYears,
          emi: monthlyEMI,
          dscr: dscr,
          working_capital_required: workingCapital,
          feasibility_score: score
        });
      } catch(err) { /* silent fail on save */ }

      if (window.setLoading) window.setLoading(btn, false);
      if (window.showToast) window.showToast('Feasibility Report Generated!', 'success');

      // ══════════════════════════════════════════════════════
      //  RENDER THE COMPLETE REPORT
      // ══════════════════════════════════════════════════════
      const scoreColor = score >= 70 ? '#4CAF50' : score >= 40 ? '#FFC107' : '#F44336';
      const scoreGlow = score >= 70 ? 'rgba(76,175,80,0.2)' : score >= 40 ? 'rgba(255,193,7,0.2)' : 'rgba(244,67,54,0.2)';
      
      // Build repayment schedule rows (show first 8 quarters + last)
      const scheduleRows = repayment.schedule.slice(0, 8).map(q => `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
          <td style="padding:8px 10px;" class="mono">Q${q.quarter}</td>
          <td style="padding:8px 10px;">${q.isMoratorium ? '<span style="color:#FFC107;">Moratorium</span>' : formatCurrency(q.payment)}</td>
          <td style="padding:8px 10px;">${formatCurrency(q.principal)}</td>
          <td style="padding:8px 10px;">${formatCurrency(q.interest)}</td>
          <td style="padding:8px 10px;">${formatCurrency(q.balance)}</td>
        </tr>
      `).join('');

      advisorDisplay.innerHTML = `
        <div id="reportContainerToDownload" style="animation: fadeInApp 0.6s ease; display:flex; flex-direction:column; gap:20px; background:var(--bg-main); padding-bottom: 20px;">
          
          <!-- ═══ HEADER: Executive Summary ═══ -->
          <div style="background: linear-gradient(145deg, rgba(255,255,255,0.04), transparent); border: 1px solid rgba(255,255,255,0.06); padding: 35px; border-radius: 14px; position:relative; overflow:hidden;">
            <div style="position:absolute; top:-30px; right:-30px; width:120px; height:120px; background:var(--accent-muted); filter:blur(70px); opacity:0.25; border-radius:50%;"></div>
            <div style="position:absolute; bottom:-20px; left:-20px; width:80px; height:80px; background:var(--accent-sky); filter:blur(50px); opacity:0.15; border-radius:50%;"></div>
            
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:25px;">
              <div>
                <h3 style="margin:0 0 5px 0; color:var(--text-main); font-family:var(--font-serif); font-size:30px; font-weight:normal;">${industry.label}</h3>
                <p class="mono" style="opacity:0.4; margin:0; font-size:11px; letter-spacing:2px;">FEASIBILITY REPORT / ${location.toUpperCase()}</p>
              </div>
              <div style="text-align:right;">
                <strong style="font-family:var(--font-serif); font-size:48px; color:${scoreColor}; text-shadow: 0 0 25px ${scoreGlow}; line-height:1;">${score}</strong>
                <span class="mono" style="display:block; font-size:9px; opacity:0.5; margin-top:4px;">/100 FEASIBILITY</span>
              </div>
            </div>
            
            <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:12px;">
              <div style="background:rgba(0,0,0,0.25); padding:14px; border-radius:8px; border:1px solid rgba(255,255,255,0.03);">
                <span class="mono" style="font-size:8px; color:var(--accent-sky); display:block; margin-bottom:4px;">PROJECT COST</span>
                <strong style="font-size:15px;">${formatCurrency(projectCost)}</strong>
              </div>
              <div style="background:rgba(0,0,0,0.25); padding:14px; border-radius:8px; border:1px solid rgba(255,255,255,0.03);">
                <span class="mono" style="font-size:8px; color:var(--accent-sky); display:block; margin-bottom:4px;">YOUR MARGIN (10%)</span>
                <strong style="font-size:15px;">${formatCurrency(marginCapital)}</strong>
              </div>
              <div style="background:rgba(0,0,0,0.25); padding:14px; border-radius:8px; border:1px solid rgba(255,255,255,0.03);">
                <span class="mono" style="font-size:8px; color:var(--accent-sky); display:block; margin-bottom:4px;">LOAN (90%)</span>
                <strong style="font-size:15px;">${formatCurrency(effectiveLoan)}</strong>
              </div>
              <div style="background:rgba(0,0,0,0.25); padding:14px; border-radius:8px; border:1px solid rgba(255,255,255,0.03);">
                <span class="mono" style="font-size:8px; color:var(--accent-sky); display:block; margin-bottom:4px;">MONTHLY EMI</span>
                <strong style="font-size:15px;">${formatCurrency(monthlyEMI)}</strong>
              </div>
              <div style="background:rgba(0,0,0,0.25); padding:14px; border-radius:8px; border:1px solid rgba(255,255,255,0.03);">
                <span class="mono" style="font-size:8px; color:var(--accent-sky); display:block; margin-bottom:4px;">DSCR</span>
                <strong style="font-size:15px; color:${dscr >= 1.25 ? '#4CAF50' : dscr >= 1.0 ? '#FFC107' : '#F44336'};">${dscr.toFixed(2)}x</strong>
              </div>
            </div>
          </div>

          <!-- ═══ MODULE 2: SCHEME AUTO-SELECTION ═══ -->
          <div style="background: linear-gradient(135deg, rgba(111,47,224,0.06), transparent); border: 1px solid rgba(135,206,235,0.05); padding: 25px; border-radius: 14px;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:15px;">
              <span style="background:var(--accent-muted); color:white; padding:4px 12px; border-radius:4px; font-size:11px;" class="mono">AUTO-SELECTED</span>
              <h4 style="margin:0; color:var(--text-main); font-family:var(--font-serif); font-size:22px; font-weight:normal;">${selectedScheme.name}</h4>
            </div>
            <p style="font-size:13px; color:rgba(255,255,255,0.65); line-height:1.7; margin-bottom:20px;">${selectedScheme.description}</p>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px;">
              <div style="background:rgba(0,0,0,0.03); padding:12px; border-radius:6px; text-align:center;">
                <span class="mono" style="font-size:8px; color:var(--accent-muted); display:block; margin-bottom:4px;">INTEREST RATE</span>
                <strong style="font-size:18px;">${selectedScheme.interestRate}%</strong>
                <span style="display:block; font-size:10px; opacity:0.4;">per annum</span>
              </div>
              <div style="background:rgba(0,0,0,0.03); padding:12px; border-radius:6px; text-align:center;">
                <span class="mono" style="font-size:8px; color:var(--accent-muted); display:block; margin-bottom:4px;">TENURE</span>
                <strong style="font-size:18px;">${selectedScheme.tenureYears} Yrs</strong>
                <span style="display:block; font-size:10px; opacity:0.4;">${selectedScheme.tenureYears * 12} months</span>
              </div>
              <div style="background:rgba(0,0,0,0.03); padding:12px; border-radius:6px; text-align:center;">
                <span class="mono" style="font-size:8px; color:var(--accent-muted); display:block; margin-bottom:4px;">MORATORIUM</span>
                <strong style="font-size:18px;">${selectedScheme.moratoriumMonths} Mo</strong>
                <span style="display:block; font-size:10px; opacity:0.4;">no payment</span>
              </div>
              <div style="background:rgba(0,0,0,0.03); padding:12px; border-radius:6px; text-align:center;">
                <span class="mono" style="font-size:8px; color:var(--accent-muted); display:block; margin-bottom:4px;">TOTAL INTEREST</span>
                <strong style="font-size:18px;">${formatCurrency(repayment.emi * repayment.repaymentMonths - effectiveLoan)}</strong>
                <span style="display:block; font-size:10px; opacity:0.4;">over tenure</span>
              </div>
            </div>
          </div>

          <!-- ═══ MODULE 1: MARKET REACH & OPPORTUNITY ═══ -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 25px; border-radius: 14px;">
              <h4 style="margin:0 0 15px 0; color:var(--text-main); font-family:var(--font-serif); font-size:20px; font-weight:normal;">Market Reach Analysis</h4>
              <p style="font-size:13px; color:rgba(255,255,255,0.65); line-height:1.7; margin-bottom:15px;">
                Within a <strong style="color:var(--text-main);">${industry.marketReach.radiusKm} km radius</strong> of ${location}, the estimated addressable consumer base is <strong style="color:var(--text-main);">${Math.round(consumerBase).toLocaleString()} households</strong> with an estimated daily footfall potential of <strong style="color:var(--text-main);">${dailyFootfall} customers</strong>.
              </p>
              <div style="background:rgba(0,0,0,0.03); padding:12px; border-radius:6px; margin-bottom:10px;">
                <span class="mono" style="font-size:9px; color:var(--accent-sky);">DEMAND ELASTICITY</span>
                <p style="margin:5px 0 0 0; font-size:12px; opacity:0.7;">${industry.demandElasticity}</p>
              </div>
              <div style="background:rgba(0,0,0,0.03); padding:12px; border-radius:6px;">
                <span class="mono" style="font-size:9px; color:var(--accent-sky);">SEASONALITY PATTERN</span>
                <p style="margin:5px 0 0 0; font-size:12px; opacity:0.7;">${industry.seasonality}</p>
              </div>
            </div>

            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 25px; border-radius: 14px;">
              <h4 style="margin:0 0 15px 0; color:var(--text-main); font-family:var(--font-serif); font-size:20px; font-weight:normal;">Opportunity & Competitor Map</h4>
              <div style="background:rgba(0,0,0,0.03); padding:12px; border-radius:6px; margin-bottom:10px;">
                <span class="mono" style="font-size:9px; color:var(--accent-sky);">COMPETITOR DENSITY</span>
                <p style="margin:5px 0 0 0; font-size:12px; opacity:0.7;">~${industry.competitors.avgDensityPer10km} similar businesses per 10km radius.</p>
              </div>
              <div style="background:rgba(0,0,0,0.03); padding:12px; border-radius:6px; margin-bottom:10px;">
                <span class="mono" style="font-size:9px; color:var(--accent-sky);">COMPETITOR VULNERABILITY</span>
                <p style="margin:5px 0 0 0; font-size:12px; opacity:0.7;">${industry.competitors.vulnerability}</p>
              </div>
              <div style="background:rgba(0,0,0,0.03); padding:12px; border-radius:6px;">
                <span class="mono" style="font-size:9px; color:var(--accent-sky);">PRODUCT MARKET VALUE</span>
                <p style="margin:5px 0 0 0; font-size:12px; opacity:0.7;">Average local price: <strong style="color:var(--text-main);">${formatCurrency(industry.pricing.avgLocal)}</strong> per ${industry.pricing.unitName}. Range: ${formatCurrency(industry.pricing.minPrice)} — ${formatCurrency(industry.pricing.maxPrice)}.</p>
              </div>
            </div>
          </div>

          <!-- ═══ SWOT ANALYSIS ═══ -->
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 25px; border-radius: 14px;">
            <h4 style="margin:0 0 20px 0; color:var(--text-main); font-family:var(--font-serif); font-size:20px; font-weight:normal;">SWOT Analysis — ${industry.label}</h4>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:15px;">
              <div style="background:rgba(76,175,80,0.04); border:1px solid rgba(76,175,80,0.12); padding:18px; border-radius:10px;">
                <span class="mono" style="color:#4CAF50; font-size:10px; display:block; margin-bottom:10px; letter-spacing:1.5px;">STRENGTHS</span>
                <ul style="margin:0; padding-left:16px; font-size:12px; color:rgba(255,255,255,0.75); line-height:1.8;">
                  ${industry.strengths.map(s => `<li>${s}</li>`).join('')}
                </ul>
              </div>
              <div style="background:rgba(244,67,54,0.04); border:1px solid rgba(244,67,54,0.12); padding:18px; border-radius:10px;">
                <span class="mono" style="color:#F44336; font-size:10px; display:block; margin-bottom:10px; letter-spacing:1.5px;">WEAKNESSES</span>
                <ul style="margin:0; padding-left:16px; font-size:12px; color:rgba(255,255,255,0.75); line-height:1.8;">
                  ${industry.weaknesses.map(w => `<li>${w}</li>`).join('')}
                </ul>
              </div>
              <div style="background:rgba(33,150,243,0.04); border:1px solid rgba(33,150,243,0.12); padding:18px; border-radius:10px;">
                <span class="mono" style="color:#2196F3; font-size:10px; display:block; margin-bottom:10px; letter-spacing:1.5px;">OPPORTUNITIES</span>
                <ul style="margin:0; padding-left:16px; font-size:12px; color:rgba(255,255,255,0.75); line-height:1.8;">
                  ${industry.opportunities.map(o => `<li>${o}</li>`).join('')}
                </ul>
              </div>
              <div style="background:rgba(255,152,0,0.04); border:1px solid rgba(255,152,0,0.12); padding:18px; border-radius:10px;">
                <span class="mono" style="color:#FF9800; font-size:10px; display:block; margin-bottom:10px; letter-spacing:1.5px;">THREATS</span>
                <ul style="margin:0; padding-left:16px; font-size:12px; color:rgba(255,255,255,0.75); line-height:1.8;">
                  ${industry.threats.map(t => `<li>${t}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>

          <!-- ═══ STRESS TEST + BREAKEVEN ═══ -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 25px; border-radius: 14px;">
              <h4 style="margin:0 0 15px 0; color:var(--text-main); font-family:var(--font-serif); font-size:20px; font-weight:normal;">Stress Test — Doomsday</h4>
              <p style="font-size:12px; color:rgba(255,255,255,0.5); margin-bottom:15px;">Scenario: <strong style="color:#F44336;">-25% Revenue, +20% Costs</strong></p>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:10px;">
                <div style="background:rgba(0,0,0,0.05); border-left:2px solid ${stressNoi > 0 ? '#4CAF50' : '#F44336'}; padding:12px; border-radius:0 6px 6px 0;">
                  <span class="mono" style="font-size:9px; color:rgba(255,255,255,0.4);">SHOCK NOI</span>
                  <strong style="display:block; font-size:14px; color:${stressNoi > 0 ? 'var(--text-main)' : '#F44336'}; margin-top:4px;">${formatCurrency(stressNoi)}</strong>
                </div>
                <div style="background:rgba(0,0,0,0.05); border-left:2px solid ${stressDscr >= 1.0 ? '#4CAF50' : '#F44336'}; padding:12px; border-radius:0 6px 6px 0;">
                  <span class="mono" style="font-size:9px; color:rgba(255,255,255,0.4);">SHOCK DSCR</span>
                  <strong style="display:block; font-size:14px; color:${stressDscr >= 1.0 ? '#4CAF50' : '#F44336'}; margin-top:4px;">${stressDscr.toFixed(2)}x ${stressDscr >= 1.0 ? 'SURVIVES' : 'DEFAULTS'}</strong>
                </div>
              </div>
            </div>

            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 25px; border-radius: 14px;">
              <h4 style="margin:0 0 15px 0; color:var(--text-main); font-family:var(--font-serif); font-size:20px; font-weight:normal;">Revenue Projections</h4>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:10px;">
                <div style="background:rgba(0,0,0,0.03); padding:12px; border-radius:6px;">
                  <span class="mono" style="font-size:9px; color:var(--accent-sky);">PROJECTED ANNUAL REVENUE</span>
                  <strong style="display:block; font-size:14px; margin-top:4px;">${formatCurrency(projectedAnnualRevenue)}</strong>
                </div>
                <div style="background:rgba(0,0,0,0.03); padding:12px; border-radius:6px;">
                  <span class="mono" style="font-size:9px; color:var(--accent-sky);">ANNUAL OPERATING COSTS</span>
                  <strong style="display:block; font-size:14px; margin-top:4px;">${formatCurrency(projectedAnnualCosts)}</strong>
                </div>
                <div style="background:rgba(0,0,0,0.03); padding:12px; border-radius:6px;">
                  <span class="mono" style="font-size:9px; color:var(--accent-sky);">NET OPERATING INCOME</span>
                  <strong style="display:block; font-size:14px; margin-top:4px; color:${noi > 0 ? '#4CAF50' : '#F44336'};">${formatCurrency(noi)}</strong>
                </div>
                <div style="background:rgba(0,0,0,0.03); padding:12px; border-radius:6px;">
                  <span class="mono" style="font-size:9px; color:var(--accent-sky);">WORKING CAPITAL NEEDED</span>
                  <strong style="display:block; font-size:14px; margin-top:4px;">${formatCurrency(workingCapital)}</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- ═══ REPAYMENT SCHEDULE ═══ -->
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 25px; border-radius: 14px;">
            <h4 style="margin:0 0 5px 0; color:var(--text-main); font-family:var(--font-serif); font-size:20px; font-weight:normal;">Quarterly Repayment Schedule</h4>
            <p style="font-size:11px; opacity:0.4; margin:0 0 15px 0;" class="mono">First ${Math.min(8, repayment.schedule.length)} quarters shown • ${selectedScheme.moratoriumMonths}-month moratorium • ${selectedScheme.interestRate}% p.a.</p>
            <div style="overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead>
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
                    <th style="text-align:left; padding:10px; font-size:10px; opacity:0.5;" class="mono">QTR</th>
                    <th style="text-align:left; padding:10px; font-size:10px; opacity:0.5;" class="mono">PAYMENT</th>
                    <th style="text-align:left; padding:10px; font-size:10px; opacity:0.5;" class="mono">PRINCIPAL</th>
                    <th style="text-align:left; padding:10px; font-size:10px; opacity:0.5;" class="mono">INTEREST</th>
                    <th style="text-align:left; padding:10px; font-size:10px; opacity:0.5;" class="mono">BALANCE</th>
                  </tr>
                </thead>
                <tbody style="color:rgba(255,255,255,0.75);">
                  ${scheduleRows}
                </tbody>
              </table>
            </div>
          </div>

          <!-- ═══ GOVERNMENT SCHEMES ═══ -->
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 25px; border-radius: 14px;">
            <h4 style="margin:0 0 15px 0; color:var(--text-main); font-family:var(--font-serif); font-size:20px; font-weight:normal;">Eligible Government Schemes</h4>
            
            <div style="background:linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,215,0,0.02)); border:1px solid var(--accent-sky); padding:20px; border-radius:12px; margin-bottom:20px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                <div>
                  <div class="mono" style="color:var(--accent-sky); font-size:10px; letter-spacing:1px; margin-bottom:4px;">PRIMARY SCHEME MATCH</div>
                  <strong style="font-size:18px; color:var(--text-main); display:block;">${selectedScheme.name}</strong>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:18px; font-weight:bold; color:var(--accent-sky);">${selectedScheme.interestRate}% <span style="font-size:12px; font-weight:normal; opacity:0.7;">p.a.</span></div>
                </div>
              </div>
              <p style="font-size:13px; line-height:1.6; opacity:0.8; margin:0 0 15px 0;">
                ${selectedScheme.description}
              </p>
              <div style="display:flex; gap:15px; border-top:1px solid rgba(255,215,0,0.2); padding-top:12px;">
                <div style="flex:1;">
                  <div class="mono" style="font-size:9px; opacity:0.6; margin-bottom:3px;">MAX LOAN</div>
                  <div style="font-size:13px; color:var(--text-main);">${selectedScheme.maxLoan ? formatCurrency(selectedScheme.maxLoan) : 'N/A'}</div>
                </div>
                <div style="flex:1;">
                  <div class="mono" style="font-size:9px; opacity:0.6; margin-bottom:3px;">TENURE</div>
                  <div style="font-size:13px; color:var(--text-main);">${selectedScheme.tenureYears} Years</div>
                </div>
                <div style="flex:1;">
                  <div class="mono" style="font-size:9px; opacity:0.6; margin-bottom:3px;">MORATORIUM</div>
                  <div style="font-size:13px; color:var(--text-main);">${selectedScheme.moratoriumMonths} Months</div>
                </div>
              </div>
            </div>

            <h5 style="margin:0 0 12px 0; color:var(--text-main); font-size:14px; font-weight:normal; opacity:0.7;">Supplementary Industry Schemes:</h5>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:12px;">
              ${industry.govSchemes.map(s => `
                <div style="background:rgba(0,0,0,0.03); padding:14px; border-radius:8px; border-left:2px solid rgba(255,255,255,0.2);">
                  <strong style="font-size:13px; color:var(--text-main);">${s}</strong>
                </div>
              `).join('')}
            </div>
            
            <p style="font-size:11px; opacity:0.4; margin:20px 0 0 0;">Supply chain risk assessment: <strong style="color:var(--text-main); opacity:0.7;">${industry.supplyChainRisk}</strong></p>
          </div>

        </div>
        
        <div style="margin-top:25px; display:flex; justify-content:center;">
          <button id="downloadPdfBtn" class="dash-submit" style="display:flex; align-items:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span class="mono" style="font-size:13px; font-weight:600; letter-spacing:1px; margin-top:2px;">DOWNLOAD REPORT AS PDF</span>
          </button>
        </div>
      `;
      
      // Attach PDF Download Logic
      document.getElementById('downloadPdfBtn').addEventListener('click', () => {
        const reportElement = document.getElementById('reportContainerToDownload');
        const opt = {
          margin:       0.5,
          filename:     'arthX_Feasibility_Report.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#1f2833' },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(reportElement).save();
      });

      // Reload saved reports
      loadSavedReports();
      advisorForm.reset();
    });
  }
})();
