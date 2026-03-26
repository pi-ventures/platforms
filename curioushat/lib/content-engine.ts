/**
 * CuriousHat Content Interpretation Engine
 * ─────────────────────────────────────────
 * Patent-pending system for ingesting educational source material from
 * public digital libraries (NDLI, CBSE, state boards), processing via
 * Smart OCR, and generating original AI-interpreted chapter-wise content
 * with full source attribution.
 *
 * Pipeline:  Source Discovery → Ingestion → Smart OCR → Structure Extraction
 *            → AI Interpretation → Quality Scoring → Multi-language Gen → Publish
 *
 * Key Innovation:
 *   The system does NOT copy source material. It reads, understands, and
 *   produces original educational interpretations at multiple difficulty
 *   levels — similar to how a teacher reads a textbook and then explains
 *   the concepts in their own words, with examples and analogies.
 *
 * (c) CuriousHat.ai — All rights reserved.
 */

/* ═══════════════════════════════════════════════════════════════
   §1  CONTENT SOURCES
   ═══════════════════════════════════════════════════════════════ */

export type SourceType =
  | 'ndli'          // National Digital Library of India (ndl.iitkgp.ac.in)
  | 'ncert'         // NCERT textbooks (ncert.nic.in)
  | 'cbse'          // CBSE curriculum portal
  | 'epathshala'    // ePathshala (NCERT digital platform)
  | 'diksha'        // DIKSHA (diksha.gov.in — national school platform)
  | 'nios'          // National Institute of Open Schooling
  | 'state_board'   // State board digital libraries
  | 'ugc'           // University Grants Commission
  | 'swayam'        // SWAYAM MOOCs (swayam.gov.in)
  | 'manual_upload' // Publisher-provided or manually digitised

export interface ContentSource {
  id: string
  type: SourceType
  name: string
  url: string
  description: string
  /** License under which the source material is available */
  license: 'open_access' | 'creative_commons' | 'govt_open_data' | 'fair_use_educational' | 'publisher_agreement'
  /** Whether automated ingestion is supported */
  autoIngest: boolean
  /** API or scraping method */
  accessMethod: 'api' | 'oai_pmh' | 'web_scrape' | 'bulk_download' | 'manual'
  /** Languages available at source */
  languages: string[]
  /** Content types available */
  contentTypes: ('textbook' | 'reference' | 'question_paper' | 'notes' | 'video_transcript' | 'lab_manual')[]
  status: 'active' | 'pending_agreement' | 'deprecated'
}

