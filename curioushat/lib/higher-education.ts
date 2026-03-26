/**
 * CuriousHat Higher Education Catalog
 * ────────────────────────────────────
 * Complete mapping of ~200 Indian degree programs → entrance exams.
 * Each program is a coaching opportunity: entrance exam prep, syllabus,
 * mock papers, previous year papers, and AI tutoring.
 *
 * All certifications issued through Gurukul Global Vidyaniketan (Gurukul.foundation).
 */

/* ═══════════════════════════════════════════════════════════════
   §1  ENTRANCE EXAMS
   ═══════════════════════════════════════════════════════════════ */

export interface EntranceExam {
  id: string
  name: string
  fullName: string
  conductedBy: string
  frequency: 'annual' | 'biannual' | 'monthly' | 'on_demand'
  /** Typical exam month(s) */
  months: string[]
  mode: 'online' | 'offline' | 'both'
  /** Eligibility — which class/degree is prerequisite */
  eligibility: string
  /** Approx number of candidates per year */
  candidatesPerYear: string
  /** Sections / subjects tested */
  subjects: string[]
  /** Duration in minutes */
  durationMin: number
  /** Total marks */
  totalMarks: number
  /** Negative marking */
  negativeMarking: boolean
  /** Colleges that accept this exam */
  acceptedBy: string[]
  /** CuriousHat prep features available */
  prepFeatures: string[]
  color: string
  icon: string
}

