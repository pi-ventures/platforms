// ─────────────────────────────────────────────────────────────
//  YesBroker — Constants & Configuration
// ─────────────────────────────────────────────────────────────

import { AdPlatform } from './types'

// ─── 40+ Indian Real Estate Advertising Platforms ────────────
export const AD_PLATFORMS: AdPlatform[] = [
  // Portals (Tier 1)
  { id:'1',  name:'99acres',        slug:'99acres',       logo:'🏢', color:'#E63946', category:'portal',      connected:true,  apiKey:'',leadsToday:12,leadsTotal:340, activeCampaigns:3, monthlyCost:15000, rating:4.5, indianRank:1  },
  { id:'2',  name:'MagicBricks',    slug:'magicbricks',   logo:'🧱', color:'#E87722', category:'portal',      connected:true,  apiKey:'',leadsToday:9,  leadsTotal:280, activeCampaigns:2, monthlyCost:12000, rating:4.3, indianRank:2  },
  { id:'3',  name:'Housing.com',    slug:'housing',       logo:'🏠', color:'#FF4F5B', category:'portal',      connected:true,  apiKey:'',leadsToday:7,  leadsTotal:210, activeCampaigns:2, monthlyCost:10000, rating:4.2, indianRank:3  },
  { id:'4',  name:'NoBroker',       slug:'nobroker',      logo:'🚫', color:'#00B4D8', category:'portal',      connected:false, apiKey:'',leadsToday:5,  leadsTotal:180, activeCampaigns:1, monthlyCost:8000,  rating:4.0, indianRank:4  },
  { id:'5',  name:'Square Yards',   slug:'squareyards',   logo:'📐', color:'#6A0DAD', category:'aggregator',  connected:true,  apiKey:'',leadsToday:4,  leadsTotal:150, activeCampaigns:1, monthlyCost:9000,  rating:4.1, indianRank:5  },
  { id:'6',  name:'Anarock',        slug:'anarock',       logo:'🏗️', color:'#1B4332', category:'aggregator',  connected:false, apiKey:'',leadsToday:3,  leadsTotal:120, activeCampaigns:0, monthlyCost:11000, rating:4.0, indianRank:6  },
  { id:'7',  name:'PropTiger',      slug:'proptiger',     logo:'🐯', color:'#FF6B35', category:'portal',      connected:true,  apiKey:'',leadsToday:6,  leadsTotal:195, activeCampaigns:2, monthlyCost:9500,  rating:4.2, indianRank:7  },
  { id:'8',  name:'CommonFloor',    slug:'commonfloor',   logo:'🏬', color:'#2196F3', category:'portal',      connected:false, apiKey:'',leadsToday:2,  leadsTotal:90,  activeCampaigns:0, monthlyCost:6000,  rating:3.8, indianRank:8  },
  { id:'9',  name:'Makaan',         slug:'makaan',        logo:'🏡', color:'#4CAF50', category:'portal',      connected:false, apiKey:'',leadsToday:1,  leadsTotal:75,  activeCampaigns:0, monthlyCost:5000,  rating:3.7, indianRank:9  },
  { id:'10', name:'HomeOnline',     slug:'homeonline',    logo:'💻', color:'#9C27B0', category:'portal',      connected:false, apiKey:'',leadsToday:1,  leadsTotal:60,  activeCampaigns:0, monthlyCost:4000,  rating:3.5, indianRank:10 },
  // Social / Ads
  { id:'11', name:'Facebook Ads',   slug:'facebook_ads',  logo:'📘', color:'#1877F2', category:'social',      connected:true,  apiKey:'',leadsToday:15, leadsTotal:420, activeCampaigns:5, monthlyCost:20000, rating:4.6, indianRank:undefined },
  { id:'12', name:'Google Ads',     slug:'google_ads',    logo:'🔍', color:'#4285F4', category:'search',      connected:true,  apiKey:'',leadsToday:18, leadsTotal:510, activeCampaigns:4, monthlyCost:25000, rating:4.7, indianRank:undefined },
  { id:'13', name:'Instagram Ads',  slug:'instagram',     logo:'📸', color:'#E1306C', category:'social',      connected:true,  apiKey:'',leadsToday:8,  leadsTotal:220, activeCampaigns:3, monthlyCost:12000, rating:4.4, indianRank:undefined },
  { id:'14', name:'WhatsApp Biz',   slug:'whatsapp',      logo:'💬', color:'#25D366', category:'social',      connected:true,  apiKey:'',leadsToday:20, leadsTotal:580, activeCampaigns:2, monthlyCost:5000,  rating:4.8, indianRank:undefined },
  // Classifieds
  { id:'15', name:'OLX',            slug:'olx',           logo:'🟡', color:'#F5A623', category:'classifieds', connected:true,  apiKey:'',leadsToday:6,  leadsTotal:175, activeCampaigns:1, monthlyCost:3000,  rating:3.9, indianRank:11 },
  { id:'16', name:'Quikr',          slug:'quikr',         logo:'⚡', color:'#FF5722', category:'classifieds', connected:false, apiKey:'',leadsToday:3,  leadsTotal:95,  activeCampaigns:0, monthlyCost:2500,  rating:3.6, indianRank:12 },
  { id:'17', name:'Sulekha',        slug:'sulekha',       logo:'🌺', color:'#E91E63', category:'classifieds', connected:true,  apiKey:'',leadsToday:4,  leadsTotal:110, activeCampaigns:1, monthlyCost:4000,  rating:3.8, indianRank:13 },
  { id:'18', name:'JustDial',       slug:'justdial',      logo:'📞', color:'#FF6600', category:'classifieds', connected:false, apiKey:'',leadsToday:5,  leadsTotal:130, activeCampaigns:1, monthlyCost:5000,  rating:4.0, indianRank:14 },
  { id:'19', name:'IndiaMart',      slug:'indiamart',     logo:'🇮🇳', color:'#009688', category:'classifieds', connected:false, apiKey:'',leadsToday:2,  leadsTotal:70,  activeCampaigns:0, monthlyCost:3500,  rating:3.7, indianRank:15 },
  { id:'20', name:'TradeIndia',     slug:'tradeindia',    logo:'💼', color:'#795548', category:'classifieds', connected:false, apiKey:'',leadsToday:1,  leadsTotal:45,  activeCampaigns:0, monthlyCost:2000,  rating:3.5, indianRank:16 },
  // Aggregators / Emerging
  { id:'21', name:'Nestaway',       slug:'nestaway',      logo:'🪺', color:'#00BCD4', category:'aggregator',  connected:false, apiKey:'',leadsToday:3,  leadsTotal:85,  activeCampaigns:0, monthlyCost:6000,  rating:3.9, indianRank:17 },
  { id:'22', name:'HomeShikari',    slug:'homeshikari',   logo:'🏹', color:'#607D8B', category:'aggregator',  connected:false, apiKey:'',leadsToday:1,  leadsTotal:40,  activeCampaigns:0, monthlyCost:3000,  rating:3.5, indianRank:18 },
  { id:'23', name:'PropertyWala',   slug:'propertywala',  logo:'🏘️', color:'#8BC34A', category:'portal',      connected:false, apiKey:'',leadsToday:2,  leadsTotal:55,  activeCampaigns:0, monthlyCost:2500,  rating:3.4, indianRank:19 },
  { id:'24', name:'Acres99',        slug:'acres99',       logo:'🌾', color:'#CDDC39', category:'portal',      connected:false, apiKey:'',leadsToday:1,  leadsTotal:35,  activeCampaigns:0, monthlyCost:2000,  rating:3.3, indianRank:20 },
  { id:'25', name:'Brick&Bolt',     slug:'other',         logo:'🧱', color:'#FF9800', category:'aggregator',  connected:false, apiKey:'',leadsToday:2,  leadsTotal:60,  activeCampaigns:0, monthlyCost:4500,  rating:3.8, indianRank:21 },
  { id:'26', name:'SmartOwner',     slug:'other',         logo:'🧠', color:'#3F51B5', category:'aggregator',  connected:false, apiKey:'',leadsToday:1,  leadsTotal:30,  activeCampaigns:0, monthlyCost:5000,  rating:3.6, indianRank:22 },
  { id:'27', name:'Zameen.com',     slug:'other',         logo:'🌍', color:'#009688', category:'portal',      connected:false, apiKey:'',leadsToday:0,  leadsTotal:15,  activeCampaigns:0, monthlyCost:3000,  rating:3.4, indianRank:23 },
  { id:'28', name:'LinkedIn Ads',   slug:'other',         logo:'💼', color:'#0077B5', category:'social',      connected:false, apiKey:'',leadsToday:3,  leadsTotal:90,  activeCampaigns:0, monthlyCost:15000, rating:4.0, indianRank:undefined },
  { id:'29', name:'YouTube Ads',    slug:'other',         logo:'▶️', color:'#FF0000', category:'social',      connected:false, apiKey:'',leadsToday:4,  leadsTotal:110, activeCampaigns:0, monthlyCost:12000, rating:4.1, indianRank:undefined },
  { id:'30', name:'Twitter/X Ads',  slug:'other',         logo:'🐦', color:'#1DA1F2', category:'social',      connected:false, apiKey:'',leadsToday:2,  leadsTotal:55,  activeCampaigns:0, monthlyCost:8000,  rating:3.7, indianRank:undefined },
  { id:'31', name:'Snapchat Ads',   slug:'other',         logo:'👻', color:'#FFFC00', category:'social',      connected:false, apiKey:'',leadsToday:1,  leadsTotal:30,  activeCampaigns:0, monthlyCost:6000,  rating:3.5, indianRank:undefined },
  { id:'32', name:'UrbanClap',      slug:'other',         logo:'🔧', color:'#1DB954', category:'aggregator',  connected:false, apiKey:'',leadsToday:1,  leadsTotal:25,  activeCampaigns:0, monthlyCost:3500,  rating:3.6, indianRank:24 },
  { id:'33', name:'TimesProperty',  slug:'other',         logo:'📰', color:'#D32F2F', category:'portal',      connected:false, apiKey:'',leadsToday:3,  leadsTotal:80,  activeCampaigns:1, monthlyCost:8000,  rating:4.0, indianRank:25 },
  { id:'34', name:'ET Realty',      slug:'other',         logo:'📊', color:'#1565C0', category:'portal',      connected:false, apiKey:'',leadsToday:2,  leadsTotal:65,  activeCampaigns:0, monthlyCost:7000,  rating:3.9, indianRank:26 },
  { id:'35', name:'BricksDaddy',    slug:'other',         logo:'🧱', color:'#E64A19', category:'portal',      connected:false, apiKey:'',leadsToday:1,  leadsTotal:20,  activeCampaigns:0, monthlyCost:2000,  rating:3.2, indianRank:27 },
  { id:'36', name:'GharOffice',     slug:'other',         logo:'🏢', color:'#00796B', category:'portal',      connected:false, apiKey:'',leadsToday:1,  leadsTotal:18,  activeCampaigns:0, monthlyCost:2000,  rating:3.1, indianRank:28 },
  { id:'37', name:'PropertyPistol', slug:'other',         logo:'🔫', color:'#455A64', category:'portal',      connected:false, apiKey:'',leadsToday:0,  leadsTotal:12,  activeCampaigns:0, monthlyCost:1500,  rating:3.0, indianRank:29 },
  { id:'38', name:'RoofandFloor',   slug:'other',         logo:'🏠', color:'#F57C00', category:'portal',      connected:false, apiKey:'',leadsToday:2,  leadsTotal:50,  activeCampaigns:0, monthlyCost:4000,  rating:3.7, indianRank:30 },
  { id:'39', name:'PropVR',         slug:'other',         logo:'🥽', color:'#7B1FA2', category:'aggregator',  connected:false, apiKey:'',leadsToday:0,  leadsTotal:8,   activeCampaigns:0, monthlyCost:5000,  rating:3.3, indianRank:31 },
  { id:'40', name:'Acris',          slug:'other',         logo:'💎', color:'#0288D1', category:'aggregator',  connected:false, apiKey:'',leadsToday:0,  leadsTotal:5,   activeCampaigns:0, monthlyCost:2000,  rating:3.1, indianRank:32 },
  { id:'41', name:'HomesIndia',     slug:'other',         logo:'🏡', color:'#388E3C', category:'portal',      connected:false, apiKey:'',leadsToday:1,  leadsTotal:28,  activeCampaigns:0, monthlyCost:2500,  rating:3.3, indianRank:33 },
  { id:'42', name:'Bing Ads',       slug:'other',         logo:'🔎', color:'#00809D', category:'search',      connected:false, apiKey:'',leadsToday:1,  leadsTotal:22,  activeCampaigns:0, monthlyCost:5000,  rating:3.5, indianRank:undefined },
]