/** Pre-configured Indian educational content sources */
export const CONTENT_SOURCES: ContentSource[] = [
  {
    id: 'ndli-main',
    type: 'ndli',
    name: 'National Digital Library of India',
    url: 'https://ndl.iitkgp.ac.in',
    description: 'IIT Kharagpur hosted national repository — 7.3 crore+ academic resources across all disciplines and levels',
    license: 'open_access',
    autoIngest: true,
    accessMethod: 'oai_pmh',
    languages: ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Odia', 'Punjabi', 'Urdu'],
    contentTypes: ['textbook', 'reference', 'notes', 'question_paper'],
    status: 'active',
  },
  {
    id: 'ncert-textbooks',
    type: 'ncert',
    name: 'NCERT Textbooks',
    url: 'https://ncert.nic.in/textbook.php',
    description: 'Official NCERT textbooks for Class I–XII across all subjects — freely downloadable PDFs',
    license: 'govt_open_data',
    autoIngest: true,
    accessMethod: 'web_scrape',
    languages: ['English', 'Hindi', 'Urdu'],
    contentTypes: ['textbook'],
    status: 'active',
  },
  {
    id: 'epathshala',
    type: 'epathshala',
    name: 'ePathshala',
    url: 'https://epathshala.nic.in',
    description: 'NCERT digital platform — textbooks, audio, video, and interactive content for Classes I–XII',
    license: 'govt_open_data',
    autoIngest: true,
    accessMethod: 'api',
    languages: ['English', 'Hindi'],
    contentTypes: ['textbook', 'notes', 'video_transcript'],
    status: 'active',
  },
  {
    id: 'diksha',
    type: 'diksha',
    name: 'DIKSHA',
    url: 'https://diksha.gov.in',
    description: 'National platform for school education — energised textbooks, teacher training, assessments',
    license: 'govt_open_data',
    autoIngest: true,
    accessMethod: 'api',
    languages: ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati', 'Malayalam', 'Odia', 'Punjabi', 'Assamese', 'Urdu'],
    contentTypes: ['textbook', 'notes', 'question_paper'],
    status: 'active',
  },
  {
    id: 'nios',
    type: 'nios',
    name: 'National Institute of Open Schooling',
    url: 'https://nios.ac.in',
    description: 'Open schooling study materials for secondary and senior secondary — self-paced learning content',
    license: 'govt_open_data',
    autoIngest: true,
    accessMethod: 'web_scrape',
    languages: ['English', 'Hindi'],
    contentTypes: ['textbook', 'notes', 'question_paper'],
    status: 'active',
  },
  {
    id: 'cbse-academic',
    type: 'cbse',
    name: 'CBSE Academic Portal',
    url: 'https://cbseacademic.nic.in',
    description: 'CBSE curriculum documents, sample papers, marking schemes, and teacher manuals',
    license: 'govt_open_data',
    autoIngest: true,
    accessMethod: 'web_scrape',
    languages: ['English', 'Hindi'],
    contentTypes: ['question_paper', 'notes'],
    status: 'active',
  },
  {
    id: 'swayam',
    type: 'swayam',
    name: 'SWAYAM',
    url: 'https://swayam.gov.in',
    description: 'MOOC platform by Govt of India — UG/PG courses from IITs, IIMs, central universities',
    license: 'govt_open_data',
    autoIngest: false,
    accessMethod: 'api',
    languages: ['English', 'Hindi'],
    contentTypes: ['video_transcript', 'notes', 'reference'],
    status: 'pending_agreement',
  },
  {
    id: 'state-ap', type: 'state_board', name: 'Andhra Pradesh SCERT', url: 'https://scert.ap.gov.in',
    description: 'AP state board textbooks and teacher handbooks', license: 'govt_open_data',
    autoIngest: true, accessMethod: 'web_scrape', languages: ['English', 'Telugu'],
    contentTypes: ['textbook'], status: 'active',
  },
  {
    id: 'state-tn', type: 'state_board', name: 'Tamil Nadu Textbook Corp', url: 'https://textbooksonline.tn.nic.in',
    description: 'TN state board textbooks — all classes and subjects', license: 'govt_open_data',
    autoIngest: true, accessMethod: 'web_scrape', languages: ['English', 'Tamil'],
    contentTypes: ['textbook'], status: 'active',
  },
  {
    id: 'state-kr', type: 'state_board', name: 'Karnataka DSERT', url: 'https://dsert.kar.nic.in',
    description: 'Karnataka state board textbooks and curriculum guides', license: 'govt_open_data',
    autoIngest: true, accessMethod: 'web_scrape', languages: ['English', 'Kannada'],
    contentTypes: ['textbook'], status: 'active',
  },
  {
    id: 'state-mh', type: 'state_board', name: 'Maharashtra Balbharati', url: 'https://ebalbharati.in',
    description: 'Maharashtra state board textbooks published by Balbharati', license: 'govt_open_data',
    autoIngest: true, accessMethod: 'web_scrape', languages: ['English', 'Marathi', 'Hindi', 'Urdu', 'Gujarati'],
    contentTypes: ['textbook'], status: 'active',
  },
  {
    id: 'state-kr-2', type: 'state_board', name: 'Kerala SCERT', url: 'https://scert.kerala.gov.in',
    description: 'Kerala state board textbooks and teacher resources', license: 'govt_open_data',
    autoIngest: true, accessMethod: 'web_scrape', languages: ['English', 'Malayalam'],
    contentTypes: ['textbook'], status: 'active',
  },
]

/* ═══════════════════════════════════════════════════════════════
   §2  SMART OCR PIPELINE
   ═══════════════════════════════════════════════════════════════ */

export type OCREngine = 'tesseract' | 'google_vision' | 'azure_di' | 'curioushat_edu_ocr'