export const ENTRANCE_EXAMS: EntranceExam[] = [
  // ── Engineering ──
  {
    id: 'jee-main', name: 'JEE Main', fullName: 'Joint Entrance Examination Main',
    conductedBy: 'NTA', frequency: 'biannual', months: ['January', 'April'],
    mode: 'online', eligibility: 'Class XII (PCM)',
    candidatesPerYear: '12 lakh+', subjects: ['Physics', 'Chemistry', 'Mathematics'],
    durationMin: 180, totalMarks: 300, negativeMarking: true,
    acceptedBy: ['NITs', 'IIITs', 'GFTIs', 'State engineering colleges', 'JEE Advanced eligibility'],
    prepFeatures: ['AI Mock Tests', 'Chapter-wise PYQs', 'Adaptive Practice', 'Video Solutions', 'Rank Predictor'],
    color: '#4F46E5', icon: '⚙️',
  },
  {
    id: 'jee-advanced', name: 'JEE Advanced', fullName: 'Joint Entrance Examination Advanced',
    conductedBy: 'IIT (rotating)', frequency: 'annual', months: ['May/June'],
    mode: 'online', eligibility: 'Top 2.5 lakh JEE Main qualifiers',
    candidatesPerYear: '2.5 lakh', subjects: ['Physics', 'Chemistry', 'Mathematics'],
    durationMin: 360, totalMarks: 360, negativeMarking: true,
    acceptedBy: ['IITs (23)', 'IISERs', 'IISC Bangalore', 'RGIPT'],
    prepFeatures: ['AI Mock Tests', 'IIT PYQs (40 years)', 'Advanced Problem Bank', 'Rank Predictor'],
    color: '#1D4ED8', icon: '🏛️',
  },
  {
    id: 'bitsat', name: 'BITSAT', fullName: 'BITS Admission Test',
    conductedBy: 'BITS Pilani', frequency: 'annual', months: ['May/June'],
    mode: 'online', eligibility: 'Class XII (PCM, 75%+ aggregate)',
    candidatesPerYear: '2.5 lakh', subjects: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Logical Reasoning'],
    durationMin: 180, totalMarks: 450, negativeMarking: true,
    acceptedBy: ['BITS Pilani', 'BITS Goa', 'BITS Hyderabad'],
    prepFeatures: ['AI Mock Tests', 'Speed Drills', 'Chapter Tests', 'PYQs'],
    color: '#0891B2', icon: '🔷',
  },
  {
    id: 'viteee', name: 'VITEEE', fullName: 'VIT Engineering Entrance Exam',
    conductedBy: 'VIT University', frequency: 'annual', months: ['April'],
    mode: 'online', eligibility: 'Class XII (PCM/PCB)',
    candidatesPerYear: '3 lakh+', subjects: ['Physics', 'Chemistry', 'Mathematics/Biology', 'English', 'Aptitude'],
    durationMin: 150, totalMarks: 125, negativeMarking: false,
    acceptedBy: ['VIT Vellore', 'VIT Chennai', 'VIT AP', 'VIT Bhopal'],
    prepFeatures: ['AI Mock Tests', 'Chapter Tests', 'PYQs'],
    color: '#059669', icon: '🟢',
  },
  {
    id: 'mht-cet', name: 'MHT CET', fullName: 'Maharashtra Common Entrance Test',
    conductedBy: 'State CET Cell Maharashtra', frequency: 'annual', months: ['May'],
    mode: 'online', eligibility: 'Class XII (PCM/PCB)',
    candidatesPerYear: '7 lakh+', subjects: ['Physics', 'Chemistry', 'Mathematics/Biology'],
    durationMin: 180, totalMarks: 200, negativeMarking: false,
    acceptedBy: ['All Maharashtra engineering, pharmacy, agriculture colleges'],
    prepFeatures: ['AI Mock Tests', 'PYQs', 'State Board Aligned Practice'],
    color: '#D97706', icon: '🟠',
  },
  {
    id: 'kcet', name: 'KCET', fullName: 'Karnataka Common Entrance Test',
    conductedBy: 'KEA Karnataka', frequency: 'annual', months: ['April/May'],
    mode: 'offline', eligibility: 'Class XII (PCM/PCB)',
    candidatesPerYear: '2.5 lakh', subjects: ['Physics', 'Chemistry', 'Mathematics/Biology', 'Kannada (optional)'],
    durationMin: 240, totalMarks: 180, negativeMarking: false,
    acceptedBy: ['All Karnataka engineering, medical, architecture colleges'],
    prepFeatures: ['AI Mock Tests', 'PYQs', 'State Board Practice'],
    color: '#DC2626', icon: '🔴',
  },
  {
    id: 'wbjee', name: 'WBJEE', fullName: 'West Bengal Joint Entrance Exam',
    conductedBy: 'WBJEEB', frequency: 'annual', months: ['April'],
    mode: 'offline', eligibility: 'Class XII (PCM)',
    candidatesPerYear: '1.5 lakh', subjects: ['Physics', 'Chemistry', 'Mathematics'],
    durationMin: 240, totalMarks: 200, negativeMarking: true,
    acceptedBy: ['All West Bengal engineering, pharmacy colleges'],
    prepFeatures: ['AI Mock Tests', 'PYQs', 'Chapter Tests'],
    color: '#6D28D9', icon: '🟣',
  },
  {
    id: 'ap-eamcet', name: 'AP EAMCET', fullName: 'Andhra Pradesh Engineering, Agriculture & Medical Common Entrance Test',
    conductedBy: 'JNTU (on behalf of APSCHE)', frequency: 'annual', months: ['May'],
    mode: 'online', eligibility: 'Class XII',
    candidatesPerYear: '3 lakh+', subjects: ['Physics', 'Chemistry', 'Mathematics/Biology'],
    durationMin: 180, totalMarks: 160, negativeMarking: false,
    acceptedBy: ['All AP engineering, agriculture, pharmacy colleges'],
    prepFeatures: ['AI Mock Tests', 'PYQs'],
    color: '#B45309', icon: '🟤',
  },

  // ── Medical ──
  {
    id: 'neet-ug', name: 'NEET UG', fullName: 'National Eligibility cum Entrance Test (Undergraduate)',
    conductedBy: 'NTA', frequency: 'annual', months: ['May'],
    mode: 'offline', eligibility: 'Class XII (PCB)',
    candidatesPerYear: '20 lakh+', subjects: ['Physics', 'Chemistry', 'Biology (Botany + Zoology)'],
    durationMin: 200, totalMarks: 720, negativeMarking: true,
    acceptedBy: ['All MBBS/BDS/BAMS/BHMS/BUMS/BNYS/BVSc/B.Sc Nursing colleges in India', 'AIIMS', 'JIPMER'],
    prepFeatures: ['AI Mock Tests', 'NEET PYQs (20 years)', 'NCERT Line-by-Line', 'Assertion-Reason Practice', 'Rank Predictor'],
    color: '#059669', icon: '🏥',
  },

  // ── Architecture ──
  {
    id: 'nata', name: 'NATA', fullName: 'National Aptitude Test in Architecture',
    conductedBy: 'Council of Architecture', frequency: 'biannual', months: ['April', 'July'],
    mode: 'online', eligibility: 'Class XII (50% Maths)',
    candidatesPerYear: '50,000+', subjects: ['Drawing', 'Mathematics', 'General Aptitude'],
    durationMin: 180, totalMarks: 200, negativeMarking: false,
    acceptedBy: ['All B.Arch colleges (except IITs/NITs which use JEE)'],
    prepFeatures: ['AI Drawing Evaluation', 'Spatial Aptitude Practice', 'Mock Tests'],
    color: '#BE185D', icon: '🏗️',
  },
  {
    id: 'jee-main-b-arch', name: 'JEE Main Paper 2', fullName: 'JEE Main Paper 2 (B.Arch/B.Planning)',
    conductedBy: 'NTA', frequency: 'annual', months: ['April'],
    mode: 'online', eligibility: 'Class XII (Maths)',
    candidatesPerYear: '2 lakh+', subjects: ['Mathematics', 'Aptitude', 'Drawing/Planning'],
    durationMin: 180, totalMarks: 400, negativeMarking: true,
    acceptedBy: ['NITs', 'IITs (B.Arch)', 'GFTIs'],
    prepFeatures: ['AI Mock Tests', 'Drawing Practice', 'Aptitude Drills'],
    color: '#7C3AED', icon: '📐',
  },

  // ── Law ──
  {
    id: 'clat', name: 'CLAT', fullName: 'Common Law Admission Test',
    conductedBy: 'Consortium of NLUs', frequency: 'annual', months: ['December'],
    mode: 'offline', eligibility: 'Class XII (45%+)',
    candidatesPerYear: '70,000+', subjects: ['English', 'Current Affairs & GK', 'Legal Reasoning', 'Logical Reasoning', 'Quantitative Techniques'],
    durationMin: 120, totalMarks: 150, negativeMarking: true,
    acceptedBy: ['22 NLUs', 'NLSIU Bangalore', 'NALSAR', 'NLU Delhi', 'NUJS Kolkata'],
    prepFeatures: ['AI Mock Tests', 'Legal Reasoning Bank', 'GK Daily Digest', 'PYQs'],
    color: '#B45309', icon: '⚖️',
  },
  {
    id: 'ailet', name: 'AILET', fullName: 'All India Law Entrance Test',
    conductedBy: 'NLU Delhi', frequency: 'annual', months: ['June'],
    mode: 'offline', eligibility: 'Class XII',
    candidatesPerYear: '25,000+', subjects: ['English', 'GK', 'Legal Aptitude', 'Reasoning', 'Mathematics'],
    durationMin: 90, totalMarks: 150, negativeMarking: true,
    acceptedBy: ['NLU Delhi'],
    prepFeatures: ['AI Mock Tests', 'PYQs', 'GK Current Affairs'],
    color: '#1D4ED8', icon: '📘',
  },
  {
    id: 'lsat-india', name: 'LSAT India', fullName: 'Law School Admission Test India',
    conductedBy: 'Pearson VUE / LSAC', frequency: 'annual', months: ['January/June'],
    mode: 'online', eligibility: 'Class XII',
    candidatesPerYear: '15,000+', subjects: ['Analytical Reasoning', 'Logical Reasoning', 'Reading Comprehension'],
    durationMin: 132, totalMarks: 92, negativeMarking: false,
    acceptedBy: ['Jindal Global Law School', 'UPES', 'ICFAI', '100+ law colleges'],
    prepFeatures: ['AI Mock Tests', 'Logic Games Practice', 'Reading Drills'],
    color: '#6D28D9', icon: '📕',
  },

  // ── Design ──
  {
    id: 'uceed', name: 'UCEED', fullName: 'Undergraduate Common Entrance Exam for Design',
    conductedBy: 'IIT Bombay', frequency: 'annual', months: ['January'],
    mode: 'online', eligibility: 'Class XII',
    candidatesPerYear: '15,000+', subjects: ['Visualization & Spatial Ability', 'Observation & Design Sensitivity', 'Environment & Social Awareness', 'Analytical & Logical Reasoning'],
    durationMin: 180, totalMarks: 300, negativeMarking: true,
    acceptedBy: ['IIT Bombay (IDC)', 'IIT Delhi', 'IIT Guwahati', 'IIT Hyderabad', 'IIITDM Jabalpur'],
    prepFeatures: ['AI Mock Tests', 'Design Aptitude Practice', 'Observation Exercises'],
    color: '#EC4899', icon: '🎨',
  },
  {
    id: 'nid-dat', name: 'NID DAT', fullName: 'NID Design Aptitude Test',
    conductedBy: 'NID Ahmedabad', frequency: 'annual', months: ['January'],
    mode: 'offline', eligibility: 'Class XII',
    candidatesPerYear: '10,000+', subjects: ['Drawing', 'Design Aptitude', 'Creative Ability', 'Observation', 'GK'],
    durationMin: 180, totalMarks: 100, negativeMarking: false,
    acceptedBy: ['NID Ahmedabad', 'NID Gandhinagar', 'NID Kurukshetra', 'NID Jorhat', 'NID Bhopal'],
    prepFeatures: ['AI Drawing Evaluation', 'Design Thinking Exercises', 'Mock Tests'],
    color: '#F59E0B', icon: '✏️',
  },
  {
    id: 'nift-entrance', name: 'NIFT Entrance', fullName: 'NIFT Entrance Examination',
    conductedBy: 'NIFT', frequency: 'annual', months: ['February'],
    mode: 'offline', eligibility: 'Class XII',
    candidatesPerYear: '30,000+', subjects: ['Creative Ability Test (CAT)', 'General Ability Test (GAT)', 'Situation Test'],
    durationMin: 180, totalMarks: 200, negativeMarking: false,
    acceptedBy: ['NIFT Delhi', 'NIFT Mumbai', 'NIFT Bangalore', 'NIFT Chennai', 'NIFT Kolkata', 'All 18 NIFT campuses'],
    prepFeatures: ['AI Drawing Evaluation', 'Fashion Sketching Practice', 'GAT Mock Tests', 'Situation Test Tips'],
    color: '#EC4899', icon: '👗',
  },

  // ── Common University Entrance ──
  {
    id: 'cuet-ug', name: 'CUET UG', fullName: 'Common University Entrance Test (Undergraduate)',
    conductedBy: 'NTA', frequency: 'annual', months: ['May/June'],
    mode: 'online', eligibility: 'Class XII',
    candidatesPerYear: '15 lakh+', subjects: ['Language', 'Domain Subjects (up to 6)', 'General Test'],
    durationMin: 195, totalMarks: 800, negativeMarking: true,
    acceptedBy: ['All Central Universities (45+)', 'DU', 'JNU', 'BHU', 'AMU', 'Jamia', '250+ universities'],
    prepFeatures: ['AI Mock Tests', 'Subject-wise Practice', 'GK & Language Prep', 'University Cutoff Predictor'],
    color: '#7C3AED', icon: '🎓',
  },

  // ── Management ──
  {
    id: 'ipmat', name: 'IPMAT', fullName: 'Integrated Programme in Management Aptitude Test',
    conductedBy: 'IIM Indore / IIM Rohtak / IIM Ranchi / IIM Bodh Gaya / IIM Jammu',
    frequency: 'annual', months: ['May'],
    mode: 'online', eligibility: 'Class XII (60%+)',
    candidatesPerYear: '30,000+', subjects: ['Quantitative Ability', 'Verbal Ability', 'Logical Reasoning'],
    durationMin: 120, totalMarks: 400, negativeMarking: true,
    acceptedBy: ['IIM Indore (5-yr IPM)', 'IIM Rohtak', 'IIM Ranchi', 'IIM Bodh Gaya', 'IIM Jammu'],
    prepFeatures: ['AI Mock Tests', 'QA & VA Drills', 'PYQs', 'IIM Cutoff Predictor'],
    color: '#1D4ED8', icon: '📊',
  },
  {
    id: 'npat', name: 'NPAT', fullName: 'NMIMS Programs After Twelfth',
    conductedBy: 'NMIMS', frequency: 'annual', months: ['May'],
    mode: 'online', eligibility: 'Class XII',
    candidatesPerYear: '1 lakh+', subjects: ['Quantitative Aptitude', 'Reasoning', 'Language Skills'],
    durationMin: 100, totalMarks: 120, negativeMarking: false,
    acceptedBy: ['NMIMS Mumbai', 'NMIMS Bangalore', 'NMIMS Hyderabad', 'NMIMS Navi Mumbai'],
    prepFeatures: ['AI Mock Tests', 'Speed Drills', 'PYQs'],
    color: '#0891B2', icon: '🔵',
  },
  {
    id: 'set-general', name: 'SET', fullName: 'Symbiosis Entrance Test',
    conductedBy: 'Symbiosis International University', frequency: 'annual', months: ['May'],
    mode: 'online', eligibility: 'Class XII',
    candidatesPerYear: '80,000+', subjects: ['GK', 'English', 'Quantitative', 'Reasoning', 'Analytical'],
    durationMin: 60, totalMarks: 60, negativeMarking: false,
    acceptedBy: ['All Symbiosis institutes — SIBM, SCMS, SSBF, SITM, SLS, etc.'],
    prepFeatures: ['AI Mock Tests', 'GK Daily Digest', 'PYQs'],
    color: '#059669', icon: '🟩',
  },

  // ── Hotel Management ──
  {
    id: 'nchm-jee', name: 'NCHM JEE', fullName: 'National Council for Hotel Management Joint Entrance Exam',
    conductedBy: 'NTA', frequency: 'annual', months: ['May'],
    mode: 'online', eligibility: 'Class XII',
    candidatesPerYear: '30,000+', subjects: ['English', 'Numerical Ability & Reasoning', 'Scientific Aptitude', 'GK', 'Aptitude for Service Sector'],
    durationMin: 180, totalMarks: 200, negativeMarking: true,
    acceptedBy: ['IHMs (21 central govt)', 'All state IHMs', 'Private HM colleges'],
    prepFeatures: ['AI Mock Tests', 'PYQs', 'Aptitude Practice'],
    color: '#D97706', icon: '🏨',
  },

  // ── Agriculture ──
  {
    id: 'icar-aieea', name: 'ICAR AIEEA', fullName: 'Indian Council of Agricultural Research All India Entrance Exam for Admission',
    conductedBy: 'NTA (for ICAR)', frequency: 'annual', months: ['June'],
    mode: 'online', eligibility: 'Class XII (PCB/PCM for agriculture)',
    candidatesPerYear: '2 lakh+', subjects: ['Physics', 'Chemistry', 'Biology/Mathematics', 'Agriculture'],
    durationMin: 150, totalMarks: 600, negativeMarking: true,
    acceptedBy: ['All ICAR universities', 'Agricultural universities (65+)', 'Veterinary colleges'],
    prepFeatures: ['AI Mock Tests', 'Agriculture Subject Bank', 'PYQs'],
    color: '#059669', icon: '🌾',
  },

  // ── Merchant Navy ──
  {
    id: 'imu-cet', name: 'IMU CET', fullName: 'Indian Maritime University Common Entrance Test',
    conductedBy: 'Indian Maritime University', frequency: 'annual', months: ['May'],
    mode: 'online', eligibility: 'Class XII (PCM, 60%+)',
    candidatesPerYear: '15,000+', subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'GK', 'Aptitude'],
    durationMin: 180, totalMarks: 200, negativeMarking: true,
    acceptedBy: ['IMU campuses', 'Merchant navy training institutes'],
    prepFeatures: ['AI Mock Tests', 'Maritime GK', 'PYQs'],
    color: '#0891B2', icon: '⚓',
  },

  // ── Defence ──
  {
    id: 'nda', name: 'NDA', fullName: 'National Defence Academy Entrance',
    conductedBy: 'UPSC', frequency: 'biannual', months: ['April', 'September'],
    mode: 'offline', eligibility: 'Class XII (unmarried, 16.5–19.5 yrs)',
    candidatesPerYear: '5 lakh+', subjects: ['Mathematics', 'General Ability (English + GK)'],
    durationMin: 300, totalMarks: 900, negativeMarking: true,
    acceptedBy: ['National Defence Academy, Khadakwasla', 'Indian Naval Academy, Ezhimala'],
    prepFeatures: ['AI Mock Tests', 'Maths Drills', 'GK Daily Current Affairs', 'SSB Interview Prep'],
    color: '#1D4ED8', icon: '🎖️',
  },
  {
    id: 'afcat', name: 'AFCAT', fullName: 'Air Force Common Admission Test',
    conductedBy: 'Indian Air Force', frequency: 'biannual', months: ['February', 'August'],
    mode: 'online', eligibility: 'Graduation (any discipline) / Class XII for NDA route',
    candidatesPerYear: '3 lakh+', subjects: ['GK', 'Verbal Ability', 'Numerical Ability', 'Reasoning'],
    durationMin: 120, totalMarks: 300, negativeMarking: true,
    acceptedBy: ['Indian Air Force (Flying, Technical, Ground Duty)'],
    prepFeatures: ['AI Mock Tests', 'GK Current Affairs', 'Reasoning Practice'],
    color: '#0891B2', icon: '✈️',
  },

  // ── Education ──
  {
    id: 'du-b-el-ed', name: 'DU B.El.Ed', fullName: 'Delhi University B.El.Ed Entrance',
    conductedBy: 'Delhi University', frequency: 'annual', months: ['June'],
    mode: 'offline', eligibility: 'Class XII (50%+)',
    candidatesPerYear: '10,000+', subjects: ['Language', 'Science', 'Mathematics', 'Social Science', 'GK'],
    durationMin: 120, totalMarks: 800, negativeMarking: false,
    acceptedBy: ['Delhi University (B.El.Ed integrated 4-yr programme)'],
    prepFeatures: ['AI Mock Tests', 'PYQs', 'Teaching Aptitude Practice'],
    color: '#7C3AED', icon: '📚',
  },

  // ── Pharmacy ──
  {
    id: 'gpat', name: 'GPAT', fullName: 'Graduate Pharmacy Aptitude Test',
    conductedBy: 'NTA', frequency: 'annual', months: ['February'],
    mode: 'online', eligibility: 'B.Pharm',
    candidatesPerYear: '50,000+', subjects: ['Pharmaceutics', 'Pharmacology', 'Pharmaceutical Chemistry', 'Pharmacognosy', 'Biochemistry'],
    durationMin: 180, totalMarks: 500, negativeMarking: true,
    acceptedBy: ['M.Pharm colleges across India', 'NIPER'],
    prepFeatures: ['AI Mock Tests', 'PYQs', 'Subject-wise Practice'],
    color: '#059669', icon: '💊',
  },

  // ── CA / CS / CMA Foundation ──
  {
    id: 'ca-foundation', name: 'CA Foundation', fullName: 'Chartered Accountancy Foundation Exam',
    conductedBy: 'ICAI', frequency: 'biannual', months: ['May', 'November'],
    mode: 'offline', eligibility: 'Class XII',
    candidatesPerYear: '3 lakh+', subjects: ['Accounting', 'Business Laws', 'Quantitative Aptitude', 'Business Economics'],
    durationMin: 480, totalMarks: 400, negativeMarking: true,
    acceptedBy: ['ICAI — CA Intermediate → CA Final'],
    prepFeatures: ['AI Mock Tests', 'Chapter-wise Practice', 'Accounting Drills', 'PYQs'],
    color: '#B45309', icon: '📒',
  },
  {
    id: 'cs-foundation', name: 'CS Foundation', fullName: 'Company Secretary Foundation Exam',
    conductedBy: 'ICSI', frequency: 'biannual', months: ['June', 'December'],
    mode: 'offline', eligibility: 'Class XII',
    candidatesPerYear: '50,000+', subjects: ['Business Environment', 'Business Management', 'Business Economics', 'Fundamentals of Accounting'],
    durationMin: 360, totalMarks: 400, negativeMarking: true,
    acceptedBy: ['ICSI — CS Executive → CS Professional'],
    prepFeatures: ['AI Mock Tests', 'PYQs', 'Corporate Law Practice'],
    color: '#6D28D9', icon: '📋',
  },
  {
    id: 'cma-foundation', name: 'CMA Foundation', fullName: 'Cost & Management Accountancy Foundation',
    conductedBy: 'ICMAI', frequency: 'biannual', months: ['June', 'December'],
    mode: 'offline', eligibility: 'Class XII',
    candidatesPerYear: '30,000+', subjects: ['Fundamentals of Economics & Management', 'Fundamentals of Accounting', 'Fundamentals of Laws & Ethics', 'Fundamentals of Business Mathematics & Statistics'],
    durationMin: 480, totalMarks: 400, negativeMarking: false,
    acceptedBy: ['ICMAI — CMA Intermediate → CMA Final'],
    prepFeatures: ['AI Mock Tests', 'PYQs', 'Cost Accounting Practice'],
    color: '#DC2626', icon: '📊',
  },

  // ── Polytechnic ──
  {
    id: 'state-polytechnic', name: 'State Polytechnic CET', fullName: 'State-level Polytechnic Common Entrance Tests',
    conductedBy: 'Various state technical boards', frequency: 'annual', months: ['April–June'],
    mode: 'both', eligibility: 'Class X / Class XII',
    candidatesPerYear: '10 lakh+ (all states combined)', subjects: ['Mathematics', 'Science', 'English', 'GK (varies by state)'],
    durationMin: 150, totalMarks: 200, negativeMarking: false,
    acceptedBy: ['State polytechnic colleges — diploma in engineering, pharmacy, etc.'],
    prepFeatures: ['AI Mock Tests', 'State-wise PYQs', 'Chapter Tests'],
    color: '#D97706', icon: '🔧',
  },

  // ── Aviation ──
  {
    id: 'dgca-cpl', name: 'DGCA CPL Exams', fullName: 'Directorate General of Civil Aviation — Commercial Pilot License Exams',
    conductedBy: 'DGCA India', frequency: 'on_demand', months: ['Year-round (computer-based)'],
    mode: 'online', eligibility: 'Class XII (PCM, 50%+), DGCA Class 1 Medical, SPL holder',
    candidatesPerYear: '8,000+', subjects: ['Air Navigation', 'Aviation Meteorology', 'Air Regulations', 'Technical General', 'Technical Specific'],
    durationMin: 120, totalMarks: 100, negativeMarking: false,
    acceptedBy: ['All DGCA-approved Flying Training Organisations (FTOs)', 'Airlines (IndiGo, Air India, SpiceJet, Vistara, Akasa)'],
    prepFeatures: ['AI Mock Tests', 'DGCA PYQs (10 years)', 'Subject-wise Practice', 'Air Law Updates'],
    color: '#0891B2', icon: '✈️',
  },
  {
    id: 'dgca-atpl', name: 'DGCA ATPL Exams', fullName: 'Airline Transport Pilot License Exams',
    conductedBy: 'DGCA India', frequency: 'on_demand', months: ['Year-round'],
    mode: 'online', eligibility: 'CPL holder with 1,500+ flying hours',
    candidatesPerYear: '2,000+', subjects: ['Air Navigation (Advanced)', 'Meteorology (Advanced)', 'Air Regulations', 'Technical General', 'Technical Specific (Multi-Engine)'],
    durationMin: 120, totalMarks: 100, negativeMarking: false,
    acceptedBy: ['Airline Captain positions', 'All Indian airlines'],
    prepFeatures: ['AI Mock Tests', 'DGCA PYQs', 'Advanced Navigation Practice'],
    color: '#1D4ED8', icon: '🛩️',
  },
  {
    id: 'dgca-ame', name: 'DGCA AME CAR-147 Exams', fullName: 'Aircraft Maintenance Engineering License Exams',
    conductedBy: 'DGCA India', frequency: 'biannual', months: ['April', 'October'],
    mode: 'offline', eligibility: 'Class XII (PCM, 50%+) + AME training from approved institute',
    candidatesPerYear: '15,000+', subjects: ['Mathematics', 'Physics', 'Aircraft Rules & Regulations', 'Aircraft Specific Modules (4 papers)'],
    durationMin: 180, totalMarks: 100, negativeMarking: false,
    acceptedBy: ['All Indian airlines (maintenance)', 'MRO organisations', 'Airport authorities'],
    prepFeatures: ['AI Mock Tests', 'Module-wise Practice', 'Aircraft Systems Diagrams', 'PYQs'],
    color: '#D97706', icon: '🔧',
  },
  {
    id: 'igrua-entrance', name: 'IGRUA Entrance', fullName: 'Indira Gandhi Rashtriya Uran Akademi Entrance Test',
    conductedBy: 'IGRUA Rae Bareli', frequency: 'annual', months: ['March/April'],
    mode: 'offline', eligibility: 'Class XII (PCM, 55%+)',
    candidatesPerYear: '5,000+', subjects: ['Physics', 'Mathematics', 'English', 'General Awareness', 'Reasoning'],
    durationMin: 150, totalMarks: 200, negativeMarking: true,
    acceptedBy: ['IGRUA Rae Bareli (Govt of India FTO)', 'IndiGo Cadet Pilot Programme (IGRUA route)'],
    prepFeatures: ['AI Mock Tests', 'Physics & Maths Drills', 'Aviation GK', 'PYQs'],
    color: '#059669', icon: '🏛️',
  },

  // ══════════════════════════════════════════════════
  // GOVERNMENT JOB EXAMS
  // ══════════════════════════════════════════════════

  // ── UPSC ──
  {
    id: 'upsc-cse', name: 'UPSC CSE', fullName: 'Union Public Service Commission — Civil Services Examination (IAS/IPS/IFS)',
    conductedBy: 'UPSC', frequency: 'annual', months: ['Prelims: June', 'Mains: September', 'Interview: March'],
    mode: 'offline', eligibility: 'Graduation (any discipline), 21–32 yrs (relaxation for reserved)',
    candidatesPerYear: '12 lakh+', subjects: ['General Studies (History, Geography, Polity, Economy, Science, Ethics)', 'CSAT (Aptitude)', 'Optional Subject', 'Essay'],
    durationMin: 360, totalMarks: 2025, negativeMarking: true,
    acceptedBy: ['IAS', 'IPS', 'IFS', 'IRS', 'IRTS', 'IAAS', '24 All India & Central Services'],
    prepFeatures: ['AI Mock Tests (Prelims + Mains)', 'Daily Current Affairs', 'Answer Writing Practice', 'Optional Subject Bank', 'Essay Evaluator', 'Interview Prep'],
    color: '#1D4ED8', icon: '🏛️',
  },
  {
    id: 'upsc-cds', name: 'UPSC CDS', fullName: 'Combined Defence Services Examination',
    conductedBy: 'UPSC', frequency: 'biannual', months: ['April', 'September'],
    mode: 'offline', eligibility: 'Graduation (unmarried, 19–25 yrs)',
    candidatesPerYear: '4 lakh+', subjects: ['English', 'General Knowledge', 'Mathematics'],
    durationMin: 360, totalMarks: 300, negativeMarking: true,
    acceptedBy: ['IMA Dehradun', 'OTA Chennai', 'Air Force Academy', 'Naval Academy'],
    prepFeatures: ['AI Mock Tests', 'GK Daily Digest', 'Maths Speed Drills', 'SSB Interview Prep'],
    color: '#059669', icon: '🎖️',
  },
  {
    id: 'upsc-capf', name: 'UPSC CAPF', fullName: 'Central Armed Police Forces — Assistant Commandant',
    conductedBy: 'UPSC', frequency: 'annual', months: ['August'],
    mode: 'offline', eligibility: 'Graduation, 20–25 yrs',
    candidatesPerYear: '3 lakh+', subjects: ['General Ability & Intelligence', 'General Studies, Essay & Comprehension'],
    durationMin: 300, totalMarks: 450, negativeMarking: true,
    acceptedBy: ['BSF', 'CRPF', 'CISF', 'ITBP', 'SSB', 'CAPF'],
    prepFeatures: ['AI Mock Tests', 'GK Current Affairs', 'Essay Practice', 'Physical Fitness Guide'],
    color: '#7C3AED', icon: '🛡️',
  },
  {
    id: 'upsc-epfo', name: 'UPSC EPFO', fullName: 'Employees Provident Fund Organisation — Enforcement Officer',
    conductedBy: 'UPSC', frequency: 'annual', months: ['Varies'],
    mode: 'offline', eligibility: 'Graduation, 21–30 yrs',
    candidatesPerYear: '2 lakh+', subjects: ['General Studies', 'Accounting', 'Industrial Relations & Labour Laws', 'Social Security'],
    durationMin: 240, totalMarks: 300, negativeMarking: true,
    acceptedBy: ['EPFO — Enforcement Officer / Accounts Officer'],
    prepFeatures: ['AI Mock Tests', 'Labour Law Practice', 'Accounting Drills'],
    color: '#B45309', icon: '📋',
  },

  // ── SSC (Staff Selection Commission) ──
  {
    id: 'ssc-cgl', name: 'SSC CGL', fullName: 'Staff Selection Commission — Combined Graduate Level',
    conductedBy: 'SSC', frequency: 'annual', months: ['Tier I: March–April', 'Tier II: June–July'],
    mode: 'online', eligibility: 'Graduation (any discipline)',
    candidatesPerYear: '30 lakh+', subjects: ['General Intelligence & Reasoning', 'General Awareness', 'Quantitative Aptitude', 'English Language'],
    durationMin: 120, totalMarks: 400, negativeMarking: true,
    acceptedBy: ['Income Tax Inspector', 'CBI Sub-Inspector', 'Customs Inspector', 'Auditor (CAG)', 'Assistant (MEA)', 'Statistical Investigator'],
    prepFeatures: ['AI Mock Tests', 'Topic-wise Practice', 'GK Daily Updates', 'Previous Year Papers (20 yrs)', 'Speed Maths Drills'],
    color: '#DC2626', icon: '📝',
  },
  {
    id: 'ssc-chsl', name: 'SSC CHSL', fullName: 'Staff Selection Commission — Combined Higher Secondary Level',
    conductedBy: 'SSC', frequency: 'annual', months: ['Tier I: March', 'Tier II: June'],
    mode: 'online', eligibility: 'Class XII (any stream)',
    candidatesPerYear: '25 lakh+', subjects: ['General Intelligence', 'English Language', 'Quantitative Aptitude', 'General Awareness'],
    durationMin: 60, totalMarks: 200, negativeMarking: true,
    acceptedBy: ['LDC (Lower Division Clerk)', 'DEO (Data Entry Operator)', 'Postal Assistant', 'Sorting Assistant', 'Court Clerk'],
    prepFeatures: ['AI Mock Tests', 'Typing Speed Practice', 'GK Updates', 'PYQs'],
    color: '#D97706', icon: '📝',
  },
  {
    id: 'ssc-mts', name: 'SSC MTS', fullName: 'Staff Selection Commission — Multi-Tasking Staff',
    conductedBy: 'SSC', frequency: 'annual', months: ['May–July'],
    mode: 'online', eligibility: 'Class X',
    candidatesPerYear: '50 lakh+', subjects: ['Numerical Ability', 'Reasoning', 'English', 'General Awareness'],
    durationMin: 90, totalMarks: 150, negativeMarking: true,
    acceptedBy: ['Multi-Tasking Staff (Group C) in central government offices'],
    prepFeatures: ['AI Mock Tests', 'Basic Maths Drills', 'GK Updates', 'PYQs'],
    color: '#6D28D9', icon: '📝',
  },
  {
    id: 'ssc-gd', name: 'SSC GD Constable', fullName: 'SSC GD Constable — General Duty',
    conductedBy: 'SSC', frequency: 'annual', months: ['January–February'],
    mode: 'online', eligibility: 'Class X, 18–23 yrs, physical fitness',
    candidatesPerYear: '1 crore+', subjects: ['General Intelligence & Reasoning', 'General Knowledge', 'Elementary Mathematics', 'English/Hindi'],
    durationMin: 60, totalMarks: 160, negativeMarking: true,
    acceptedBy: ['BSF', 'CISF', 'CRPF', 'ITBP', 'SSB', 'NIA', 'SSF', 'Assam Rifles'],
    prepFeatures: ['AI Mock Tests', 'Physical Fitness Guide', 'GK Updates', 'Hindi/English Practice'],
    color: '#059669', icon: '🛡️',
  },
  {
    id: 'ssc-je', name: 'SSC JE', fullName: 'SSC Junior Engineer',
    conductedBy: 'SSC', frequency: 'annual', months: ['March–April'],
    mode: 'online', eligibility: 'Diploma / B.Tech in relevant engineering branch',
    candidatesPerYear: '5 lakh+', subjects: ['General Intelligence & Reasoning', 'General Awareness', 'Technical (Civil/Electrical/Mechanical)'],
    durationMin: 120, totalMarks: 300, negativeMarking: true,
    acceptedBy: ['CPWD', 'CWC', 'MES', 'BRO', 'Railways (JE posts)'],
    prepFeatures: ['AI Mock Tests', 'Technical Subject Banks', 'PYQs'],
    color: '#BE185D', icon: '⚙️',
  },

  // ── Banking ──
  {
    id: 'ibps-po', name: 'IBPS PO', fullName: 'Institute of Banking Personnel Selection — Probationary Officer',
    conductedBy: 'IBPS', frequency: 'annual', months: ['Prelims: October', 'Mains: November'],
    mode: 'online', eligibility: 'Graduation (any discipline), 20–30 yrs',
    candidatesPerYear: '12 lakh+', subjects: ['English', 'Quantitative Aptitude', 'Reasoning Ability', 'General Awareness', 'Computer Aptitude'],
    durationMin: 180, totalMarks: 225, negativeMarking: true,
    acceptedBy: ['11 Public Sector Banks (PNB, BOB, Canara, Union, IOB, etc.)'],
    prepFeatures: ['AI Mock Tests', 'Banking Awareness Daily', 'Quant Speed Drills', 'Reasoning Puzzles', 'PYQs (10 yrs)'],
    color: '#1D4ED8', icon: '🏦',
  },
  {
    id: 'ibps-clerk', name: 'IBPS Clerk', fullName: 'IBPS Clerk — Clerical Cadre',
    conductedBy: 'IBPS', frequency: 'annual', months: ['Prelims: August', 'Mains: October'],
    mode: 'online', eligibility: 'Graduation (any discipline), 20–28 yrs',
    candidatesPerYear: '15 lakh+', subjects: ['English', 'Numerical Ability', 'Reasoning', 'General/Financial Awareness', 'Computer Aptitude'],
    durationMin: 160, totalMarks: 200, negativeMarking: true,
    acceptedBy: ['11 Public Sector Banks — Clerk posts'],
    prepFeatures: ['AI Mock Tests', 'Banking Awareness', 'Speed Maths', 'PYQs'],
    color: '#0891B2', icon: '🏦',
  },
  {
    id: 'sbi-po', name: 'SBI PO', fullName: 'State Bank of India — Probationary Officer',
    conductedBy: 'SBI', frequency: 'annual', months: ['Prelims: November', 'Mains: December'],
    mode: 'online', eligibility: 'Graduation (any discipline), 21–30 yrs',
    candidatesPerYear: '20 lakh+', subjects: ['English', 'Quantitative Aptitude', 'Reasoning & Computer Aptitude', 'General/Economy/Banking Awareness'],
    durationMin: 200, totalMarks: 250, negativeMarking: true,
    acceptedBy: ['State Bank of India — PO (Probationary Officer)'],
    prepFeatures: ['AI Mock Tests', 'SBI PYQs', 'Banking Current Affairs', 'Descriptive Writing Practice', 'GD/Interview Prep'],
    color: '#4F46E5', icon: '🏦',
  },
  {
    id: 'sbi-clerk', name: 'SBI Clerk', fullName: 'State Bank of India — Junior Associate',
    conductedBy: 'SBI', frequency: 'annual', months: ['Prelims: January', 'Mains: February'],
    mode: 'online', eligibility: 'Graduation (any discipline), 20–28 yrs',
    candidatesPerYear: '25 lakh+', subjects: ['English', 'Numerical Ability', 'Reasoning', 'General/Financial Awareness'],
    durationMin: 160, totalMarks: 200, negativeMarking: true,
    acceptedBy: ['State Bank of India — Clerk / Junior Associate'],
    prepFeatures: ['AI Mock Tests', 'Speed Tests', 'Banking GK', 'PYQs'],
    color: '#7C3AED', icon: '🏦',
  },
  {
    id: 'rbi-grade-b', name: 'RBI Grade B', fullName: 'Reserve Bank of India — Grade B Officer',
    conductedBy: 'RBI', frequency: 'annual', months: ['Phase I: March', 'Phase II: April'],
    mode: 'online', eligibility: 'Graduation (60%+), 21–30 yrs',
    candidatesPerYear: '3 lakh+', subjects: ['General Awareness', 'Quantitative Aptitude', 'English', 'Reasoning', 'Economic & Social Issues', 'Finance & Management'],
    durationMin: 180, totalMarks: 300, negativeMarking: true,
    acceptedBy: ['Reserve Bank of India — Grade B Officer (DR)'],
    prepFeatures: ['AI Mock Tests', 'Economics Deep Dive', 'Finance Practice', 'ESI Answer Writing', 'PYQs'],
    color: '#059669', icon: '🏛️',
  },
  {
    id: 'rbi-assistant', name: 'RBI Assistant', fullName: 'Reserve Bank of India — Assistant',
    conductedBy: 'RBI', frequency: 'annual', months: ['Prelims: February', 'Mains: March'],
    mode: 'online', eligibility: 'Graduation (any discipline), 20–28 yrs',
    candidatesPerYear: '8 lakh+', subjects: ['English', 'Numerical Ability', 'Reasoning', 'General Awareness', 'Computer Knowledge'],
    durationMin: 135, totalMarks: 200, negativeMarking: true,
    acceptedBy: ['Reserve Bank of India — Assistant post'],
    prepFeatures: ['AI Mock Tests', 'Banking GK', 'Speed Tests', 'PYQs'],
    color: '#0891B2', icon: '🏛️',
  },

  // ── Railways ──
  {
    id: 'rrb-ntpc', name: 'RRB NTPC', fullName: 'Railway Recruitment Board — Non-Technical Popular Categories',
    conductedBy: 'RRB (21 boards)', frequency: 'annual', months: ['CBT 1: Various', 'CBT 2: Various'],
    mode: 'online', eligibility: 'Graduation (any discipline) for some posts, Class XII for others',
    candidatesPerYear: '1.2 crore+', subjects: ['Mathematics', 'General Awareness', 'General Intelligence & Reasoning'],
    durationMin: 90, totalMarks: 100, negativeMarking: true,
    acceptedBy: ['Station Master', 'Goods Guard', 'Senior Clerk', 'Traffic Assistant', 'Commercial Apprentice', 'ASM'],
    prepFeatures: ['AI Mock Tests', 'Railway GK Special', 'Reasoning Puzzles', 'PYQs (All RRBs)', 'Speed Maths'],
    color: '#DC2626', icon: '🚆',
  },
  {
    id: 'rrb-group-d', name: 'RRB Group D', fullName: 'Railway Recruitment Board — Group D (Level 1)',
    conductedBy: 'RRB', frequency: 'annual', months: ['Various'],
    mode: 'online', eligibility: 'Class X + ITI / NAC (National Apprenticeship Certificate)',
    candidatesPerYear: '1.5 crore+', subjects: ['Mathematics', 'General Intelligence & Reasoning', 'General Science', 'General Awareness'],
    durationMin: 90, totalMarks: 100, negativeMarking: true,
    acceptedBy: ['Track Maintainer', 'Helper', 'Pointsman', 'Gate Man', 'Porter'],
    prepFeatures: ['AI Mock Tests', 'Basic Science Practice', 'Railway GK', 'PYQs'],
    color: '#D97706', icon: '🚆',
  },
  {
    id: 'rrb-je', name: 'RRB JE', fullName: 'Railway Recruitment Board — Junior Engineer',
    conductedBy: 'RRB', frequency: 'annual', months: ['Various'],
    mode: 'online', eligibility: 'Diploma / B.Tech in relevant branch',
    candidatesPerYear: '5 lakh+', subjects: ['General Awareness', 'Physics & Mathematics', 'General Intelligence & Reasoning', 'Technical Ability'],
    durationMin: 120, totalMarks: 150, negativeMarking: true,
    acceptedBy: ['Indian Railways — Junior Engineer (Civil/Mechanical/Electrical/ECE/IT)'],
    prepFeatures: ['AI Mock Tests', 'Technical Subject Banks', 'Railway-specific Numericals', 'PYQs'],
    color: '#B45309', icon: '🚆',
  },
  {
    id: 'rrb-alp', name: 'RRB ALP', fullName: 'Railway Recruitment Board — Assistant Loco Pilot',
    conductedBy: 'RRB', frequency: 'annual', months: ['Various'],
    mode: 'online', eligibility: 'Class X + ITI in relevant trade OR Diploma / B.Tech',
    candidatesPerYear: '4 lakh+', subjects: ['Mathematics', 'General Intelligence', 'General Science', 'General Awareness'],
    durationMin: 60, totalMarks: 75, negativeMarking: true,
    acceptedBy: ['Indian Railways — Assistant Loco Pilot / Technician'],
    prepFeatures: ['AI Mock Tests', 'Trade-specific Practice', 'Railway GK', 'PYQs'],
    color: '#6D28D9', icon: '🚆',
  },

  // ── State PSC ──
  {
    id: 'state-psc', name: 'State PSC', fullName: 'State Public Service Commission Examinations',
    conductedBy: 'Individual State PSCs (UPPSC, MPPSC, BPSC, RPSC, TNPSC, KPSC, APPSC, TSPSC, WBPSC, etc.)',
    frequency: 'annual', months: ['Varies by state — typically Prelims in Q1-Q2, Mains in Q3-Q4'],
    mode: 'offline', eligibility: 'Graduation (any discipline), age varies by state (21–40 yrs with relaxation)',
    candidatesPerYear: '50 lakh+ (all states combined)', subjects: ['General Studies (State + National)', 'CSAT / Aptitude', 'Optional Subject', 'State Language', 'Essay'],
    durationMin: 360, totalMarks: 1500, negativeMarking: true,
    acceptedBy: ['State Deputy Collector / SDM', 'State Police (DSP)', 'BDO', 'Tehsildar', 'State Tax Officer', 'State Administrative Service'],
    prepFeatures: ['AI Mock Tests (State-specific)', 'State GK & Current Affairs', 'State History & Geography', 'Answer Writing Practice', 'PYQs by State'],
    color: '#7C3AED', icon: '🏛️',
  },

  // ── Teaching ──
  {
    id: 'ctet', name: 'CTET', fullName: 'Central Teacher Eligibility Test',
    conductedBy: 'CBSE', frequency: 'biannual', months: ['January', 'July'],
    mode: 'online', eligibility: 'D.El.Ed / B.Ed / B.El.Ed',
    candidatesPerYear: '30 lakh+', subjects: ['Child Development & Pedagogy', 'Language I', 'Language II', 'Mathematics', 'Environmental Studies / Social Science / Science'],
    durationMin: 150, totalMarks: 150, negativeMarking: false,
    acceptedBy: ['All central government schools (KVS, NVS, Army Schools, EFC schools)', 'Many state government schools accept CTET'],
    prepFeatures: ['AI Mock Tests', 'CDP Practice', 'Pedagogy Question Bank', 'PYQs (10 yrs)'],
    color: '#059669', icon: '📚',
  },
  {
    id: 'ugc-net', name: 'UGC NET', fullName: 'University Grants Commission — National Eligibility Test',
    conductedBy: 'NTA', frequency: 'biannual', months: ['June', 'December'],
    mode: 'online', eligibility: 'Post-graduation (55%+)',
    candidatesPerYear: '15 lakh+', subjects: ['General Paper (Teaching Aptitude, Research Methodology, Comprehension, Reasoning)', 'Subject Paper (83 subjects)'],
    durationMin: 180, totalMarks: 300, negativeMarking: false,
    acceptedBy: ['Assistant Professor (all Indian universities)', 'JRF (Junior Research Fellowship) for PhD'],
    prepFeatures: ['AI Mock Tests', 'Paper I Practice', 'Subject-wise Question Bank (83 subjects)', 'PYQs'],
    color: '#1D4ED8', icon: '🎓',
  },
  {
    id: 'kvs-pgt-tgt', name: 'KVS PGT/TGT', fullName: 'Kendriya Vidyalaya Sangathan — PGT & TGT Recruitment',
    conductedBy: 'KVS', frequency: 'annual', months: ['February–March'],
    mode: 'online', eligibility: 'B.Ed + Post-graduation (PGT) / B.Ed + Graduation (TGT)',
    candidatesPerYear: '8 lakh+', subjects: ['General Hindi', 'General English', 'General Knowledge & Current Affairs', 'Reasoning', 'Computer Literacy', 'Pedagogy', 'Subject Knowledge'],
    durationMin: 180, totalMarks: 180, negativeMarking: true,
    acceptedBy: ['Kendriya Vidyalayas (1,252 schools across India + abroad)'],
    prepFeatures: ['AI Mock Tests', 'Subject Knowledge Banks', 'Pedagogy Practice', 'PYQs'],
    color: '#4F46E5', icon: '📚',
  },

  // ── Insurance ──
  {
    id: 'lic-aao', name: 'LIC AAO', fullName: 'Life Insurance Corporation — Assistant Administrative Officer',
    conductedBy: 'LIC', frequency: 'annual', months: ['Prelims: March', 'Mains: June'],
    mode: 'online', eligibility: 'Graduation (any discipline), 21–30 yrs',
    candidatesPerYear: '8 lakh+', subjects: ['Reasoning Ability', 'Quantitative Aptitude', 'English Language', 'General Knowledge & Current Affairs', 'Insurance & Financial Market Awareness'],
    durationMin: 120, totalMarks: 300, negativeMarking: true,
    acceptedBy: ['Life Insurance Corporation of India — AAO (Generalist/IT/CA/Actuarial)'],
    prepFeatures: ['AI Mock Tests', 'Insurance Awareness', 'Quant Speed Drills', 'PYQs'],
    color: '#0891B2', icon: '🏢',
  },
  {
    id: 'niacl-ao', name: 'NIACL AO', fullName: 'New India Assurance — Administrative Officer',
    conductedBy: 'NIACL', frequency: 'annual', months: ['Varies'],
    mode: 'online', eligibility: 'Graduation (60%+), 21–30 yrs',
    candidatesPerYear: '3 lakh+', subjects: ['English', 'Reasoning', 'Quantitative Aptitude', 'General Awareness', 'Computer Knowledge'],
    durationMin: 120, totalMarks: 200, negativeMarking: true,
    acceptedBy: ['NIACL', 'UIIC', 'Oriental Insurance', 'Other PSU Insurance companies'],
    prepFeatures: ['AI Mock Tests', 'Insurance GK', 'PYQs'],
    color: '#D97706', icon: '🏢',
  },

  // ── Judicial Services ──
  {
    id: 'judicial-services', name: 'Judicial Services', fullName: 'State Judicial Services Examination (Civil Judge / Magistrate)',
    conductedBy: 'State High Courts / State PSCs', frequency: 'annual', months: ['Varies by state'],
    mode: 'offline', eligibility: 'LLB degree, enrolled as Advocate',
    candidatesPerYear: '2 lakh+ (all states combined)', subjects: ['Civil Law', 'Criminal Law', 'Constitutional Law', 'Jurisprudence', 'Evidence Act', 'CPC & CrPC', 'Language Paper'],
    durationMin: 360, totalMarks: 600, negativeMarking: false,
    acceptedBy: ['Civil Judge (Junior Division)', 'Judicial Magistrate First Class', 'State Judiciary'],
    prepFeatures: ['AI Mock Tests', 'Law Subject Banks', 'Judgment Writing Practice', 'Case Study Analysis', 'PYQs by State'],
    color: '#B45309', icon: '⚖️',
  },

  // ── Other Central Govt ──
  {
    id: 'nabard-grade-a', name: 'NABARD Grade A', fullName: 'National Bank for Agriculture and Rural Development — Grade A Officer',
    conductedBy: 'NABARD', frequency: 'annual', months: ['Prelims: September', 'Mains: October'],
    mode: 'online', eligibility: 'Graduation (60%+) or Post-graduation, 21–30 yrs',
    candidatesPerYear: '3 lakh+', subjects: ['English', 'Quantitative Aptitude', 'Reasoning', 'General Awareness', 'Agriculture & Rural Development', 'Economic & Social Issues'],
    durationMin: 180, totalMarks: 300, negativeMarking: true,
    acceptedBy: ['NABARD — Grade A (RDBS/Rajbhasha/Legal/IT)'],
    prepFeatures: ['AI Mock Tests', 'Agriculture GK', 'Rural Development Practice', 'PYQs'],
    color: '#059669', icon: '🌾',
  },
  {
    id: 'sebi-grade-a', name: 'SEBI Grade A', fullName: 'Securities and Exchange Board of India — Grade A Officer',
    conductedBy: 'SEBI', frequency: 'annual', months: ['Phase I: February', 'Phase II: March'],
    mode: 'online', eligibility: 'Graduation / CA / CS / LLB (varies by stream)',
    candidatesPerYear: '2 lakh+', subjects: ['General Awareness', 'English', 'Quantitative Aptitude', 'Reasoning', 'Securities Market', 'Finance & Management'],
    durationMin: 120, totalMarks: 200, negativeMarking: true,
    acceptedBy: ['SEBI — Grade A Officer (General/Legal/IT/Official Language)'],
    prepFeatures: ['AI Mock Tests', 'Securities Market Practice', 'Finance Deep Dive', 'PYQs'],
    color: '#4F46E5', icon: '📈',
  },
]

