import type { EligibilityRulesJson } from './schema.ts';

export interface SeedScheme {
  slug: string;
  name: string;
  shortName: string;
  governmentLevel: 'Central' | 'Karnataka';
  stateName: string;
  category: string;
  targetCategories: string[];
  overview: string;
  objectives: string[];
  benefits: string;
  eligibilitySummary: string;
  eligibilityRules: EligibilityRulesJson;
  requiredDocuments: string[];
  applicationProcedure: string[];
  officialUrl: string;
  lastVerifiedDate: string;
  isPopular: boolean;
}

export interface SeedAgricultureItem {
  slug: string;
  section: 'crop' | 'soil' | 'animal' | 'organic' | 'inorganic' | 'technology';
  title: string;
  subtitle: string;
  summary: string;
  details: Record<string, string>;
  highlights: string[];
}

export const INITIAL_SCHEMES: SeedScheme[] = [
  {
    slug: 'pm-kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    shortName: 'PM-KISAN',
    governmentLevel: 'Central',
    stateName: 'All India',
    category: 'Income Support',
    targetCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)', 'Medium (4-10 ha)'],
    overview:
      'PM-KISAN is a Central Sector scheme by the Ministry of Agriculture & Farmers Welfare that provides supplemental income support to landholding farmer families across India to meet agricultural input and domestic needs.',
    objectives: [
      'Supplement the financial needs of landholding farmers in procuring various agricultural inputs.',
      'Ensure proper crop health and appropriate yields commensurate with anticipated farm income.',
      'Protect small and marginal farmers from falling into informal debt traps for seasonal cultivation expenses.',
    ],
    benefits:
      'Direct income support of ₹6,000 per year per eligible farmer family, transferred directly to Aadhaar-seeded bank accounts in three equal installments of ₹2,000 every four months.',
    eligibilitySummary:
      'Cultivable landholding farmer families across India (subject to standard exclusion criteria such as institutional landholders, serving/retired higher-grade government employees, and income tax payers).',
    eligibilityRules: {
      states: ['All India'],
      farmerCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)', 'Medium (4-10 ha)', 'Large (> 10 ha)'],
      minLandAcres: 0.1,
      notes: [
        'Farmer family must hold cultivable land as per state/UT land records.',
        'Landless agricultural labourers without cultivable land title are generally not eligible under landholding criteria.',
        'Aadhaar e-KYC and Aadhaar-seeded active bank account are mandatory for Direct Benefit Transfer.',
      ],
    },
    requiredDocuments: [
      'Aadhaar Card (mandatory for e-KYC)',
      'Landholding ownership records (RTC / Pahani / Khatauni)',
      'Aadhaar-linked Bank Account Passbook & IFSC details',
      'Active Mobile Number for OTP verification',
    ],
    applicationProcedure: [
      'Visit the official PM-KISAN portal (pmkisan.gov.in) or visit your nearest Common Service Centre (CSC) / State Nodal Officer.',
      'Select "New Farmer Registration" and enter your Aadhaar number, mobile number, and state details.',
      'Fill in landholding survey/khata details and upload supporting land records as requested by state verification rules.',
      'Complete Aadhaar e-KYC online or via biometric CSC authentication and track beneficiary status on the portal.',
    ],
    officialUrl: 'https://pmkisan.gov.in/',
    lastVerifiedDate: '2026-10-15',
    isPopular: true,
  },
  {
    slug: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    shortName: 'PMFBY',
    governmentLevel: 'Central',
    stateName: 'All India',
    category: 'Crop Insurance',
    targetCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)', 'Landless / Tenant'],
    overview:
      'PMFBY provides comprehensive insurance coverage and financial support to farmers against crop loss or damage arising out of unforeseen natural calamities, pests, and diseases from pre-sowing to post-harvest.',
    objectives: [
      'Provide insurance coverage and financial support to farmers in the event of failure of notified crops due to natural calamities, pests, or diseases.',
      'Stabilize the income of farmers to ensure their continuance in farming.',
      'Encourage farmers to adopt innovative and modern agricultural practices.',
    ],
    benefits:
      'Affordable uniform maximum farmer premium rates: 2% of sum insured for Kharif crops, 1.5% for Rabi crops, and 5% for annual commercial/horticultural crops, with remaining actuarial premium subsidized by Central and State Governments.',
    eligibilitySummary:
      'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas during Kharif and Rabi seasons are eligible to enroll on a voluntary basis.',
    eligibilityRules: {
      states: ['All India'],
      farmerCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)', 'Medium (4-10 ha)', 'Large (> 10 ha)', 'Landless / Tenant'],
      notes: [
        'Applies to notified crops in notified districts/taluks announced by the State Government each season.',
        'Both loanee farmers (KCC borrowers) and non-loanee farmers (including tenant/sharecroppers with valid tenancy proof) can enroll.',
        'Enrollment must be completed before the seasonal cut-off date announced by the State Government.',
      ],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Land Record (RTC / Khasra) or valid Tenancy/Sharecropper Agreement',
      'Sowing Declaration / Crop Cultivation Certificate',
      'Bank Account Passbook details',
    ],
    applicationProcedure: [
      'Visit pmfby.gov.in, your nearest CSC, or the bank branch where your crop loan/account is maintained.',
      'Choose "Farmer Corner" and register or log in with your mobile number.',
      'Select the season (Kharif/Rabi), state, district, notified crop, and sown area.',
      'Upload required land/tenancy documents, pay the subsidized farmer premium share, and save the policy receipt.',
    ],
    officialUrl: 'https://pmfby.gov.in/',
    lastVerifiedDate: '2026-10-15',
    isPopular: true,
  },
  {
    slug: 'kcc',
    name: 'Kisan Credit Card (KCC) Scheme',
    shortName: 'KCC',
    governmentLevel: 'Central',
    stateName: 'All India',
    category: 'Agricultural Credit',
    targetCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)', 'Landless / Tenant'],
    overview:
      'The Kisan Credit Card scheme provides farmers with timely and adequate short-term institutional credit for crop cultivation, post-harvest expenses, consumption needs, and working capital for allied activities like dairy and fisheries.',
    objectives: [
      'Meet short-term credit requirements for cultivation of crops and post-harvest marketing expenses.',
      'Provide working capital for maintenance of farm assets and allied agriculture activities (dairy, poultry, fisheries).',
      'Reduce dependence on high-interest informal moneylenders through affordable institutional credit.',
    ],
    benefits:
      'Revolving cash credit facility with flexible withdrawal and repayment, eligible for Government interest subvention and prompt repayment incentive on short-term crop loans up to ₹3 lakh as per prevailing RBI/Government norms.',
    eligibilitySummary:
      'Owner cultivators, tenant farmers, oral lessees, sharecroppers, and Self-Help Groups / Joint Liability Groups of farmers engaged in agriculture or allied activities.',
    eligibilityRules: {
      states: ['All India'],
      farmerCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)', 'Medium (4-10 ha)', 'Large (> 10 ha)', 'Landless / Tenant'],
      notes: [
        'Available to individual farmers, joint borrowers, tenant farmers, sharecroppers, and animal husbandry/fisheries farmers.',
        'Collateral-free KCC loans up to prescribed RBI limits apply as per bank verification.',
        'Sanctioned limit is based on Scale of Finance fixed for the district and crop area.',
      ],
    },
    requiredDocuments: [
      'Filled KCC Application Form',
      'Identity & Address Proof (Aadhaar Card / Voter ID / PAN)',
      'Land ownership records or certified tenancy proof',
      'Passport-size photographs',
    ],
    applicationProcedure: [
      'Visit your nearest Public Sector Bank, Regional Rural Bank (RRB), Cooperative Bank branch, or apply via CSC / PM-KISAN KCC portal.',
      'Submit the KCC application form along with identity proof and land/allied activity records.',
      'The bank verifies land records, crops grown, and existing credit history to sanction the credit limit.',
      'Receive your RuPay KCC card and operate the revolving credit limit for seasonal farming expenses.',
    ],
    officialUrl: 'https://www.myscheme.gov.in/',
    lastVerifiedDate: '2026-10-15',
    isPopular: true,
  },
  {
    slug: 'soil-health-card',
    name: 'Soil Health Card (SHC) Scheme',
    shortName: 'Soil Health Card',
    governmentLevel: 'Central',
    stateName: 'All India',
    category: 'Soil Management',
    targetCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)', 'Medium (4-10 ha)'],
    overview:
      'The Soil Health Card Scheme assesses soil nutrient status across agricultural land and issues farmers a Soil Health Card containing crop-wise recommendations for nutrients and fertilizers.',
    objectives: [
      'Diagnose soil fertility status (macro-nutrients N, P, K, secondary nutrient S, micronutrients Zn, Fe, Cu, Mn, B, and pH/EC/OC).',
      'Promote balanced and judicious use of chemical fertilizers alongside organic manures.',
      'Improve long-term soil health and lower input costs for farmers.',
    ],
    benefits:
      'Free/subsidized scientific soil testing and personalized Soil Health Card with crop-specific fertilizer and soil amendment dosage guidance.',
    eligibilitySummary:
      'All farmers holding agricultural land across India can submit soil samples or participate through State Agriculture Department collection drives.',
    eligibilityRules: {
      states: ['All India'],
      farmerCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)', 'Medium (4-10 ha)', 'Large (> 10 ha)'],
      minLandAcres: 0.1,
      notes: [
        'Available to all cultivators through State Agriculture Universities, Krishi Vigyan Kendras (KVKs), and Soil Testing Laboratories.',
        'Samples are collected from grid/farm plots and tested for 12 key soil parameters.',
      ],
    },
    requiredDocuments: [
      'Aadhaar Card / Farmer ID',
      'Land Survey / Khata Number details',
      'Mobile number for SMS updates and portal download',
    ],
    applicationProcedure: [
      'Contact your local Raitha Samparka Kendra (RSK), Village Agriculture Worker, or nearest Krishi Vigyan Kendra (KVK).',
      'Register your farm plot details for soil sample collection or submit a collected sample following standard depth guidelines.',
      'Once tested at the Soil Testing Lab, download or collect your Soil Health Card via soilhealth.dac.gov.in.',
    ],
    officialUrl: 'https://soilhealth.dac.gov.in/',
    lastVerifiedDate: '2026-10-15',
    isPopular: true,
  },
  {
    slug: 'pm-kusum',
    name: 'Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan (PM-KUSUM)',
    shortName: 'PM-KUSUM',
    governmentLevel: 'Central',
    stateName: 'All India',
    category: 'Solar & Irrigation',
    targetCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)', 'Medium (4-10 ha)'],
    overview:
      'PM-KUSUM promotes clean energy in agriculture by providing financial support for standalone solar-powered irrigation pumps, solarization of existing grid-connected pumps, and decentralized solar power plants on barren/cultivable land.',
    objectives: [
      'Ensure daytime, reliable irrigation power for farmers independent of erratic grid supply or expensive diesel.',
      'De-dieselize the farm sector and reduce irrigation costs.',
      'Enable farmers to earn supplemental income by selling surplus solar power to DISCOMs where applicable.',
    ],
    benefits:
      'Capital subsidy support from Central and State Governments (typically 30% Central + 30% State subsidy for eligible standalone/grid solar pumps, with bank loan options for part of the remaining farmer share, subject to state implementing agency norms).',
    eligibilitySummary:
      'Individual farmers, groups of farmers, FPOs, cooperatives, and Water User Associations with agricultural land and valid water source/irrigation requirement (implemented via State Nodal Agencies).',
    eligibilityRules: {
      states: ['All India'],
      farmerCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)', 'Medium (4-10 ha)', 'Large (> 10 ha)'],
      minLandAcres: 0.25,
      notes: [
        'Component-B supports standalone off-grid solar agriculture pumps (up to 7.5 HP standard support).',
        'Component-C supports solarization of existing grid-connected agricultural pumps.',
        'Farmers must apply ONLY through official State Implementing Agencies listed on pmkusum.mnre.gov.in to avoid fraudulent websites.',
      ],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Agricultural Land Ownership Record (RTC / Patta)',
      'Existing Electricity Connection / Borewell / Water Source Proof',
      'Bank Account Details and Passport Photograph',
    ],
    applicationProcedure: [
      'Visit pmkusum.mnre.gov.in to identify your official State Nodal Agency (such as KREDL/ESCOMs in Karnataka).',
      'Apply online on the authorized State Implementing Agency portal when beneficiary windows open.',
      'Complete technical feasibility verification of the borewell/water source and deposit the farmer contribution share.',
      'Empaneled vendors install and commission the solar pump system after verification.',
    ],
    officialUrl: 'https://pmkusum.mnre.gov.in/',
    lastVerifiedDate: '2026-10-15',
    isPopular: true,
  },
  {
    slug: 'pmksy-per-drop-more-crop',
    name: 'Pradhan Mantri Krishi Sinchayee Yojana — Per Drop More Crop (PMKSY)',
    shortName: 'PMKSY Micro-Irrigation',
    governmentLevel: 'Central',
    stateName: 'All India',
    category: 'Irrigation',
    targetCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)'],
    overview:
      'Per Drop More Crop (PDMC) under PMKSY promotes precision water conservation at the farm level through financial assistance for Drip and Sprinkler micro-irrigation systems.',
    objectives: [
      'Enhance water use efficiency at the farm level through micro-irrigation technologies.',
      'Increase crop productivity and reduce fertilizer leaching and labour costs.',
      'Expand cultivable area under assured protective irrigation.',
    ],
    benefits:
      'Subsidized financial assistance for installing drip or sprinkler systems—higher subsidy percentages are typically earmarked for Small & Marginal farmers compared to other farmers, subject to State Horticulture/Agriculture norms.',
    eligibilitySummary:
      'Farmers with cultivable land and an assured water source (borewell, open well, farm pond, or canal) applying through their State Agriculture or Horticulture portal.',
    eligibilityRules: {
      states: ['All India'],
      farmerCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)', 'Medium (4-10 ha)'],
      minLandAcres: 0.2,
      notes: [
        'Requires an existing water source on the farm plot.',
        'Subsidy ceiling usually applies up to 5 hectares per beneficiary family as per guidelines.',
      ],
    },
    requiredDocuments: [
      'Aadhaar Card & Farmer Registration ID (e.g., FRUITS ID in Karnataka)',
      'Land Record (RTC / Mutation Copy)',
      'Water Source Certificate / Borewell Details',
      'Quotation from registered micro-irrigation vendor & Bank Passbook',
    ],
    applicationProcedure: [
      'Register on your State Micro-Irrigation / Horticulture / Agriculture portal (e.g., K-Kisan / FRUITS in Karnataka).',
      'Submit plot dimensions, crop type, and water source documentation along with a vendor estimate.',
      'After departmental technical inspection and work order approval, install the drip/sprinkler system.',
      'Subsidy is released directly to the farmer or registered vendor post physical verification.',
    ],
    officialUrl: 'https://pmksy.gov.in/',
    lastVerifiedDate: '2026-10-15',
    isPopular: false,
  },
  {
    slug: 'karnataka-krishi-bhagya',
    name: 'Karnataka Krishi Bhagya Scheme (Rainfed Water Conservation)',
    shortName: 'Krishi Bhagya (KA)',
    governmentLevel: 'Karnataka',
    stateName: 'Karnataka',
    category: 'Irrigation & Soil Conservation',
    targetCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)'],
    overview:
      'Krishi Bhagya is a flagship Karnataka State Government agricultural scheme designed to support dryland and rainfed farmers through farm ponds (Krishi Honda), polythene lining, diesel/solar pump sets, and micro-irrigation units.',
    objectives: [
      'Harvest and store rainwater on-farm through Krishi Honda (farm ponds) in rainfed zones.',
      'Provide protective supplemental irrigation during dry spells to save standing crops.',
      'Improve productivity and farm resilience in dryland districts of Karnataka.',
    ],
    benefits:
      'Category-based state subsidy on construction of lined farm ponds, water lifting pump sets, and sprinkler/drip micro-irrigation components as notified by the Karnataka Department of Agriculture.',
    eligibilitySummary:
      'Farmers residing and cultivating rainfed agricultural land in notified districts/taluks of Karnataka with valid FRUITS ID registration.',
    eligibilityRules: {
      states: ['Karnataka'],
      farmerCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)', 'Medium (4-10 ha)'],
      minLandAcres: 0.5,
      notes: [
        'Restricted to Karnataka farmers in notified rainfed taluks.',
        'FRUITS (Farmer Registration and Unified Beneficiary Information System) ID is mandatory in Karnataka.',
        'Verify active seasonal budget allocation and taluk notifications at your local Raitha Samparka Kendra (RSK).',
      ],
    },
    requiredDocuments: [
      'Karnataka FRUITS ID & Aadhaar Card',
      'RTC (Pahani) showing cultivable dryland in Karnataka',
      'Caste Certificate (if applying under SC/ST subsidy slab)',
      'Bank Account Passbook linked to Aadhaar',
    ],
    applicationProcedure: [
      'Obtain your FRUITS ID if not already registered through the local Raitha Samparka Kendra (RSK).',
      'Submit the Krishi Bhagya application at your RSK or via the K-Kisan portal when district targets open.',
      'Agriculture officers inspect land suitability for farm pond excavation and issue work approval.',
      'Subsidy is credited via DBT after geo-tagged verification of the completed farm pond and equipment.',
    ],
    officialUrl: 'https://raitamitra.karnataka.gov.in/',
    lastVerifiedDate: '2026-10-15',
    isPopular: false,
  },
  {
    slug: 'karnataka-krishi-yantradhare',
    name: 'Karnataka Krishi Yantradhare (Farm Mechanization & Custom Hiring)',
    shortName: 'Krishi Yantradhare (KA)',
    governmentLevel: 'Karnataka',
    stateName: 'Karnataka',
    category: 'Farm Mechanization',
    targetCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)'],
    overview:
      'Implemented by the Karnataka Department of Agriculture, Krishi Yantradhare establishes Custom Hiring Service Centres at the hobli level and offers farm machinery subsidies so small farmers can access modern equipment affordably.',
    objectives: [
      'Make expensive modern agricultural machinery (tractors, rotavators, seed drills, harvesters) accessible on affordable rental.',
      'Reduce manual labour dependency and complete sowing/harvesting operations within optimal weather windows.',
      'Offer subsidized individual farm implements under state/central mechanization sub-missions.',
    ],
    benefits:
      'Subsidized hourly rental of tractors, tillers, sprayers, and harvesters at hobli Custom Hiring Centres, plus capital subsidies on eligible farm equipment as per K-Kisan guidelines.',
    eligibilitySummary:
      'All Karnataka farmers registered with a valid FRUITS ID can hire machinery at Krishi Yantradhare centres; capital subsidies prioritize small, marginal, women, and SC/ST farmers.',
    eligibilityRules: {
      states: ['Karnataka'],
      farmerCategories: ['Marginal (< 1 ha)', 'Small (1-2 ha)', 'Semi-Medium (2-4 ha)', 'Medium (4-10 ha)'],
      notes: [
        'Applicable to farmers cultivating land in Karnataka.',
        'Check equipment availability and subsidy caps on the Karnataka Raita Mitra / K-Kisan portal.',
      ],
    },
    requiredDocuments: [
      'Karnataka FRUITS ID & Aadhaar Card',
      'RTC (Land Record) for individual equipment subsidy',
      'Bank Passbook for DBT subsidy settlement',
    ],
    applicationProcedure: [
      'For machinery rental, visit your nearest Hobli Krishi Yantradhare Centre or contact RSK to book equipment.',
      'For individual machinery subsidy, apply via K-Kisan / RSK with your FRUITS ID and RTC.',
      'Obtain approval before purchasing from approved empaneled dealers and submit invoice for verification.',
    ],
    officialUrl: 'https://raitamitra.karnataka.gov.in/',
    lastVerifiedDate: '2026-10-15',
    isPopular: false,
  },
];