export type ContentElementType =
  | 'paragraph'
  | 'heading'
  | 'math_formula'      // detected via LaTeX / MathML patterns
  | 'chemical_equation'  // balanced equations with subscripts
  | 'diagram'            // figures, charts, labelled diagrams
  | 'table'              // structured tabular data
  | 'code_snippet'       // programming examples
  | 'definition_box'     // highlighted definitions
  | 'example'            // worked-out examples
  | 'exercise'           // end-of-chapter questions
  | 'timeline'           // historical timelines
  | 'map'                // geographical maps
  | 'quote'              // block quotes, verses, poems

export interface OCRElement {
  type: ContentElementType
  /** Raw text extracted by OCR */
  rawText: string
  /** LaTeX representation for math/chem formulas */
  latex?: string
  /** Bounding box in source page [x, y, width, height] normalised 0–1 */
  bbox: [number, number, number, number]
  /** OCR confidence score 0–1 */
  confidence: number
  /** Page number in source document */
  pageNumber: number
  /** Alt-text for diagrams (AI-generated description) */
  altText?: string
}

export interface OCRResult {
  documentId: string
  sourceId: string
  engine: OCREngine
  /** Total pages processed */
  totalPages: number
  /** Extracted structural elements */
  elements: OCRElement[]
  /** Overall quality score 0–100 */
  qualityScore: number
  /** Processing time in ms */
  processingTimeMs: number
  /** Detected language */
  detectedLanguage: string
  /** Detected subject from content analysis */
  detectedSubject: string
  /** Detected class/grade level */
  detectedLevel: string
  processedAt: string
}

/** CuriousHat Smart Educational OCR — patent-pending features */
export const SMART_OCR_CAPABILITIES = [
  'Mathematical formula detection and LaTeX conversion',
  'Chemical equation parsing with subscript/superscript handling',
  'Diagram recognition with AI-generated alt-text descriptions',
  'Table structure extraction preserving row/column relationships',
  'Definition box and highlight detection',
  'Worked example identification and step extraction',
  'Exercise/question detection with difficulty classification',
  'Multi-column layout understanding',
  'Handwritten text recognition (for scanned notebooks)',
  'Multi-script support (Devanagari, Tamil, Telugu, Bengali, etc.)',
  'Page header/footer and noise removal',
  'Cross-reference and citation linking',
] as const

/* ═══════════════════════════════════════════════════════════════
   §3  AI INTERPRETATION ENGINE
   ═══════════════════════════════════════════════════════════════ */

/**
 * The Interpretation Engine is the core IP of CuriousHat.
 *
 * It does NOT copy or paraphrase source material. Instead it:
 * 1. Reads and understands the educational concepts from OCR'd content
 * 2. Cross-references multiple sources for the same topic
 * 3. Generates ORIGINAL explanations at the appropriate difficulty level
 * 4. Adds analogies, examples, and mnemonics suited to Indian students
 * 5. Structures content chapter-wise aligned to the curriculum
 * 6. Generates content in multiple Indian languages
 *
 * This is analogous to a master teacher who reads 10 textbooks and then
 * writes their own teaching notes — the output is original work informed
 * by multiple sources, not a derivative of any single source.
 */

export type InterpretationLevel = 'elementary' | 'middle' | 'secondary' | 'higher_secondary' | 'competitive' | 'undergraduate'

export type InterpretationStyle =
  | 'conceptual'     // deep concept explanation with first-principles reasoning
  | 'visual'         // diagram-heavy, spatial learning
  | 'example_driven' // lots of worked examples
  | 'story_based'    // narrative/analogy-driven (best for younger students)
  | 'exam_focused'   // concise, formula-heavy, exam tips

export interface InterpretedChapter {
  chapterNumber: number
  title: string
  /** Original interpreted content — NOT copied from source */
  sections: InterpretedSection[]
  /** Key concepts extracted and explained originally */
  keyConcepts: string[]
  /** AI-generated summary in student-friendly language */
  summary: string
  /** Original analogies and mnemonics created by the engine */
  analogies: string[]
  /** Practice questions (original, not from source) */
  practiceQuestions: { question: string; answer: string; difficulty: 'easy' | 'medium' | 'hard' }[]
  /** Cross-references to related chapters in other subjects */
  crossReferences: { subject: string; chapter: string; relevance: string }[]
  /** Estimated reading time in minutes */
  readingTimeMin: number
  /** Estimated audio narration time in minutes */
  audioTimeMin: number
  /** Interpretation quality score 0–100 */
  qualityScore: number
}