/* ═══════════════════════════════════════════════════════════════
   §2  DEGREE → ENTRANCE EXAM MAPPING
   ═══════════════════════════════════════════════════════════════ */

export interface DegreeProgram {
  id: string
  degree: string
  fullName: string
  duration: string
  category: 'bachelors_3yr' | 'bachelors_4_5yr' | 'integrated_5yr' | 'diploma' | 'professional_cert' | 'defence' | 'aviation' | 'govt_job'
  specializations: string[]
  /** Entrance exam IDs */
  entranceExams: string[]
  /** Eligibility */
  eligibility: string
  /** Career paths */
  careers: string[]
  /** Average starting salary range */
  salaryRange: string
  color: string
  icon: string
}

export const DEGREE_PROGRAMS: DegreeProgram[] = [

  // ════════════════════════════════════════════
  // BACHELOR'S DEGREES (3 Year)
  // ════════════════════════════════════════════

  {
    id: 'ba', degree: 'B.A.', fullName: 'Bachelor of Arts', duration: '3 years',
    category: 'bachelors_3yr',
    specializations: [
      'History', 'Political Science', 'Sociology', 'Psychology', 'Economics', 'Philosophy',
      'Geography', 'English', 'Hindi', 'Sanskrit', 'Urdu', 'Tamil', 'Telugu', 'Marathi',
      'Punjabi', 'Public Administration', 'Social Work', 'Journalism', 'Home Science',
      'Fine Arts', 'Music', 'Dance', 'Theatre',
    ],
    entranceExams: ['cuet-ug'],
    eligibility: 'Class XII from any stream',
    careers: ['Civil Services', 'Journalism', 'Teaching', 'Content Writing', 'Social Work', 'Law (after LLB)'],
    salaryRange: '3–8 LPA', color: '#7C3AED', icon: '📖',
  },
  {
    id: 'bsc', degree: 'B.Sc.', fullName: 'Bachelor of Science', duration: '3 years',
    category: 'bachelors_3yr',
    specializations: [
      'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Zoology', 'Botany', 'Microbiology',
      'Biochemistry', 'Biotechnology', 'Environmental Science', 'Forensic Science',
      'Computer Science', 'IT', 'Data Science', 'AI & ML', 'Statistics',
      'Nursing', 'Nutrition & Dietetics', 'Agriculture', 'Horticulture', 'Fisheries',
      'Forestry', 'Food Technology', 'Sericulture', 'Poultry Science',
      'Radiology', 'MLT', 'Cardiac Tech', 'Dialysis Tech', 'Operation Theatre Tech',
      'Optometry', 'Audiology & Speech Therapy', 'Prosthetics & Orthotics',
      'Aviation', 'Nautical Science', 'Yoga', 'Sports Science',
    ],
    entranceExams: ['cuet-ug', 'neet-ug', 'icar-aieea'],
    eligibility: 'Class XII (PCM / PCB depending on specialization)',
    careers: ['Research', 'Healthcare', 'IT', 'Teaching', 'Lab Scientist', 'Data Analyst'],
    salaryRange: '3–10 LPA', color: '#0891B2', icon: '🔬',
  },
  {
    id: 'bcom', degree: 'B.Com', fullName: 'Bachelor of Commerce', duration: '3 years',
    category: 'bachelors_3yr',
    specializations: ['General', 'Honours', 'Taxation', 'Banking & Insurance', 'Accounting & Finance', 'E-Commerce', 'International Business'],
    entranceExams: ['cuet-ug', 'npat', 'set-general'],
    eligibility: 'Class XII (Commerce preferred)',
    careers: ['Chartered Accountant', 'Banking', 'Finance', 'Taxation', 'Auditing', 'Business'],
    salaryRange: '3–8 LPA', color: '#D97706', icon: '💰',
  },
  {
    id: 'bba', degree: 'B.B.A.', fullName: 'Bachelor of Business Administration', duration: '3 years',
    category: 'bachelors_3yr',
    specializations: ['General', 'Finance', 'Marketing', 'HR', 'International Business', 'Banking', 'Tourism', 'Aviation', 'Hospital Management', 'Logistics'],
    entranceExams: ['cuet-ug', 'ipmat', 'npat', 'set-general'],
    eligibility: 'Class XII from any stream',
    careers: ['Management', 'Consulting', 'Entrepreneurship', 'Marketing', 'MBA (post-grad)'],
    salaryRange: '4–10 LPA', color: '#1D4ED8', icon: '💼',
  },
  {
    id: 'bca', degree: 'B.C.A.', fullName: 'Bachelor of Computer Applications', duration: '3 years',
    category: 'bachelors_3yr',
    specializations: ['General', 'Cloud Computing', 'AI & ML', 'Cybersecurity', 'Mobile App Development'],
    entranceExams: ['cuet-ug', 'npat', 'set-general'],
    eligibility: 'Class XII with Mathematics',
    careers: ['Software Developer', 'Web Developer', 'System Analyst', 'MCA (post-grad)'],
    salaryRange: '4–10 LPA', color: '#BE185D', icon: '💻',
  },
  {
    id: 'bsw', degree: 'B.S.W.', fullName: 'Bachelor of Social Work', duration: '3 years',
    category: 'bachelors_3yr', specializations: ['Community Development', 'Urban & Rural', 'Medical Social Work', 'Psychiatric Social Work'],
    entranceExams: ['cuet-ug'], eligibility: 'Class XII from any stream',
    careers: ['NGO Work', 'Social Services', 'Counselling', 'CSR', 'MSW (post-grad)'],
    salaryRange: '3–6 LPA', color: '#059669', icon: '🤝',
  },
  {
    id: 'bfa', degree: 'B.F.A.', fullName: 'Bachelor of Fine Arts', duration: '3–4 years',
    category: 'bachelors_3yr',
    specializations: ['Painting', 'Sculpture', 'Applied Arts', 'Music', 'Dance', 'Theatre/Drama'],
    entranceExams: ['cuet-ug', 'uceed', 'nid-dat'],
    eligibility: 'Class XII from any stream',
    careers: ['Artist', 'Art Director', 'Curator', 'Animator', 'Performer', 'Art Teacher'],
    salaryRange: '3–10 LPA', color: '#EC4899', icon: '🎨',
  },
  {
    id: 'bped', degree: 'B.P.Ed.', fullName: 'Bachelor of Physical Education', duration: '2 years (after graduation) / 4 yr integrated',
    category: 'bachelors_3yr', specializations: ['Sports Coaching', 'Fitness Training', 'School PE'],
    entranceExams: ['cuet-ug', 'state-polytechnic'], eligibility: 'Class XII (with sports background)',
    careers: ['PE Teacher', 'Sports Coach', 'Fitness Trainer', 'Sports Management'],
    salaryRange: '3–6 LPA', color: '#F59E0B', icon: '🏃',
  },
  {
    id: 'bhm', degree: 'B.H.M.', fullName: 'Bachelor of Hotel Management', duration: '3–4 years',
    category: 'bachelors_3yr',
    specializations: ['Hotel Operations', 'Food Production', 'Front Office', 'Housekeeping', 'Food & Beverage Service'],
    entranceExams: ['nchm-jee', 'cuet-ug', 'set-general'],
    eligibility: 'Class XII from any stream',
    careers: ['Hotel Manager', 'Chef', 'Event Manager', 'Restaurant Owner', 'Airline Catering'],
    salaryRange: '4–10 LPA', color: '#D97706', icon: '🏨',
  },
  {
    id: 'bmm', degree: 'B.M.M. / BJC', fullName: 'Bachelor of Mass Media / Journalism & Communication', duration: '3 years',
    category: 'bachelors_3yr',
    specializations: ['Journalism', 'Advertising', 'PR', 'Film', 'Digital Media', 'Event Management'],
    entranceExams: ['cuet-ug', 'set-general', 'npat'],
    eligibility: 'Class XII from any stream',
    careers: ['Journalist', 'Content Creator', 'PR Manager', 'Filmmaker', 'Ad Agency'],
    salaryRange: '3–10 LPA', color: '#6D28D9', icon: '📺',
  },
  {
    id: 'bdes', degree: 'B.Des.', fullName: 'Bachelor of Design', duration: '4 years',
    category: 'bachelors_3yr',
    specializations: ['Fashion', 'Graphic', 'Interior', 'Industrial/Product', 'Communication', 'UX/Interaction', 'Textile', 'Accessory', 'Leather', 'Knitwear'],
    entranceExams: ['uceed', 'nid-dat', 'nift-entrance'],
    eligibility: 'Class XII from any stream',
    careers: ['Fashion Designer', 'UX Designer', 'Interior Designer', 'Product Designer', 'Graphic Designer'],
    salaryRange: '4–15 LPA', color: '#EC4899', icon: '👗',
  },
  {
    id: 'bpt', degree: 'B.P.T.', fullName: 'Bachelor of Physiotherapy', duration: '4.5 years',
    category: 'bachelors_3yr', specializations: ['Ortho', 'Neuro', 'Cardio-Pulmonary', 'Sports', 'Community'],
    entranceExams: ['neet-ug', 'cuet-ug'], eligibility: 'Class XII (PCB, 50%+)',
    careers: ['Physiotherapist', 'Sports Rehab', 'Hospital', 'Private Clinic', 'MPT'],
    salaryRange: '3–8 LPA', color: '#059669', icon: '🦴',
  },
  {
    id: 'bot', degree: 'B.O.T.', fullName: 'Bachelor of Occupational Therapy', duration: '4.5 years',
    category: 'bachelors_3yr', specializations: ['Paediatric', 'Mental Health', 'Geriatric', 'Hand Therapy'],
    entranceExams: ['neet-ug', 'cuet-ug'], eligibility: 'Class XII (PCB, 50%+)',
    careers: ['Occupational Therapist', 'Rehab Centre', 'Hospital', 'School Therapist'],
    salaryRange: '3–7 LPA', color: '#0891B2', icon: '🧩',
  },
  {
    id: 'bpharm', degree: 'B.Pharm', fullName: 'Bachelor of Pharmacy', duration: '4 years',
    category: 'bachelors_3yr', specializations: ['Pharmaceutics', 'Pharmacology', 'Pharma Chemistry', 'Pharmacognosy', 'Hospital Pharmacy'],
    entranceExams: ['neet-ug', 'mht-cet', 'state-polytechnic'],
    eligibility: 'Class XII (PCM/PCB)',
    careers: ['Pharmacist', 'Drug Inspector', 'Pharma Industry', 'Clinical Research', 'M.Pharm'],
    salaryRange: '3–8 LPA', color: '#059669', icon: '💊',
  },
  {
    id: 'bams', degree: 'B.A.M.S.', fullName: 'Bachelor of Ayurvedic Medicine & Surgery', duration: '5.5 years',
    category: 'bachelors_3yr', specializations: ['Kayachikitsa', 'Shalya Tantra', 'Shalakya', 'Panchakarma'],
    entranceExams: ['neet-ug'], eligibility: 'Class XII (PCB, 50%+)',
    careers: ['Ayurvedic Doctor', 'Government Service', 'Private Practice', 'Research'],
    salaryRange: '4–10 LPA', color: '#059669', icon: '🌿',
  },
  {
    id: 'bhms', degree: 'B.H.M.S.', fullName: 'Bachelor of Homeopathic Medicine & Surgery', duration: '5.5 years',
    category: 'bachelors_3yr', specializations: ['Organon', 'Materia Medica', 'Repertory', 'Practice of Medicine'],
    entranceExams: ['neet-ug'], eligibility: 'Class XII (PCB, 50%+)',
    careers: ['Homeopathic Doctor', 'Private Practice', 'Government Hospital'],
    salaryRange: '3–8 LPA', color: '#7C3AED', icon: '💉',
  },
  {
    id: 'bums', degree: 'B.U.M.S.', fullName: 'Bachelor of Unani Medicine & Surgery', duration: '5.5 years',
    category: 'bachelors_3yr', specializations: ['Moalijat', 'Jarahiyat', 'Ilmul Advia', 'Qabalat'],
    entranceExams: ['neet-ug'], eligibility: 'Class XII (PCB, 50%+)',
    careers: ['Unani Doctor', 'Govt Hospital', 'Research', 'Private Practice'],
    salaryRange: '3–8 LPA', color: '#B45309', icon: '🏺',
  },
  {
    id: 'bnys', degree: 'B.N.Y.S.', fullName: 'Bachelor of Naturopathy & Yogic Sciences', duration: '5.5 years',
    category: 'bachelors_3yr', specializations: ['Yoga Therapy', 'Naturopathy', 'Acupuncture', 'Diet Therapy'],
    entranceExams: ['neet-ug'], eligibility: 'Class XII (PCB, 50%+)',
    careers: ['Naturopathic Doctor', 'Yoga Therapist', 'Wellness Centre', 'Government Service'],
    salaryRange: '3–7 LPA', color: '#0D9488', icon: '🧘',
  },
  {
    id: 'bvsc', degree: 'B.V.Sc.', fullName: 'Bachelor of Veterinary Science', duration: '5 years',
    category: 'bachelors_3yr', specializations: ['Animal Medicine', 'Surgery', 'Gynaecology', 'Public Health'],
    entranceExams: ['neet-ug', 'icar-aieea'], eligibility: 'Class XII (PCB, 50%+)',
    careers: ['Veterinary Doctor', 'Animal Husbandry', 'Research', 'Dairy Industry'],
    salaryRange: '4–10 LPA', color: '#059669', icon: '🐾',
  },
  {
    id: 'bpa', degree: 'B.P.A.', fullName: 'Bachelor of Performing Arts', duration: '3 years',
    category: 'bachelors_3yr', specializations: ['Classical Dance', 'Theatre', 'Music Performance', 'Folk Arts'],
    entranceExams: ['cuet-ug'], eligibility: 'Class XII from any stream',
    careers: ['Performer', 'Choreographer', 'Music Director', 'Theatre Director'],
    salaryRange: '3–10 LPA', color: '#F59E0B', icon: '🎭',
  },

  // ════════════════════════════════════════════
  // BACHELOR'S DEGREES (4–5 Year / Professional)
  // ════════════════════════════════════════════

  {
    id: 'btech', degree: 'B.Tech / B.E.', fullName: 'Bachelor of Technology / Engineering', duration: '4 years',
    category: 'bachelors_4_5yr',
    specializations: [
      'CS', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Aerospace', 'Biomedical',
      'Biotech', 'Automobile', 'Marine', 'Mining', 'Metallurgy', 'Production', 'Textile',
      'Agricultural Engineering', 'Petroleum', 'Nuclear', 'Robotics', 'AI & ML', 'Cyber Security', 'Data Science',
    ],
    entranceExams: ['jee-main', 'jee-advanced', 'bitsat', 'viteee', 'mht-cet', 'kcet', 'wbjee', 'ap-eamcet'],
    eligibility: 'Class XII (PCM, 75%+)',
    careers: ['Software Engineer', 'Core Engineering', 'Data Scientist', 'Product Manager', 'Entrepreneur', 'Research'],
    salaryRange: '6–30+ LPA', color: '#4F46E5', icon: '⚙️',
  },
  {
    id: 'mbbs', degree: 'MBBS', fullName: 'Bachelor of Medicine & Surgery', duration: '5.5 years',
    category: 'bachelors_4_5yr', specializations: ['General Medicine', 'Surgery', 'Paediatrics', 'Gynaecology', 'Orthopaedics', 'Psychiatry', 'Dermatology', 'ENT', 'Ophthalmology', 'Radiology', 'Anaesthesiology', 'Pathology'],
    entranceExams: ['neet-ug'],
    eligibility: 'Class XII (PCB, 50%+ / 40% for reserved)',
    careers: ['Doctor', 'Surgeon', 'Researcher', 'Government Service (UPSC CMS)', 'PG (MD/MS/MCh)'],
    salaryRange: '8–25+ LPA', color: '#059669', icon: '🏥',
  },
  {
    id: 'bds', degree: 'B.D.S.', fullName: 'Bachelor of Dental Surgery', duration: '5 years',
    category: 'bachelors_4_5yr', specializations: ['Orthodontics', 'Prosthodontics', 'Periodontics', 'Endodontics', 'Oral Surgery', 'Community Dentistry'],
    entranceExams: ['neet-ug'], eligibility: 'Class XII (PCB, 50%+)',
    careers: ['Dentist', 'Orthodontist', 'Private Practice', 'Research', 'MDS'],
    salaryRange: '5–15 LPA', color: '#0891B2', icon: '🦷',
  },
  {
    id: 'barch', degree: 'B.Arch.', fullName: 'Bachelor of Architecture', duration: '5 years',
    category: 'bachelors_4_5yr', specializations: ['Residential', 'Commercial', 'Urban Planning', 'Interior', 'Landscape', 'Sustainable Design'],
    entranceExams: ['nata', 'jee-main-b-arch'], eligibility: 'Class XII (50% Maths, 50% aggregate)',
    careers: ['Architect', 'Urban Planner', 'Interior Designer', 'Construction Manager'],
    salaryRange: '5–15 LPA', color: '#BE185D', icon: '🏗️',
  },
  {
    id: 'llb', degree: 'LLB', fullName: 'Bachelor of Laws', duration: '3 years (after graduation)',
    category: 'bachelors_4_5yr', specializations: ['Constitutional', 'Corporate', 'Criminal', 'IPR', 'International', 'Tax', 'Cyber Law', 'Human Rights'],
    entranceExams: ['clat', 'ailet', 'lsat-india'], eligibility: 'Graduation (any discipline)',
    careers: ['Advocate', 'Judge', 'Corporate Counsel', 'Legal Advisor', 'Civil Services'],
    salaryRange: '5–20+ LPA', color: '#B45309', icon: '⚖️',
  },
  {
    id: 'bed', degree: 'B.Ed.', fullName: 'Bachelor of Education', duration: '2 years (after graduation)',
    category: 'bachelors_4_5yr', specializations: ['Science', 'Mathematics', 'Social Science', 'English', 'Hindi', 'Special Education'],
    entranceExams: ['cuet-ug', 'du-b-el-ed', 'state-polytechnic'], eligibility: 'Graduation (50%+)',
    careers: ['School Teacher', 'Education Administrator', 'Curriculum Designer', 'EdTech'],
    salaryRange: '3–8 LPA', color: '#7C3AED', icon: '📚',
  },
  {
    id: 'beled', degree: 'B.El.Ed.', fullName: 'Bachelor of Elementary Education', duration: '4 years (integrated)',
    category: 'bachelors_4_5yr', specializations: ['Primary Education', 'Early Childhood', 'Special Needs'],
    entranceExams: ['du-b-el-ed'], eligibility: 'Class XII (50%+)',
    careers: ['Primary School Teacher', 'Education Specialist', 'Curriculum Developer'],
    salaryRange: '3–6 LPA', color: '#6D28D9', icon: '👶',
  },
  {
    id: 'merchant-navy', degree: 'Merchant Navy', fullName: 'B.Sc Nautical Science / B.E Marine Engineering / DNS',
    duration: '3–4 years', category: 'bachelors_4_5yr',
    specializations: ['B.Sc Nautical Science', 'B.E Marine Engineering', 'DNS (Diploma Nautical Science)'],
    entranceExams: ['imu-cet'], eligibility: 'Class XII (PCM, 60%+)',
    careers: ['Deck Officer', 'Marine Engineer', 'Ship Captain', 'Port Manager'],
    salaryRange: '8–30+ LPA', color: '#0891B2', icon: '⚓',
  },

  // ════════════════════════════════════════════
  // INTEGRATED DEGREES (5 Year — After 12th)
  // ════════════════════════════════════════════

  {
    id: 'ba-llb', degree: 'BA LLB', fullName: 'Integrated BA + LLB', duration: '5 years',
    category: 'integrated_5yr', specializations: ['Constitutional', 'Criminal', 'Corporate', 'Human Rights'],
    entranceExams: ['clat', 'ailet', 'lsat-india'], eligibility: 'Class XII (45%+)',
    careers: ['Advocate', 'Judge', 'Legal Advisor', 'Civil Services'], salaryRange: '5–20+ LPA', color: '#B45309', icon: '⚖️',
  },
  {
    id: 'bba-llb', degree: 'BBA LLB', fullName: 'Integrated BBA + LLB', duration: '5 years',
    category: 'integrated_5yr', specializations: ['Corporate Law', 'Business Law', 'IPR', 'Tax'],
    entranceExams: ['clat', 'ailet', 'lsat-india', 'set-general'], eligibility: 'Class XII (45%+)',
    careers: ['Corporate Lawyer', 'Business Consultant', 'Legal Analyst'], salaryRange: '6–20+ LPA', color: '#1D4ED8', icon: '⚖️',
  },
  {
    id: 'bcom-llb', degree: 'B.Com LLB', fullName: 'Integrated B.Com + LLB', duration: '5 years',
    category: 'integrated_5yr', specializations: ['Tax Law', 'Corporate Governance', 'Securities Law'],
    entranceExams: ['clat', 'lsat-india'], eligibility: 'Class XII',
    careers: ['Tax Lawyer', 'Corporate Counsel', 'Company Secretary'], salaryRange: '5–15 LPA', color: '#D97706', icon: '⚖️',
  },
  {
    id: 'bsc-llb', degree: 'B.Sc LLB', fullName: 'Integrated B.Sc + LLB', duration: '5 years',
    category: 'integrated_5yr', specializations: ['Environmental Law', 'Cyber Law', 'Patent Law'],
    entranceExams: ['clat', 'lsat-india'], eligibility: 'Class XII (Science)',
    careers: ['Patent Attorney', 'Environmental Lawyer', 'IP Specialist'], salaryRange: '6–18 LPA', color: '#059669', icon: '⚖️',
  },
  {
    id: 'btech-mba', degree: 'B.Tech + MBA', fullName: 'Integrated B.Tech + MBA', duration: '5 years',
    category: 'integrated_5yr', specializations: ['Tech Management', 'Product Management', 'Fintech'],
    entranceExams: ['jee-main', 'jee-advanced', 'bitsat'], eligibility: 'Class XII (PCM)',
    careers: ['Product Manager', 'Tech Consultant', 'Startup Founder', 'CTO'], salaryRange: '10–30+ LPA', color: '#4F46E5', icon: '⚙️',
  },
  {
    id: 'btech-mtech', degree: 'B.Tech + M.Tech', fullName: 'Integrated B.Tech + M.Tech', duration: '5 years',
    category: 'integrated_5yr', specializations: ['CS', 'AI & ML', 'VLSI', 'Structural Engineering'],
    entranceExams: ['jee-main', 'jee-advanced'], eligibility: 'Class XII (PCM)',
    careers: ['Research Engineer', 'Senior Developer', 'R&D', 'PhD'], salaryRange: '8–25+ LPA', color: '#1D4ED8', icon: '🔬',
  },
  {
    id: 'ba-ma', degree: 'BA + MA', fullName: 'Integrated BA + MA (Eco/Psych/History etc.)', duration: '5 years',
    category: 'integrated_5yr', specializations: ['Economics', 'Psychology', 'History', 'English', 'Sociology', 'Political Science'],
    entranceExams: ['cuet-ug'], eligibility: 'Class XII',
    careers: ['Research', 'Teaching', 'Civil Services', 'Policy Analyst'], salaryRange: '4–12 LPA', color: '#7C3AED', icon: '📖',
  },
  {
    id: 'bsc-msc', degree: 'B.Sc + M.Sc', fullName: 'Integrated B.Sc + M.Sc', duration: '5 years',
    category: 'integrated_5yr', specializations: ['Physics', 'Chemistry', 'Maths', 'Biology', 'Biotech'],
    entranceExams: ['cuet-ug', 'jee-main'], eligibility: 'Class XII (Science)',
    careers: ['Research Scientist', 'Teaching', 'R&D', 'PhD'], salaryRange: '5–15 LPA', color: '#0891B2', icon: '🔬',
  },
  {
    id: 'bca-mca', degree: 'BCA + MCA', fullName: 'Integrated BCA + MCA', duration: '5 years',
    category: 'integrated_5yr', specializations: ['Software Engineering', 'AI', 'Cloud', 'Cybersecurity'],
    entranceExams: ['cuet-ug', 'npat'], eligibility: 'Class XII with Mathematics',
    careers: ['Software Engineer', 'System Architect', 'IT Manager'], salaryRange: '6–18 LPA', color: '#BE185D', icon: '💻',
  },
  {
    id: 'ba-bed', degree: 'BA B.Ed / B.Sc B.Ed', fullName: 'Integrated B.Ed', duration: '4 years',
    category: 'integrated_5yr', specializations: ['Science Education', 'Maths Education', 'Language Education', 'Social Science Education'],
    entranceExams: ['cuet-ug', 'du-b-el-ed', 'state-polytechnic'], eligibility: 'Class XII (50%+)',
    careers: ['Teacher (TGT/PGT)', 'Education Officer', 'Curriculum Designer'],
    salaryRange: '3–8 LPA', color: '#6D28D9', icon: '📚',
  },

  // ════════════════════════════════════════════
  // DIPLOMA / CERTIFICATE (After 12th, 1–3 yr)
  // ════════════════════════════════════════════

  {
    id: 'polytechnic-eng', degree: 'Polytechnic Diploma (Engineering)', fullName: 'Polytechnic Diploma in Engineering',
    duration: '3 years', category: 'diploma',
    specializations: ['Mechanical', 'Civil', 'ECE', 'CS', 'Electrical', 'Chemical', 'Automobile'],
    entranceExams: ['state-polytechnic'], eligibility: 'Class X / Class XII',
    careers: ['Junior Engineer', 'Technician', 'Supervisor', 'Lateral entry to B.Tech'],
    salaryRange: '2–5 LPA', color: '#D97706', icon: '🔧',
  },
  {
    id: 'medical-diploma', degree: 'Medical Diplomas', fullName: 'Medical Diplomas (D.Pharm, DMLT, D.Nursing, etc.)',
    duration: '2–3 years', category: 'diploma',
    specializations: ['D.Pharm', 'DMLT', 'D.Nursing', 'Diploma Radiology', 'Diploma Nutrition & Dietetics'],
    entranceExams: ['neet-ug', 'state-polytechnic'], eligibility: 'Class XII (PCB)',
    careers: ['Pharmacist', 'Lab Technician', 'Nurse', 'Radiographer'],
    salaryRange: '2–5 LPA', color: '#059669', icon: '🏥',
  },
  {
    id: 'design-media-diploma', degree: 'Design & Media Diploma', fullName: 'Diploma in Design / Animation / VFX / Film',
    duration: '1–2 years', category: 'diploma',
    specializations: ['Graphic Design', 'Animation', 'VFX', 'Film & TV Production'],
    entranceExams: ['nift-entrance', 'nid-dat'], eligibility: 'Class XII',
    careers: ['Animator', 'VFX Artist', 'Graphic Designer', 'Film Editor'],
    salaryRange: '3–8 LPA', color: '#EC4899', icon: '🎬',
  },
  {
    id: 'management-diploma', degree: 'Management & Commerce Diploma', fullName: 'Diploma in Hotel Mgmt / Event Mgmt / Digital Marketing / Retail',
    duration: '1–2 years', category: 'diploma',
    specializations: ['Hotel Management', 'Event Management', 'Digital Marketing', 'Retail Management'],
    entranceExams: ['nchm-jee', 'set-general'], eligibility: 'Class XII',
    careers: ['Hotel Staff', 'Event Planner', 'Digital Marketer', 'Retail Manager'],
    salaryRange: '2–6 LPA', color: '#1D4ED8', icon: '📊',
  },
  {
    id: 'aviation-diploma', degree: 'Aviation & Travel Diploma', fullName: 'Cabin Crew / Airport Management / Travel & Tourism Diploma',
    duration: '1–2 years', category: 'diploma',
    specializations: ['Cabin Crew / Air Hostess', 'Airport Management', 'Travel & Tourism'],
    entranceExams: ['nchm-jee'], eligibility: 'Class XII',
    careers: ['Cabin Crew', 'Airport Ground Staff', 'Travel Agent', 'Tourism Officer'],
    salaryRange: '3–8 LPA', color: '#0891B2', icon: '✈️',
  },
  {
    id: 'deled', degree: 'D.El.Ed', fullName: 'Diploma in Elementary Education', duration: '2 years',
    category: 'diploma', specializations: ['Primary Teaching'],
    entranceExams: ['state-polytechnic'], eligibility: 'Class XII (50%+)',
    careers: ['Primary School Teacher (after CTET/STET)'], salaryRange: '2–4 LPA', color: '#7C3AED', icon: '👶',
  },
  {
    id: 'it-vocational', degree: 'IT & Vocational Diploma', fullName: 'Web Dev / Cybersecurity / Cloud / ITI Trades',
    duration: '6 months – 2 years', category: 'diploma',
    specializations: ['Web Development', 'Cybersecurity', 'Cloud Computing', 'ITI Trades (Fitter, Turner, Electrician, Welder, etc.)'],
    entranceExams: ['state-polytechnic'], eligibility: 'Class X / Class XII',
    careers: ['Web Developer', 'IT Support', 'Electrician', 'Mechanic', 'Plumber'],
    salaryRange: '2–8 LPA', color: '#BE185D', icon: '💻',
  },

  // ════════════════════════════════════════════
  // PROFESSIONAL CERTIFICATIONS
  // ════════════════════════════════════════════

  {
    id: 'ca', degree: 'CA', fullName: 'Chartered Accountancy', duration: '4–5 years (Foundation → Inter → Final)',
    category: 'professional_cert', specializations: ['Audit', 'Taxation', 'Corporate Finance', 'Forensic Accounting'],
    entranceExams: ['ca-foundation'], eligibility: 'Class XII / Graduation',
    careers: ['Chartered Accountant', 'CFO', 'Auditor', 'Tax Consultant', 'Forensic Accountant'],
    salaryRange: '7–30+ LPA', color: '#B45309', icon: '📒',
  },
  {
    id: 'cma', degree: 'CMA', fullName: 'Cost & Management Accountancy', duration: '3–4 years',
    category: 'professional_cert', specializations: ['Cost Audit', 'Management Accounting', 'Financial Analysis'],
    entranceExams: ['cma-foundation'], eligibility: 'Class XII / Graduation',
    careers: ['Cost Accountant', 'Management Consultant', 'Financial Analyst'],
    salaryRange: '5–20 LPA', color: '#DC2626', icon: '📊',
  },
  {
    id: 'cs', degree: 'CS', fullName: 'Company Secretary', duration: '3–4 years',
    category: 'professional_cert', specializations: ['Corporate Governance', 'Securities Law', 'Compliance', 'Board Practices'],
    entranceExams: ['cs-foundation'], eligibility: 'Class XII / Graduation',
    careers: ['Company Secretary', 'Compliance Officer', 'Legal Advisor', 'Corporate Governance'],
    salaryRange: '5–20 LPA', color: '#6D28D9', icon: '📋',
  },
  {
    id: 'actuarial', degree: 'Actuarial Science', fullName: 'Actuarial Science (IAI)', duration: '3–5 years',
    category: 'professional_cert', specializations: ['Life Insurance', 'General Insurance', 'Pensions', 'Risk Management'],
    entranceExams: ['ca-foundation'], eligibility: 'Class XII with Mathematics',
    careers: ['Actuary', 'Risk Analyst', 'Insurance Company', 'Consulting'],
    salaryRange: '8–40+ LPA', color: '#1D4ED8', icon: '📈',
  },
  {
    id: 'cfp', degree: 'CFP', fullName: 'Certified Financial Planner', duration: '6 months – 1 year',
    category: 'professional_cert', specializations: ['Financial Planning', 'Wealth Management', 'Retirement Planning'],
    entranceExams: ['ca-foundation'], eligibility: 'Graduation',
    careers: ['Financial Planner', 'Wealth Advisor', 'Insurance Advisor'],
    salaryRange: '5–15 LPA', color: '#059669', icon: '💰',
  },
  {
    id: 'cfa', degree: 'CFA', fullName: 'Chartered Financial Analyst', duration: '2–4 years',
    category: 'professional_cert', specializations: ['Investment Analysis', 'Portfolio Management', 'Equity Research'],
    entranceExams: ['ca-foundation'], eligibility: 'Graduation / Final year',
    careers: ['Investment Analyst', 'Portfolio Manager', 'Equity Researcher', 'Hedge Fund'],
    salaryRange: '8–50+ LPA', color: '#4F46E5', icon: '📉',
  },

  // ════════════════════════════════════════════
  // DEFENCE / UNIFORMED SERVICES
  // ════════════════════════════════════════════

  {
    id: 'nda-program', degree: 'NDA', fullName: 'National Defence Academy', duration: '3 years + 1 year training',
    category: 'defence', specializations: ['Army', 'Navy', 'Air Force'],
    entranceExams: ['nda'], eligibility: 'Class XII (unmarried, 16.5–19.5 years)',
    careers: ['Army Officer', 'Navy Officer', 'Air Force Officer'], salaryRange: '8–15+ LPA', color: '#1D4ED8', icon: '🎖️',
  },
  {
    id: 'ina-program', degree: 'Indian Naval Academy', fullName: 'Indian Naval Academy (10+2 B.Tech Cadet Entry)',
    duration: '4 years', category: 'defence', specializations: ['Executive', 'Engineering'],
    entranceExams: ['nda'], eligibility: 'Class XII (PCM)',
    careers: ['Naval Officer', 'Submarine Officer'], salaryRange: '8–15+ LPA', color: '#0891B2', icon: '⚓',
  },
  {
    id: 'airforce', degree: 'Air Force Academy', fullName: 'Air Force Academy (Flying/Tech/Ground Duty)',
    duration: '1.5 years training', category: 'defence', specializations: ['Flying', 'Technical', 'Ground Duty'],
    entranceExams: ['afcat', 'nda'], eligibility: 'Class XII / Graduation',
    careers: ['Fighter Pilot', 'Technical Officer', 'Admin Officer'], salaryRange: '8–18+ LPA', color: '#0891B2', icon: '✈️',
  },
  {
    id: 'coastguard', degree: 'Coast Guard', fullName: 'Indian Coast Guard',
    duration: 'Training varies', category: 'defence', specializations: ['General Duty', 'Technical', 'Pilot'],
    entranceExams: ['nda'], eligibility: 'Class XII (PCM)',
    careers: ['Coast Guard Officer', 'Maritime Security'], salaryRange: '6–12 LPA', color: '#059669', icon: '🚢',
  },

  // ════════════════════════════════════════════
  // AVIATION & ALLIED ACADEMIES
  // ════════════════════════════════════════════

  {
    id: 'cpl', degree: 'CPL', fullName: 'Commercial Pilot License',
    duration: '18–24 months', category: 'aviation',
    specializations: ['Single Engine', 'Multi Engine', 'Instrument Rating', 'Night Rating', 'Float Rating'],
    entranceExams: ['dgca-cpl', 'igrua-entrance'],
    eligibility: 'Class XII (PCM, 50%+), DGCA Class 1 Medical Certificate, minimum age 17',
    careers: ['Commercial Pilot (Airlines)', 'Charter Pilot', 'Corporate Aviation', 'Flight Instructor', 'Bush Pilot'],
    salaryRange: '12–40+ LPA', color: '#0891B2', icon: '✈️',
  },
  {
    id: 'atpl', degree: 'ATPL', fullName: 'Airline Transport Pilot License',
    duration: '3–5 years (after CPL + flight hours)', category: 'aviation',
    specializations: ['Wide-body Aircraft', 'Narrow-body Aircraft', 'Turboprop', 'Type Rating (A320/B737/B777)'],
    entranceExams: ['dgca-atpl'],
    eligibility: 'CPL holder with 1,500+ flying hours, DGCA Class 1 Medical',
    careers: ['Airline Captain', 'Senior First Officer', 'Check Pilot', 'Chief Pilot'],
    salaryRange: '25–80+ LPA', color: '#1D4ED8', icon: '🛩️',
  },
  {
    id: 'ame', degree: 'AME', fullName: 'Aircraft Maintenance Engineering',
    duration: '3 years (training) + 2 years (apprenticeship)', category: 'aviation',
    specializations: ['Airframe', 'Powerplant (Engine)', 'Avionics', 'Helicopter Maintenance', 'Composite Repair'],
    entranceExams: ['dgca-ame'],
    eligibility: 'Class XII (PCM, 50%+)',
    careers: ['Aircraft Maintenance Engineer', 'Airline Maintenance (MRO)', 'HAL / DRDO', 'Airport Authority', 'Defence Maintenance'],
    salaryRange: '6–20 LPA', color: '#D97706', icon: '🔧',
  },
  {
    id: 'bsc-aviation', degree: 'B.Sc Aviation', fullName: 'Bachelor of Science in Aviation',
    duration: '3 years', category: 'aviation',
    specializations: ['Aviation Management', 'Airport Operations', 'Airline Operations', 'Aviation Safety', 'Air Cargo Management'],
    entranceExams: ['imu-cet', 'cuet-ug', 'igrua-entrance'],
    eligibility: 'Class XII (PCM preferred)',
    careers: ['Airport Manager', 'Airline Operations', 'Aviation Safety Officer', 'Air Cargo Manager', 'Flight Dispatcher'],
    salaryRange: '4–12 LPA', color: '#7C3AED', icon: '🛫',
  },
  {
    id: 'cabin-crew', degree: 'Cabin Crew / Air Hostess', fullName: 'Cabin Crew Training & Certification',
    duration: '6–12 months', category: 'aviation',
    specializations: ['International Airlines', 'Domestic Airlines', 'Private Jets', 'In-flight Service Management'],
    entranceExams: ['nchm-jee'],
    eligibility: 'Class XII (any stream), 157cm+ height (F), 170cm+ (M), DGCA medical',
    careers: ['Cabin Crew', 'Senior Cabin Crew', 'Purser', 'In-flight Manager', 'Ground Hostess'],
    salaryRange: '5–15 LPA', color: '#EC4899', icon: '💺',
  },
  {
    id: 'atc', degree: 'ATC', fullName: 'Air Traffic Controller Training',
    duration: '2–3 years', category: 'aviation',
    specializations: ['Area Control', 'Approach Control', 'Tower Control', 'Radar Control'],
    entranceExams: ['cuet-ug'],
    eligibility: 'B.Sc (PCM) or B.Tech + AAI recruitment exam',
    careers: ['Air Traffic Controller (AAI)', 'Airport Authority of India', 'Defence ATC'],
    salaryRange: '8–20 LPA', color: '#7C3AED', icon: '📡',
  },
  {
    id: 'airport-mgmt', degree: 'Airport Management', fullName: 'Diploma/Degree in Airport Management',
    duration: '1–3 years', category: 'aviation',
    specializations: ['Terminal Operations', 'Ground Handling', 'Cargo Operations', 'Aviation Security', 'Passenger Services'],
    entranceExams: ['nchm-jee', 'cuet-ug'],
    eligibility: 'Class XII (any stream)',
    careers: ['Airport Operations Manager', 'Ground Handling Executive', 'Aviation Security', 'Airline Ground Staff'],
    salaryRange: '3–10 LPA', color: '#059669', icon: '🏗️',
  },
  {
    id: 'drone-pilot', degree: 'Drone Pilot Certification', fullName: 'DGCA Remote Pilot Certificate',
    duration: '3–6 months', category: 'aviation',
    specializations: ['Small Category', 'Medium Category', 'Large Category', 'Agricultural Drones', 'Survey & Mapping', 'Delivery Drones'],
    entranceExams: ['dgca-cpl'],
    eligibility: 'Class X (minimum), 18+ years, DGCA online test',
    careers: ['Drone Pilot', 'Aerial Surveyor', 'Agriculture Drone Operator', 'Film/Media Drone Pilot', 'Drone Instructor'],
    salaryRange: '4–15 LPA', color: '#0D9488', icon: '🚁',
  },
  {
    id: 'mba-aviation', degree: 'MBA Aviation', fullName: 'MBA in Aviation Management',
    duration: '2 years (after graduation)', category: 'aviation',
    specializations: ['Airline Management', 'Airport Management', 'Aviation Finance', 'Aviation Safety & Security', 'MRO Management'],
    entranceExams: ['ipmat', 'cuet-ug', 'set-general'],
    eligibility: 'Graduation (any discipline)',
    careers: ['Aviation CEO/COO', 'Airline Strategy', 'Airport Business Development', 'Aviation Consultant'],
    salaryRange: '10–30+ LPA', color: '#1D4ED8', icon: '📊',
  },

  // ════════════════════════════════════════════
  // GOVERNMENT JOB CAREER PATHWAYS
  // ════════════════════════════════════════════

  {
    id: 'upsc-civil-services', degree: 'UPSC Civil Services', fullName: 'Indian Administrative Service / Indian Police Service / Indian Foreign Service',
    duration: '1–3 years prep (after graduation)', category: 'govt_job',
    specializations: ['IAS (Administration)', 'IPS (Police)', 'IFS (Foreign Service)', 'IRS (Revenue)', 'IRTS (Railway Traffic)', 'IAAS (Audit & Accounts)', 'IPoS (Postal)', 'IIS (Information Service)'],
    entranceExams: ['upsc-cse'], eligibility: 'Graduation (any discipline), 21–32 yrs',
    careers: ['District Collector', 'SP/DIG/IG', 'Ambassador', 'Joint Secretary', 'Cabinet Secretary'],
    salaryRange: '10–25+ LPA (+ perks: housing, car, security)', color: '#1D4ED8', icon: '🏛️',
  },
  {
    id: 'ssc-group-b-c', degree: 'SSC Posts (Group B & C)', fullName: 'Central Government Group B & C Posts via SSC',
    duration: '6–18 months prep', category: 'govt_job',
    specializations: ['CGL (Income Tax / Customs / CBI / Auditor / Assistant)', 'CHSL (LDC / DEO / Postal)', 'MTS (Multi-Tasking Staff)', 'GD Constable (BSF/CISF/CRPF)', 'Junior Engineer', 'Stenographer'],
    entranceExams: ['ssc-cgl', 'ssc-chsl', 'ssc-mts', 'ssc-gd', 'ssc-je'], eligibility: 'Class X to Graduation (varies by post)',
    careers: ['Income Tax Inspector', 'Customs Inspector', 'CBI Sub-Inspector', 'Postal Assistant', 'Auditor (CAG)', 'CISF/BSF Constable'],
    salaryRange: '2.5–8 LPA (7th Pay Commission)', color: '#DC2626', icon: '📝',
  },
  {
    id: 'banking-career', degree: 'Banking Career', fullName: 'Public Sector Bank Officer / Clerk / Specialist',
    duration: '6–12 months prep', category: 'govt_job',
    specializations: ['PO (Probationary Officer)', 'Clerk / Junior Associate', 'SO (Specialist Officer — IT/Law/HR/Agriculture/Marketing)', 'RBI Grade B', 'RBI Assistant', 'NABARD Grade A', 'SEBI Grade A'],
    entranceExams: ['ibps-po', 'ibps-clerk', 'sbi-po', 'sbi-clerk', 'rbi-grade-b', 'rbi-assistant', 'nabard-grade-a', 'sebi-grade-a'],
    eligibility: 'Graduation (any discipline), 20–30 yrs',
    careers: ['Bank PO', 'Branch Manager', 'Regional Manager', 'RBI Officer', 'NABARD Officer', 'SEBI Officer'],
    salaryRange: '5–20 LPA (7th CPC + allowances)', color: '#4F46E5', icon: '🏦',
  },
  {
    id: 'railways-career', degree: 'Railway Career', fullName: 'Indian Railways — Technical & Non-Technical Posts',
    duration: '3–12 months prep', category: 'govt_job',
    specializations: ['NTPC (Station Master / Goods Guard / Clerk)', 'Group D (Track Maintainer / Helper)', 'Junior Engineer (Civil/Mech/Elec)', 'ALP (Assistant Loco Pilot)', 'RPF (Railway Protection Force)'],
    entranceExams: ['rrb-ntpc', 'rrb-group-d', 'rrb-je', 'rrb-alp'], eligibility: 'Class X to B.Tech (varies by post)',
    careers: ['Station Master', 'Goods Guard', 'Loco Pilot', 'Railway Engineer', 'RPF Sub-Inspector'],
    salaryRange: '2.5–10 LPA (7th CPC)', color: '#D97706', icon: '🚆',
  },
  {
    id: 'state-govt-career', degree: 'State Government Services', fullName: 'State Administrative / Police / Judicial Services via State PSC',
    duration: '1–2 years prep', category: 'govt_job',
    specializations: ['State Administrative Service (SDM/BDO/Tehsildar)', 'State Police Service (DSP)', 'State Revenue Service', 'State Education Service', 'Block Development Officer', 'Food & Civil Supplies Officer'],
    entranceExams: ['state-psc'], eligibility: 'Graduation (any discipline), age varies by state',
    careers: ['Deputy Collector', 'DSP', 'BDO', 'Tehsildar', 'State Tax Officer'],
    salaryRange: '6–18 LPA (State Pay Scale)', color: '#7C3AED', icon: '🏛️',
  },
  {
    id: 'teaching-career', degree: 'Government Teaching', fullName: 'Central & State Government Teaching Posts',
    duration: '6–12 months prep', category: 'govt_job',
    specializations: ['PGT (Post Graduate Teacher)', 'TGT (Trained Graduate Teacher)', 'PRT (Primary Teacher)', 'KVS Teacher', 'NVS Teacher', 'Army School Teacher', 'DSSSB Teacher', 'Assistant Professor (UGC NET/SET)'],
    entranceExams: ['ctet', 'ugc-net', 'kvs-pgt-tgt'], eligibility: 'D.El.Ed / B.Ed + Graduation/Post-graduation',
    careers: ['KVS Teacher', 'NVS Teacher', 'State Govt Teacher', 'University Professor'],
    salaryRange: '4–15 LPA (7th CPC)', color: '#059669', icon: '📚',
  },
  {
    id: 'insurance-career', degree: 'Insurance & Financial Services', fullName: 'LIC / NIACL / UIIC — Officer & Assistant Posts',
    duration: '3–6 months prep', category: 'govt_job',
    specializations: ['LIC AAO (Generalist/IT/CA/Actuarial)', 'NIACL AO', 'UIIC AO', 'LIC Assistant', 'GIC Scale I'],
    entranceExams: ['lic-aao', 'niacl-ao'], eligibility: 'Graduation (any discipline), 21–30 yrs',
    careers: ['LIC AAO', 'Insurance Officer', 'Branch Manager (LIC)', 'Divisional Manager'],
    salaryRange: '5–15 LPA', color: '#0891B2', icon: '🏢',
  },
  {
    id: 'defence-career-post-grad', degree: 'Defence Services (Post-Graduation Entry)', fullName: 'Indian Armed Forces via CDS / CAPF / Coast Guard',
    duration: '6–12 months prep', category: 'govt_job',
    specializations: ['Army (IMA Dehradun)', 'Navy (INA Ezhimala)', 'Air Force (AFA Dundigal)', 'OTA Chennai', 'CAPF (BSF/CRPF/CISF/ITBP AC)', 'Coast Guard'],
    entranceExams: ['upsc-cds', 'upsc-capf', 'afcat'], eligibility: 'Graduation (any discipline), unmarried',
    careers: ['Army Officer', 'Navy Officer', 'Air Force Officer', 'CAPF Assistant Commandant'],
    salaryRange: '8–20+ LPA (+ perks)', color: '#1D4ED8', icon: '🎖️',
  },
  {
    id: 'judicial-career', degree: 'Judicial Services', fullName: 'State Judiciary — Civil Judge / Judicial Magistrate',
    duration: '1–2 years prep', category: 'govt_job',
    specializations: ['Civil Judge (Junior Division)', 'Judicial Magistrate First Class', 'Higher Judicial Service (District Judge)'],
    entranceExams: ['judicial-services'], eligibility: 'LLB degree, enrolled as Advocate',
    careers: ['Civil Judge', 'Magistrate', 'District Judge', 'High Court Judge'],
    salaryRange: '8–25+ LPA', color: '#B45309', icon: '⚖️',
  },
]