export const INITIAL_AGRICULTURE_ITEMS: SeedAgricultureItem[] = [
  // CROPS
  {
    slug: 'paddy-rice',
    section: 'crop',
    title: 'Paddy (Rice)',
    subtitle: 'Kharif & Summer Irrigated Staple Crop',
    summary:
      'Paddy is India’s primary food grain crop grown widely across irrigated plains, river deltas, and coastal regions under warm, humid conditions.',
    details: {
      'Suitable Climate': 'Warm and humid (20°C – 37°C) with 100–200 cm annual rainfall or assured irrigation.',
      'Soil Requirements': 'Deep clay loam or alluvial soils with good water retention capacity and pH 5.5 – 7.0.',
      'Main Season': 'Kharif (June – November); Rabi / Summer in southern and eastern irrigated belts.',
      'Cultivation Tip': 'Adopt System of Rice Intensification (SRI) or Alternate Wetting and Drying (AWD) to save 25–30% water.',
      'Crop Management': 'Maintain 2–5 cm standing water during vegetative growth; monitor for stem borer and blast disease.',
    },
    highlights: ['High water efficiency with SRI method', 'Green manuring before transplanting boosts yield', 'Check PMFBY notified crop status'],
  },
  {
    slug: 'ragi-finger-millet',
    section: 'crop',
    title: 'Ragi (Finger Millet)',
    subtitle: 'Climate-Resilient Karnataka Dryland Millet',
    summary:
      'Ragi is a highly nutritious, drought-hardy millet staple widely cultivated in southern Karnataka rainfed and semi-arid districts.',
    details: {
      'Suitable Climate': 'Tropical and sub-tropical warm climate (25°C – 32°C); thrives in 50–100 cm rainfall.',
      'Soil Requirements': 'Red loamy, sandy loam, and well-drained alluvial soils (pH 5.0 – 8.0).',
      'Main Season': 'Kharif (July – November); irrigated summer crop in January – April.',
      'Cultivation Tip': 'Intercrop with red gram (Tur) or field bean (Avare) for better soil nitrogen and risk diversification.',
      'Crop Management': 'Perform inter-cultivation at 20 and 35 days after sowing to conserve soil moisture.',
    },
    highlights: ['Drought tolerant millet crop', 'Rich in calcium and dietary fiber', 'Ideal for rainfed farms'],
  },
  {
    slug: 'wheat',
    section: 'crop',
    title: 'Wheat',
    subtitle: 'Major Rabi Cereal Crop',
    summary:
      'Wheat is India’s principal winter (Rabi) cereal crop thriving in cool vegetative weather and warm, dry grain-ripening conditions.',
    details: {
      'Suitable Climate': 'Cool growing season (10°C – 15°C) and bright warm harvest weather (21°C – 26°C).',
      'Soil Requirements': 'Fertile well-drained loam and clay loam soils with neutral pH (6.0 – 7.5).',
      'Main Season': 'Rabi (Sowing: November; Harvesting: March – April).',
      'Cultivation Tip': 'Use Zero-Till Seed Drill after paddy harvest to save diesel and sow timely before terminal heat.',
      'Crop Management': 'Critical irrigation at Crown Root Initiation (20–25 days after sowing) and grain filling stages.',
    },
    highlights: ['Crown Root Initiation irrigation is vital', 'Timely November sowing maximizes grain weight', 'Zero-tillage saves cost'],
  },
  {
    slug: 'tur-pigeon-pea',
    section: 'crop',
    title: 'Tur / Red Gram (Pigeon Pea)',
    subtitle: 'Nitrogen-Fixing Pulse Crop',
    summary:
      'Red gram is a deep-rooted pulse crop that enriches soil nitrogen naturally and supports dryland farm incomes in Karnataka and Maharashtra.',
    details: {
      'Suitable Climate': 'Warm semi-arid climate (20°C – 35°C) with 60–100 cm rainfall; sensitive to waterlogging.',
      'Soil Requirements': 'Well-drained black cotton or red loamy soils (pH 6.0 – 7.5).',
      'Main Season': 'Kharif (June – January).',
      'Cultivation Tip': 'Treat seeds with Rhizobium culture and Trichoderma before sowing to improve root nodulation.',
      'Crop Management': 'Nipping terminal buds at 45–50 days promotes branching and higher pod set.',
    },
    highlights: ['Fixes atmospheric nitrogen in soil', 'Avoid water stagnation in fields', 'Great intercrop with millets or cotton'],
  },

  // SOILS
  {
    slug: 'red-soil',
    section: 'soil',
    title: 'Red Loamy & Sandy Soils',
    subtitle: 'Porous, Iron-Rich Upland Soils',
    summary:
      'Widely found across southern and central Karnataka and Deccan plateaus, red soils drain quickly and respond well to organic matter and micro-irrigation.',
    details: {
      'Key Characteristics': 'Reddish color from iron oxides; porous, friable structure; often low in nitrogen, phosphorus, and humus.',
      'Water Retention': 'Low to moderate; benefits strongly from mulching, farm ponds, and drip irrigation.',
      'Suitable Crops': 'Ragi, Groundnut, Red Gram, Maize, Vegetables, Mango, and Coconut.',
      'Soil Health Advice': 'Incorporate compost/FYM regularly and get Soil Health Card testing every 2 years for micronutrient balance.',
    },
    highlights: ['Responds well to organic compost', 'Ideal for drip irrigation', 'Common across South Karnataka'],
  },
  {
    slug: 'black-cotton-soil',
    section: 'soil',
    title: 'Black Cotton Soil (Regur)',
    subtitle: 'Deep Moisture-Retentive Clay Soils',
    summary:
      'Rich in clay minerals, lime, and magnesium, black soils swell when wet and crack when dry, retaining moisture deep in the profile for rainfed farming.',
    details: {
      'Key Characteristics': 'High clay content, dark colour, self-ploughing cracks in summer; rich in calcium and potash, low in nitrogen.',
      'Water Retention': 'Very high moisture holding capacity; requires proper drainage during heavy monsoon.',
      'Suitable Crops': 'Cotton, Jowar (Sorghum), Tur, Bengal Gram, Soybean, Sunflower, and Sugarcane.',
      'Soil Health Advice': 'Use broad-bed and furrow planting to prevent waterlogging and apply gypsum if sodicity occurs.',
    },
    highlights: ['High moisture retention', 'Needs surface drainage in heavy rain', 'Dominant in North Karnataka & Deccan'],
  },
  {
    slug: 'alluvial-soil',
    section: 'soil',
    title: 'Alluvial Soil',
    subtitle: 'Fertile River-Deposited Plains Soil',
    summary:
      'Deposited by river systems, alluvial soils are among the most productive agricultural soils in India with balanced mineral composition.',
    details: {
      'Key Characteristics': 'Loamy to sandy-loam texture, rich in potash and lime, generally responsive to multi-cropping.',
      'Water Retention': 'Good drainage with balanced moisture availability.',
      'Suitable Crops': 'Wheat, Paddy, Sugarcane, Maize, Pulses, and Horticultural Vegetables.',
      'Soil Health Advice': 'Rotate cereals with pulses and add green manure crops like Dhaincha to sustain organic carbon.',
    },
    highlights: ['High natural fertility', 'Supports multiple cropping cycles', 'Easy to cultivate'],
  },
  {
    slug: 'laterite-soil',
    section: 'soil',
    title: 'Laterite Soil',
    subtitle: 'Acidic High-Rainfall Coastal & Hill Soils',
    summary:
      'Found in high-rainfall Western Ghats and coastal belts, laterite soils require organic enrichment and pH correction for optimal yields.',
    details: {
      'Key Characteristics': 'Acidic pH (4.5 – 6.0), leached of silica and bases due to heavy rainfall; rich in iron and aluminium.',
      'Water Retention': 'Rapidly draining; requires contour bunding on slopes to prevent erosion.',
      'Suitable Crops': 'Arecanut, Coffee, Tea, Cashew, Pepper, Banana, and Rubber.',
      'Soil Health Advice': 'Apply agricultural lime based on Soil Health Card test to neutralize excess acidity.',
    },
    highlights: ['Acidic pH needs lime management', 'Thrives with plantation & spice crops', 'Use contour trenches on slopes'],
  },

  // FARM ANIMALS
  {
    slug: 'dairy-cattle',
    section: 'animal',
    title: 'Dairy Cattle (Indigenous & Crossbred)',
    subtitle: 'Milk Production & Integrated Farming',
    summary:
      'Dairy cattle such as Hallikar, Malnad Gidda, Gir, Sahiwal, and crossbred HF/Jersey cows provide daily cash flow and rich farmyard manure.',
    details: {
      'Housing & Hygiene': 'Well-ventilated dry shed with non-slip flooring, proper drainage, and clean drinking water 24/7.',
      'Feeding Balance': 'Mix green fodder (Napier/Maize), dry fodder, mineral mixture (30–50g/day), and balanced concentrate.',
      'Health Care': 'Timely vaccination against FMD, HS, and BQ; regular deworming every 3–4 months.',
      'Scheme Note': 'Eligible for working capital support under Kisan Credit Card (Animal Husbandry) norms.',
    },
    highlights: ['Daily income diversification', 'Provides manure for organic farming', 'Eligible under KCC Allied Activities'],
  },
  {
    slug: 'buffalo-rearing',
    section: 'animal',
    title: 'Buffalo Rearing (Murrah / Pandharpuri)',
    subtitle: 'High-Fat Milk & Hardy Livestock',
    summary:
      'Buffaloes thrive on coarse roughages and produce high-butterfat milk valued at dairy cooperatives across rural India.',
    details: {
      'Heat Management': 'Provide shade, clean wallowing/sprinkler cooling in summer as buffaloes have fewer sweat glands.',
      'Feeding': '15–25 kg green fodder, dry roughage, and mineral supplements tailored to milk yield.',
      'Breeding & Care': 'Use Artificial Insemination (AI) services from State Veterinary Centres for genetic improvement.',
    },
    highlights: ['Higher milk fat content', 'Efficient converter of roughage', 'Strong dairy cooperative demand'],
  },
  {
    slug: 'goat-sheep-rearing',
    section: 'animal',
    title: 'Goat & Sheep Rearing',
    subtitle: 'Low-Investment Small Ruminant Livestock',
    summary:
      'Goats (Osmanabadi, Sirohi, Jamunapari) and sheep (Deccani, Bannur) act as liquid assets for small and marginal dryland farmers.',
    details: {
      'Shelter': 'Raised slatted floor or dry earthen floor protected from rain and cold drafts.',
      'Nutrition': 'Rotational browsing on tree leaves (Subabul, Glyricidia), leguminous fodder, and clean water.',
      'Disease Prevention': 'Vaccinate timely against PPR and Enterotoxaemia (ET) through government veterinary dispensaries.',
    },
    highlights: ['Ideal for small/landless farmers', 'Fast reproduction cycle', 'Low housing capital required'],
  },
  {
    slug: 'rural-poultry',
    section: 'animal',
    title: 'Backyard & Rural Poultry',
    subtitle: 'Low-Cost Eggs & Meat Nutrition',
    summary:
      'Improved backyard breeds (Swarnadhara, Giriraja, Vanaraja) thrive on kitchen/farm scraps and natural foraging with minimal input cost.',
    details: {
      'Coop Design': 'Predator-proof wire-mesh night shelter allowing free-range daytime foraging.',
      'Biosecurity': 'Clean feeders/drinkers daily and vaccinate chicks against Ranikhet (Newcastle) disease.',
      'Economic Role': 'Quick cash turnover and household nutritional security.',
    },
    highlights: ['Fastest return on livestock investment', 'Hardy dual-purpose breeds', 'Supports women SHG livelihoods'],
  },

  // ORGANIC FARMING
  {
    slug: 'composting-vermicompost',
    section: 'organic',
    title: 'Composting & Vermicomposting',
    subtitle: 'Converting Farm Waste into Living Humus',
    summary:
      'Vermicomposting uses earthworms (Eisenia fetida) to transform crop residues and cow dung into nutrient-dense organic fertilizer in 45–60 days.',
    details: {
      'Materials Needed': 'Partially decomposed cow dung, shredded crop residue, kitchen/weed biomass, and moisture (50–60%).',
      'Process': 'Layer waste in shaded beds, maintain moisture without waterlogging, and harvest fine dark castings.',
      'Benefits': 'Boosts soil microbial activity, water-holding capacity, and slow-release plant nutrition.',
    },
    highlights: ['Reduces chemical fertilizer bills', 'Improves soil structure & microbes', 'Can be produced on-farm'],
  },
  {
    slug: 'natural-farming-jeevamrutha',
    section: 'organic',
    title: 'Natural Farming & Jeevamrutha',
    subtitle: 'Microbial Soil Activation & Mulching',
    summary:
      'Natural farming activates native soil microorganisms using local cow dung, cow urine, jaggery, pulse flour, and soil mulch without synthetic inputs.',
    details: {
      'Jeevamrutha Preparation': 'Ferment 10 kg fresh cow dung, 10 L cow urine, 2 kg jaggery, 2 kg pulse flour, and handful of bund soil in 200 L water for 48–72 hours.',
      'Mulching (Acchadana)': 'Cover soil surface with dried crop straw to suppress weeds, retain moisture, and protect earthworms.',
      'Pest Control': 'Use Neemastram and Agniastram botanical extracts for preventive pest deterrence.',
    },
    highlights: ['Zero synthetic chemical residues', 'Low external input cost', 'Preserves soil moisture'],
  },

  // INORGANIC FARMING
  {
    slug: 'balanced-npk-fertilizer',
    section: 'inorganic',
    title: 'Balanced NPK Fertilizer Management',
    subtitle: '4R Nutrient Stewardship Principle',
    summary:
      'Inorganic fertilizers supply concentrated Nitrogen (N), Phosphorus (P), and Potassium (K); balanced use guided by a Soil Health Card prevents soil degradation.',
    details: {
      'Right Source & Rate': 'Choose Urea, DAP, SSP, or MOP strictly according to soil test deficits rather than guesswork.',
      'Right Time': 'Apply Phosphorus & Potassium as basal dose at sowing; apply Nitrogen (Urea) in 2–3 split doses.',
      'Safety Warning': 'Over-application of Urea increases pest susceptibility, groundwater nitrate leaching, and soil acidity.',
    },
    highlights: ['Follow Soil Health Card dosage', 'Split Nitrogen application saves waste', 'Combine with organic FYM'],
  },
  {
    slug: 'safe-agrochemical-handling',
    section: 'inorganic',
    title: 'Safe Fertilizer & Pesticide Application',
    subtitle: 'Farmer Health & Soil Safety Standards',
    summary:
      'Responsible handling, protective gear, and correct dosage intervals safeguard farmer health, pollinators, and crop marketability.',
    details: {
      'Protective Gear': 'Always wear gloves, mask, long sleeves, and goggles when mixing or spraying crop protection chemicals.',
      'Label Reading': 'Check colour toxicity triangle, exact dilution ratio, and Pre-Harvest Interval (PHI) before spraying.',
      'Storage & Disposal': 'Store away from food, water sources, and children; never wash sprayers in village ponds or canals.',
    },
    highlights: ['Observe Pre-Harvest Interval', 'Never spray against wind', 'Keep away from bees during flowering'],
  },

  // TECHNOLOGIES
  {
    slug: 'drip-irrigation-tech',
    section: 'technology',
    title: 'Drip Irrigation & Fertigation',
    subtitle: 'Precision Root-Zone Water Delivery',
    summary:
      'Drip irrigation delivers water and water-soluble nutrients slowly and directly to the plant root zone, cutting evaporation and runoff dramatically.',
    details: {
      'Water Savings': 'Saves 40–60% water compared to flood irrigation while maintaining uniform soil moisture.',
      'Best For': 'Horticultural crops, vegetables, sugarcane, banana, cotton, and plantation crops.',
      'Subsidy Support': 'Financial assistance available under PMKSY — Per Drop More Crop through state portals.',
    },
    highlights: ['Up to 60% water savings', 'Supports precision fertigation', 'Subsidized under PMKSY'],
  },
  {
    slug: 'sprinkler-irrigation-tech',
    section: 'technology',
    title: 'Sprinkler Irrigation Systems',
    subtitle: 'Uniform Rainfall-Like Crop Watering',
    summary:
      'Sprinkler systems distribute pressurized water evenly across field crops, especially effective on undulating terrain and sandy/loamy soils.',
    details: {
      'Water Savings': 'Saves 30–40% water compared to surface flooding without requiring expensive land leveling.',
      'Best For': 'Groundnut, Ragi, Wheat, Pulses, Onion, and fodder crops.',
      'Maintenance': 'Clean nozzles periodically and verify operating pressure for uniform overlap coverage.',
    },
    highlights: ['No land leveling required', 'Ideal for groundnut, pulses & millets', 'Reduces labour cost'],
  },
  {
    slug: 'greenhouse-polyhouse',
    section: 'technology',
    title: 'Greenhouse & Polyhouse Farming',
    subtitle: 'Protected High-Value Horticulture',
    summary:
      'Protected structures regulate temperature, humidity, and pest entry, allowing farmers to grow off-season vegetables and floriculture crops reliably.',
    details: {
      'Advantages': 'Protects crops from heavy rain, hail, heatwaves, and insect vectors while boosting yield quality.',
      'Best For': 'Capsicum, Tomato, Cucumber, Rose, Gerbera, and Nursery seedlings.',
      'Support': 'Supported under National Horticulture Mission (NHM) / MIDH state subsidies.',
    },
    highlights: ['Year-round protected cultivation', 'Higher export-grade crop quality', 'Lower pest attack'],
  },
  {
    slug: 'precision-ag-machinery',
    section: 'technology',
    title: 'Farm Machinery & Precision Agriculture',
    subtitle: 'Mechanization, Soil Sensors & Agri-Drones',
    summary:
      'Modern tools—from rotavators and laser land levelers to soil moisture sensors and spraying drones—cut drudgery and ensure timely farm operations.',
    details: {
      'Key Equipment': 'Power tillers, zero-till seed drills, transplanters, combine harvesters, and Kisan Drones.',
      'Precision Sensors': 'Soil moisture probes and mobile weather advisories optimize irrigation and spray timing.',
      'Access': 'Small farmers can rent equipment affordably via Krishi Yantradhare Custom Hiring Centres.',
    },
    highlights: ['Timely sowing & harvesting', 'Reduces labour shortage risk', 'Custom hiring reduces capital burden'],
  },
];