export interface InterpretedSection {
  id: string
  heading: string
  /** Original interpreted content — written by AI in its own words */
  content: string
  /** Content type */
  type: 'explanation' | 'example' | 'diagram_description' | 'formula_derivation' | 'historical_context' | 'real_world_application' | 'experiment' | 'summary'
  /** Difficulty within the chapter (for progressive disclosure) */
  difficulty: 'foundation' | 'standard' | 'advanced'
  /** LaTeX formulas used in this section */
  formulas?: string[]
}

export interface InterpretedBook {
  id: string
  /** Original title given by CuriousHat */
  title: string
  /** Subject */
  subject: string
  /** Target class/grade */
  classLevel: string
  /** Board alignment */
  board: string
  /** Interpretation style used */
  style: InterpretationStyle
  /** Difficulty level */
  level: InterpretationLevel
  /** Language of interpretation */
  language: string
  /** All available language versions */
  availableLanguages: string[]
  /** Chapters */
  chapters: InterpretedChapter[]
  /** Full attribution chain */
  attribution: Attribution
  /** Pipeline metadata */
  pipeline: PipelineMetadata
  /** Content fingerprint for plagiarism check */
  contentHash: string
  /** Originality score from plagiarism checker (0–100, higher = more original) */
  originalityScore: number
  /** Publication status */
  status: 'draft' | 'in_review' | 'approved' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}

/* ═══════════════════════════════════════════════════════════════
   §4  ATTRIBUTION & LEGAL COMPLIANCE
   ═══════════════════════════════════════════════════════════════ */

export interface SourceReference {
  sourceId: string
  sourceName: string
  sourceType: SourceType
  /** Publisher / Institution */
  publisher: string
  /** Original author(s) */
  authors: string[]
  /** Original publication year */
  year: number
  /** ISBN / ISSN if available */
  isbn?: string
  /** License of source material */
  license: string
  /** URL where source is publicly available */
  publicUrl: string
  /** Specific pages/chapters referenced (NOT copied) */
  referencedSections: string[]
}

export interface Attribution {
  /** CuriousHat is the creator of the interpreted content */
  interpretedBy: 'CuriousHat.ai Interpretation Engine'
  /** Version of the interpretation engine */
  engineVersion: string
  /** Date of interpretation */
  interpretedAt: string
  /** Sources that were read and understood (NOT copied) */
  sourcesConsulted: SourceReference[]
  /** Legal disclaimer */
  disclaimer: string
  /** Originality statement */
  originalityStatement: string
}

/** Standard attribution disclaimer */
export const ATTRIBUTION_DISCLAIMER =
  'This content is an original educational interpretation created by CuriousHat.ai\'s ' +
  'AI Interpretation Engine. It is NOT a copy, reproduction, or derivative work of any ' +
  'source material. The interpretation engine reads and understands concepts from publicly ' +
  'available educational resources, then generates entirely original explanations, examples, ' +
  'and teaching material. Source references are provided for academic citation purposes only. ' +
  'All original content is (c) CuriousHat.ai.'

export const ORIGINALITY_STATEMENT =
  'CuriousHat.ai generates original educational content through AI interpretation. ' +
  'Each piece of content passes through automated plagiarism detection ensuring >85% ' +
  'originality score. The interpretation process is analogous to a teacher reading ' +
  'multiple textbooks and creating their own teaching notes — the output is original ' +
  'work informed by, but not derived from, any single source.'

/* ═══════════════════════════════════════════════════════════════
   §5  PIPELINE & PROCESSING
   ═══════════════════════════════════════════════════════════════ */

export type PipelineStage =
  | 'source_discovery'       // find content in source libraries
  | 'ingestion'              // download / fetch source material
  | 'ocr_processing'         // Smart OCR extraction
  | 'structure_extraction'   // identify chapters, sections, elements
  | 'concept_mapping'        // map concepts to curriculum standards
  | 'ai_interpretation'      // generate original interpreted content
  | 'cross_source_synthesis' // merge insights from multiple sources
  | 'originality_check'      // plagiarism detection
  | 'quality_review'         // AI + human quality scoring
  | 'multi_lang_generation'  // generate in all 23 scheduled languages
  | 'audio_generation'       // generate audiobook narration
  | 'publication'            // publish to student library