/* ═══════════════════════════════════════════════════════════════
   §3  UTILITY HELPERS
   ═══════════════════════════════════════════════════════════════ */

export function getExamById(id: string): EntranceExam | undefined {
  return ENTRANCE_EXAMS.find(e => e.id === id)
}

export function getExamsForDegree(degreeId: string): EntranceExam[] {
  const program = DEGREE_PROGRAMS.find(d => d.id === degreeId)
  if (!program) return []
  return program.entranceExams.map(id => ENTRANCE_EXAMS.find(e => e.id === id)).filter(Boolean) as EntranceExam[]
}

export function getDegreesForExam(examId: string): DegreeProgram[] {
  return DEGREE_PROGRAMS.filter(d => d.entranceExams.includes(examId))
}

export const CATEGORY_LABELS: Record<DegreeProgram['category'], { label: string; icon: string; color: string }> = {
  bachelors_3yr: { label: "Bachelor's (3 Year)", icon: '🎓', color: '#7C3AED' },
  bachelors_4_5yr: { label: "Bachelor's (4–5 Year / Professional)", icon: '🏛️', color: '#4F46E5' },
  integrated_5yr: { label: 'Integrated (5 Year)', icon: '🔗', color: '#1D4ED8' },
  diploma: { label: 'Diploma / Certificate', icon: '📜', color: '#D97706' },
  professional_cert: { label: 'Professional Certifications', icon: '🏅', color: '#B45309' },
  defence: { label: 'Defence / Uniformed Services', icon: '🎖️', color: '#059669' },
  aviation: { label: 'Aviation & Allied Academies', icon: '✈️', color: '#0891B2' },
  govt_job: { label: 'Government Job Exams', icon: '🏛️', color: '#DC2626' },
}