// ─── Indian Cities ───────────────────────────────────────────
export const INDIAN_CITIES = [
  'Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata',
  'Pune','Ahmedabad','Jaipur','Surat','Lucknow','Kanpur',
  'Nagpur','Indore','Thane','Bhopal','Visakhapatnam','Pimpri-Chinchwad',
  'Patna','Vadodara','Ghaziabad','Ludhiana','Agra','Nashik',
  'Faridabad','Meerut','Rajkot','Varanasi','Srinagar','Aurangabad',
  'Dhanbad','Amritsar','Allahabad','Ranchi','Howrah','Coimbatore',
  'Jabalpur','Gwalior','Vijayawada','Jodhpur','Madurai','Raipur',
  'Kota','Guwahati','Chandigarh','Solapur','Hubballi','Mysore',
  'Tiruchirappalli','Bareilly','Aligarh','Moradabad','Gurgaon','Noida',
]

// ─── Property Amenities ──────────────────────────────────────
export const AMENITIES = [
  'Swimming Pool','Gym','Club House','Power Backup','Lift','Parking',
  'Security','CCTV','Intercom','Park/Garden','Jogging Track','Badminton Court',
  'Tennis Court','Basketball Court','Indoor Games','Library','Co-working Space',
  'Day Care','Senior Citizen Area','Pet-friendly','EV Charging','Solar Power',
  'Rainwater Harvesting','STP Plant','Gas Pipeline','Internet/WiFi','Visitor Parking',
  'Fire Sprinklers','Fire Exit','Wheelchair Access','Conference Room','Amphitheatre',
]