export type PipelineStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'needs_review'

export interface PipelineMetadata {
  pipelineId: string
  stages: { stage: PipelineStage; status: PipelineStatus; startedAt?: string; completedAt?: string; error?: string }[]
  currentStage: PipelineStage
  /** Total processing time across all stages in seconds */
  totalProcessingTimeSec: number
  /** Number of source documents consulted */
  sourcesConsulted: number
  /** OCR pages processed */
  ocrPagesProcessed: number
  /** AI tokens used for interpretation */
  aiTokensUsed: number
  /** Originality score after plagiarism check */
  originalityScore: number
}

/* ═══════════════════════════════════════════════════════════════
   §6  CURRICULUM STANDARDS ALIGNMENT
   ═══════════════════════════════════════════════════════════════ */

export interface CurriculumStandard {
  board: string
  class: string
  subject: string
  /** Chapter number in the board's curriculum */
  chapterNumber: number
  /** Topic title as defined by the board */
  topicTitle: string
  /** Learning outcomes as defined by the board */
  learningOutcomes: string[]
  /** Keywords that should be covered */
  keywords: string[]
}

/** Boards we align content to */
export const SUPPORTED_BOARDS = [
  'CBSE', 'ICSE',
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttarakhand', 'Uttar Pradesh', 'West Bengal',
] as const

/** 23 Indian (Eighth Schedule) + 20+ International languages */
export const SUPPORTED_LANGUAGES = {
  indian: [
    'English', 'Hindi', 'Assamese', 'Bengali', 'Bodo', 'Dogri', 'Gujarati',
    'Kannada', 'Kashmiri', 'Konkani', 'Maithili', 'Malayalam', 'Manipuri',
    'Marathi', 'Nepali', 'Odia', 'Punjabi', 'Sanskrit', 'Santali', 'Sindhi',
    'Tamil', 'Telugu', 'Urdu',
  ],
  international: [
    'French', 'Spanish', 'German', 'Mandarin Chinese', 'Japanese', 'Korean',
    'Arabic', 'Portuguese', 'Russian', 'Italian', 'Dutch', 'Swedish',
    'Turkish', 'Thai', 'Vietnamese', 'Indonesian', 'Malay', 'Persian',
    'Swahili', 'Polish', 'Greek', 'Hebrew',
  ],
} as const

/** Accreditation bodies for language + creative arts certifications */
export const CERTIFICATION_BODIES = {
  languages: [
    { name: 'DELF/DALF', language: 'French', body: 'France Education International' },
    { name: 'Goethe-Zertifikat', language: 'German', body: 'Goethe-Institut' },
    { name: 'JLPT', language: 'Japanese', body: 'Japan Foundation' },
    { name: 'HSK', language: 'Mandarin Chinese', body: 'Hanban / Confucius Institute' },
    { name: 'TOPIK', language: 'Korean', body: 'National Institute for International Education' },
    { name: 'DELE', language: 'Spanish', body: 'Instituto Cervantes' },
  ],
  music: [
    { name: 'Trinity College London', type: 'Graded exams + diplomas' },
    { name: 'ABRSM', type: 'Associated Board of the Royal Schools of Music' },
    { name: 'London College of Music', type: 'Music production + composition' },
  ],
  fashion: [
    { name: 'NIFT Certificate', type: 'National Institute of Fashion Technology' },
    { name: 'Pearl Academy Certificate', type: 'Design + fashion business' },
    { name: 'Parsons Affiliate', type: 'International design partnership' },
  ],
  general: [
    { name: 'Gurukul Global Vidyaniketan Certificate', type: 'Deemed institution — all CuriousHat certifications issued through Gurukul.foundation' },
    { name: 'UGC Recognised', type: 'University Grants Commission' },
    { name: 'AICTE Approved', type: 'All India Council for Technical Education' },
  ],
} as const