/* ═══════════════════════════════════════════════════════════════
   §4  GRADE-LEVEL FOUNDATION PREP PATHWAYS
   ═══════════════════════════════════════════════════════════════
   Links school syllabus to future exam preparation.
   A student in Class 6 can start building foundations for UPSC/Banking/SSC.
   ═══════════════════════════════════════════════════════════════ */

export interface PrepPathway {
  id: string
  name: string
  targetExams: string[]
  icon: string
  color: string
  levels: {
    grade: string
    focus: string
    topics: string[]
    hoursPerWeek: number
  }[]
}

export const PREP_PATHWAYS: PrepPathway[] = [
  {
    id: 'upsc-pathway', name: 'UPSC Civil Services Pathway', targetExams: ['upsc-cse', 'state-psc'],
    icon: '🏛️', color: '#1D4ED8',
    levels: [
      { grade: 'Class 6–8', focus: 'Foundation Building', topics: ['NCERT History & Geography', 'Map Reading', 'Indian Constitution Basics', 'Current Events Weekly', 'English Comprehension', 'Essay Writing Basics'], hoursPerWeek: 3 },
      { grade: 'Class 9–10', focus: 'Pre-Foundation', topics: ['NCERT Polity & Economics', 'Ancient + Medieval India', 'Physical & Human Geography', 'Newspaper Reading Habit', 'Answer Writing Introduction', 'General Science'], hoursPerWeek: 5 },
      { grade: 'Class 11–12', focus: 'Foundation Course', topics: ['Indian Polity (Laxmikanth level)', 'Modern Indian History', 'Indian Economy Basics', 'Art & Culture', 'Ethics Case Studies', 'CSAT Aptitude', 'Optional Subject Exploration'], hoursPerWeek: 8 },
      { grade: 'Graduation (Year 1–3)', focus: 'Serious Preparation', topics: ['Full General Studies Coverage', 'Optional Subject Mastery', 'Answer Writing Daily Practice', 'Current Affairs 360°', 'Mock Tests Monthly', 'Interview Preparation'], hoursPerWeek: 15 },
      { grade: 'Post-Graduation / Dedicated Prep', focus: 'Exam-Ready', topics: ['Full-Length Mocks Weekly', 'Previous Year Analysis (30 yrs)', 'Mains Answer Evaluation', 'Essay Practice', 'Personality Test Prep'], hoursPerWeek: 40 },
    ],
  },
  {
    id: 'banking-pathway', name: 'Banking & Finance Pathway', targetExams: ['ibps-po', 'sbi-po', 'rbi-grade-b', 'nabard-grade-a', 'sebi-grade-a'],
    icon: '🏦', color: '#4F46E5',
    levels: [
      { grade: 'Class 8–10', focus: 'Numeracy Foundation', topics: ['Speed Maths', 'Percentage / Ratio / Profit-Loss', 'Basic Reasoning (Puzzles, Coding)', 'English Grammar & Vocabulary', 'Banking GK Introduction'], hoursPerWeek: 3 },
      { grade: 'Class 11–12', focus: 'Pre-Banking Foundation', topics: ['Data Interpretation', 'Advanced Reasoning (Seating, Blood Relations)', 'English RC & Cloze Tests', 'Economics Basics', 'Computer Fundamentals', 'Banking Awareness Monthly'], hoursPerWeek: 5 },
      { grade: 'Graduation (Year 1–3)', focus: 'Full Banking Prep', topics: ['Quantitative Aptitude Complete', 'Reasoning Complete', 'English Language Complete', 'Banking + Financial Awareness', 'Computer Knowledge', 'Mock Tests Weekly'], hoursPerWeek: 12 },
    ],
  },
  {
    id: 'ssc-pathway', name: 'SSC Pathway (CGL/CHSL/MTS)', targetExams: ['ssc-cgl', 'ssc-chsl', 'ssc-mts', 'ssc-gd'],
    icon: '📝', color: '#DC2626',
    levels: [
      { grade: 'Class 8–10', focus: 'Foundation', topics: ['Basic Maths (Arithmetic, Algebra, Geometry)', 'Reasoning (Series, Analogy, Classification)', 'English Grammar Basics', 'GK (History, Polity, Science)', 'Hindi Comprehension'], hoursPerWeek: 3 },
      { grade: 'Class 11–12', focus: 'Intermediate Prep', topics: ['Advanced Maths (Trigonometry, Mensuration)', 'Advanced Reasoning', 'English Vocabulary & Idioms', 'Static GK Deep Dive', 'Current Affairs Weekly'], hoursPerWeek: 5 },
      { grade: 'After Class 12 / Graduation', focus: 'Exam-Ready', topics: ['Full Maths Syllabus Speed Practice', 'Complete Reasoning', 'English Language Full', 'GK + Current Affairs', 'Previous Year Papers (20 yrs)', 'Mock Tests Daily'], hoursPerWeek: 20 },
    ],
  },
  {
    id: 'railway-pathway', name: 'Railways Pathway (NTPC/Group D/JE/ALP)', targetExams: ['rrb-ntpc', 'rrb-group-d', 'rrb-je', 'rrb-alp'],
    icon: '🚆', color: '#D97706',
    levels: [
      { grade: 'Class 8–10', focus: 'Foundation', topics: ['Basic Maths', 'General Science (Physics, Chemistry, Biology)', 'Reasoning Introduction', 'Railway GK Basics', 'English / Hindi Reading'], hoursPerWeek: 3 },
      { grade: 'Class 10 + ITI / Diploma', focus: 'Technical Foundation', topics: ['Trade-specific Knowledge', 'Applied Maths', 'General Science Advanced', 'Current Affairs', 'Computer Basics'], hoursPerWeek: 6 },
      { grade: 'After Class 12 / Graduation', focus: 'Exam-Ready', topics: ['Full Maths + Science', 'Reasoning Complete', 'Railway-specific GK', 'Mock Tests', 'Previous Year Papers', 'CBT Practice'], hoursPerWeek: 15 },
    ],
  },
  {
    id: 'defence-pathway', name: 'Defence Services Pathway', targetExams: ['nda', 'upsc-cds', 'afcat', 'upsc-capf'],
    icon: '🎖️', color: '#059669',
    levels: [
      { grade: 'Class 6–8', focus: 'Physical + Mental Foundation', topics: ['Physical Fitness Routine', 'GK (World Geography, Indian History)', 'Basic Mathematics', 'English Speaking', 'Team Sports & Leadership'], hoursPerWeek: 4 },
      { grade: 'Class 9–10', focus: 'NDA Foundation', topics: ['NDA-level Maths', 'GAT (General Ability Test) Prep', 'English Comprehension', 'Science & Technology GK', 'SSB Interview Awareness', 'Physical Training'], hoursPerWeek: 6 },
      { grade: 'Class 11–12', focus: 'NDA / CDS Ready', topics: ['NDA Maths Complete', 'History, Polity, Geography', 'Physics & Chemistry Basics', 'English Language Complete', 'Mock NDA Papers', 'Physical Fitness Assessment'], hoursPerWeek: 10 },
      { grade: 'Graduation', focus: 'CDS / CAPF / AFCAT', topics: ['CDS Full Syllabus', 'OTA / IMA Preparation', 'AFCAT Full Syllabus', 'CAPF AC Preparation', 'SSB Interview Complete Course', 'Physical Training Advanced'], hoursPerWeek: 12 },
    ],
  },
  {
    id: 'teaching-pathway', name: 'Government Teaching Pathway', targetExams: ['ctet', 'ugc-net', 'kvs-pgt-tgt'],
    icon: '📚', color: '#059669',
    levels: [
      { grade: 'Class 11–12', focus: 'Foundation', topics: ['Subject Mastery (choose your teaching subject)', 'Child Psychology Introduction', 'Education Theory Basics', 'English Communication'], hoursPerWeek: 3 },
      { grade: 'B.Ed / D.El.Ed', focus: 'Pedagogy Mastery', topics: ['Child Development & Pedagogy', 'Teaching Methodology', 'Subject-specific Pedagogy', 'Inclusive Education', 'ICT in Education', 'CTET Practice'], hoursPerWeek: 10 },
      { grade: 'Post B.Ed', focus: 'Exam-Ready', topics: ['CTET Full Mock Tests', 'KVS / NVS / DSSSB Prep', 'State TET Prep', 'UGC NET (for Assistant Professor)'], hoursPerWeek: 15 },
    ],
  },
  {
    id: 'judicial-pathway', name: 'Judicial Services Pathway', targetExams: ['judicial-services'],
    icon: '⚖️', color: '#B45309',
    levels: [
      { grade: 'Class 11–12', focus: 'Legal Awareness', topics: ['Indian Constitution Basics', 'Fundamental Rights', 'Legal Terminology', 'Famous Judgments Introduction', 'Logical Reasoning'], hoursPerWeek: 2 },
      { grade: 'LLB (3 yr / 5 yr)', focus: 'Law Mastery', topics: ['IPC, CrPC, CPC', 'Evidence Act', 'Constitutional Law', 'Contract Act', 'Jurisprudence', 'Legal Reasoning', 'Moot Court'], hoursPerWeek: 8 },
      { grade: 'Post-LLB', focus: 'Judicial Service Prep', topics: ['State-specific Judiciary Exam Prep', 'Judgment Writing', 'Case Analysis', 'Mock Tests', 'Previous Year Papers by State'], hoursPerWeek: 20 },
    ],
  },
]

/** Summary stats */
export const CATALOG_STATS = {
  totalPrograms: DEGREE_PROGRAMS.length,
  totalSpecializations: DEGREE_PROGRAMS.reduce((sum, d) => sum + d.specializations.length, 0),
  totalEntranceExams: ENTRANCE_EXAMS.length,
  categories: Object.keys(CATEGORY_LABELS).length,
}