// ─── Lead Pipeline Stages ────────────────────────────────────
export const PIPELINE_STAGES = [
  { id: 'new',          label: 'New Leads',      color: '#3B82F6', bg: '#EFF6FF' },
  { id: 'contacted',    label: 'Contacted',       color: '#8B5CF6', bg: '#F5F3FF' },
  { id: 'site_visit',   label: 'Site Visit',      color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'negotiation',  label: 'Negotiation',     color: '#F5A623', bg: '#FFF8E7' },
  { id: 'closed_won',   label: 'Closed Won',      color: '#10B981', bg: '#ECFDF5' },
  { id: 'closed_lost',  label: 'Closed Lost',     color: '#EF4444', bg: '#FEF2F2' },
]

// ─── Pricing Plans ───────────────────────────────────────────
export const PLANS = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    period: 'forever',
    features: ['5 active listings','50 leads/month','Basic CRM','1 ad platform'],
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro Broker',
    price: 2999,
    period: 'month',
    features: ['Unlimited listings','Unlimited leads','Full CRM','10 ad platforms','3D Planner','MyVault sync','Priority support'],
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 9999,
    period: 'month',
    features: ['Everything in Pro','All 40+ ad platforms','Team management','White-label reports','Dedicated account manager','API access','KnowledgeHub.ai sync'],
    highlighted: false,
  },
]

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