/**
 * IMPORTANT: CuriousHat is a learning platform, NOT a certifying institution.
 * All accredited certifications are issued through Gurukul Global Vidyaniketan,
 * a deemed school/college run by Gurukul.foundation.
 *
 * Students learn on CuriousHat → Gurukul Global Vidyaniketan issues the certificate.
 * International bodies (Trinity, ABRSM, DELF, Goethe, etc.) affiliate with
 * Gurukul Global Vidyaniketan, not CuriousHat directly.
 */
export const CERTIFICATION_ISSUER = {
  name: 'Gurukul Global Vidyaniketan',
  platform: 'Gurukul.foundation',
  url: 'https://gurukul.foundation',
  relationship: 'CuriousHat provides AI-powered learning. Gurukul Global Vidyaniketan is the deemed educational institution that issues all accredited certifications.',
} as const

/* ═══════════════════════════════════════════════════════════════
   §7  MOCK PIPELINE DATA (for UI development)
   ═══════════════════════════════════════════════════════════════ */

export interface PipelineJob {
  id: string
  bookTitle: string
  subject: string
  classLevel: string
  board: string
  sourceNames: string[]
  currentStage: PipelineStage
  stageProgress: number // 0–100
  status: PipelineStatus
  originalityScore: number
  languagesGenerated: string[]
  totalLanguages: number
  chaptersInterpreted: number
  totalChapters: number
  startedAt: string
  estimatedCompletion: string
}

export const MOCK_PIPELINE_JOBS: PipelineJob[] = [
  {
    id: 'pipe-001', bookTitle: 'Mathematics — Class IX', subject: 'Mathematics', classLevel: 'Class IX', board: 'CBSE',
    sourceNames: ['NCERT Textbooks', 'NDLI', 'DIKSHA'],
    currentStage: 'publication', stageProgress: 100, status: 'completed', originalityScore: 94,
    languagesGenerated: ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati'],
    totalLanguages: 23, chaptersInterpreted: 15, totalChapters: 15,
    startedAt: '2026-03-20T08:00:00Z', estimatedCompletion: '2026-03-20T14:30:00Z',
  },
  {
    id: 'pipe-002', bookTitle: 'Physics Part I — Class XI', subject: 'Physics', classLevel: 'Class XI', board: 'CBSE',
    sourceNames: ['NCERT Textbooks', 'NDLI', 'ePathshala'],
    currentStage: 'multi_lang_generation', stageProgress: 65, status: 'processing', originalityScore: 91,
    languagesGenerated: ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'],
    totalLanguages: 23, chaptersInterpreted: 8, totalChapters: 8,
    startedAt: '2026-03-24T06:00:00Z', estimatedCompletion: '2026-03-24T18:00:00Z',
  },
  {
    id: 'pipe-003', bookTitle: 'Chemistry Part I — Class XII', subject: 'Chemistry', classLevel: 'Class XII', board: 'CBSE',
    sourceNames: ['NCERT Textbooks', 'NDLI'],
    currentStage: 'ai_interpretation', stageProgress: 42, status: 'processing', originalityScore: 0,
    languagesGenerated: [], totalLanguages: 23, chaptersInterpreted: 4, totalChapters: 9,
    startedAt: '2026-03-24T09:00:00Z', estimatedCompletion: '2026-03-25T06:00:00Z',
  },
  {
    id: 'pipe-004', bookTitle: 'Biology — Class XI', subject: 'Biology', classLevel: 'Class XI', board: 'CBSE',
    sourceNames: ['NCERT Textbooks', 'DIKSHA', 'NIOS'],
    currentStage: 'ocr_processing', stageProgress: 78, status: 'processing', originalityScore: 0,
    languagesGenerated: [], totalLanguages: 23, chaptersInterpreted: 0, totalChapters: 22,
    startedAt: '2026-03-24T10:00:00Z', estimatedCompletion: '2026-03-25T12:00:00Z',
  },
  {
    id: 'pipe-005', bookTitle: 'History — Our Pasts III — Class VIII', subject: 'History', classLevel: 'Class VIII', board: 'CBSE',
    sourceNames: ['NCERT Textbooks'],
    currentStage: 'quality_review', stageProgress: 30, status: 'needs_review', originalityScore: 87,
    languagesGenerated: ['English', 'Hindi'], totalLanguages: 23, chaptersInterpreted: 12, totalChapters: 12,
    startedAt: '2026-03-23T08:00:00Z', estimatedCompletion: '2026-03-24T16:00:00Z',
  },
  {
    id: 'pipe-006', bookTitle: 'Economics — Class XII', subject: 'Economics', classLevel: 'Class XII', board: 'CBSE',
    sourceNames: ['NCERT Textbooks', 'NIOS'],
    currentStage: 'concept_mapping', stageProgress: 55, status: 'processing', originalityScore: 0,
    languagesGenerated: [], totalLanguages: 23, chaptersInterpreted: 0, totalChapters: 10,
    startedAt: '2026-03-24T11:00:00Z', estimatedCompletion: '2026-03-25T18:00:00Z',
  },
  {
    id: 'pipe-007', bookTitle: 'General Science — Class VII', subject: 'General Science', classLevel: 'Class VII', board: 'CBSE',
    sourceNames: ['NCERT Textbooks', 'ePathshala', 'DIKSHA'],
    currentStage: 'originality_check', stageProgress: 90, status: 'processing', originalityScore: 92,
    languagesGenerated: ['English', 'Hindi'], totalLanguages: 23, chaptersInterpreted: 18, totalChapters: 18,
    startedAt: '2026-03-23T14:00:00Z', estimatedCompletion: '2026-03-24T14:00:00Z',
  },
  {
    id: 'pipe-008', bookTitle: 'Computer Science with Python — Class XI', subject: 'Computer Science', classLevel: 'Class XI', board: 'CBSE',
    sourceNames: ['NCERT Textbooks', 'SWAYAM'],
    currentStage: 'ingestion', stageProgress: 20, status: 'queued', originalityScore: 0,
    languagesGenerated: [], totalLanguages: 23, chaptersInterpreted: 0, totalChapters: 14,
    startedAt: '2026-03-24T12:00:00Z', estimatedCompletion: '2026-03-26T08:00:00Z',
  },
]

/** Pipeline stage labels and order */
export const PIPELINE_STAGES: { stage: PipelineStage; label: string; icon: string; description: string }[] = [
  { stage: 'source_discovery', label: 'Source Discovery', icon: '🔍', description: 'Find relevant content in NDLI, NCERT, state boards' },
  { stage: 'ingestion', label: 'Ingestion', icon: '📥', description: 'Download and prepare source documents' },
  { stage: 'ocr_processing', label: 'Smart OCR', icon: '📄', description: 'Extract text, formulas, diagrams, tables' },
  { stage: 'structure_extraction', label: 'Structure', icon: '🏗️', description: 'Identify chapters, sections, content elements' },
  { stage: 'concept_mapping', label: 'Concept Map', icon: '🧠', description: 'Map concepts to curriculum standards' },
  { stage: 'ai_interpretation', label: 'AI Interpretation', icon: '✨', description: 'Generate original educational content' },
  { stage: 'cross_source_synthesis', label: 'Synthesis', icon: '🔄', description: 'Merge insights from multiple sources' },
  { stage: 'originality_check', label: 'Originality', icon: '🛡️', description: 'Plagiarism detection and originality scoring' },
  { stage: 'quality_review', label: 'Quality Review', icon: '⭐', description: 'AI + human quality assessment' },
  { stage: 'multi_lang_generation', label: 'Languages', icon: '🌐', description: 'Generate in all 23 Indian languages' },
  { stage: 'audio_generation', label: 'Audio', icon: '🎧', description: 'Generate audiobook narration per chapter' },
  { stage: 'publication', label: 'Publish', icon: '🚀', description: 'Publish to student & teacher libraries' },
]

/* ═══════════════════════════════════════════════════════════════
   §8  STATS
   ═══════════════════════════════════════════════════════════════ */

export const PIPELINE_STATS = {
  totalBooksInterpreted: 42,
  totalBooksInPipeline: 8,
  totalChaptersGenerated: 580,
  averageOriginalityScore: 91.3,
  languagesCovered: 9,
  targetLanguages: 23,
  sourcesConnected: 12,
  ocrPagesProcessed: 48_200,
  boardsCovered: 3,
  targetBoards: 28,
}
