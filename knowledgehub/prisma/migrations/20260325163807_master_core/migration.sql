-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "cin" TEXT,
    "llpin" TEXT,
    "name" TEXT NOT NULL,
    "legalName" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "registrationDate" TIMESTAMP(3),
    "authorizedCapital" DOUBLE PRECISION,
    "paidUpCapital" DOUBLE PRECISION,
    "industry" TEXT,
    "subIndustry" TEXT,
    "registeredAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "email" TEXT,
    "website" TEXT,
    "lastAnnualReturn" TIMESTAMP(3),
    "lastBalanceSheet" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Director" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "din" TEXT,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3),
    "cessationDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "nationality" TEXT,
    "pan" TEXT,
    "otherDirectorships" JSONB,

    CONSTRAINT "Director_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Borrowing" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "lender" TEXT NOT NULL,
    "lenderType" TEXT NOT NULL,
    "sanctionAmount" DOUBLE PRECISION NOT NULL,
    "outstandingAmount" DOUBLE PRECISION,
    "interestRate" DOUBLE PRECISION,
    "securityType" TEXT,
    "sanctionDate" TIMESTAMP(3),
    "maturityDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Borrowing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Charge" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "chargeId" TEXT,
    "chargeHolder" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "dateOfCreation" TIMESTAMP(3),
    "dateOfModification" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'open',

    CONSTRAINT "Charge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filing" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "formType" TEXT NOT NULL,
    "filingDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "documentUrl" TEXT,

    CONSTRAINT "Filing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoldenRecord" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "mergedFrom" JSONB,
    "verticalPresence" JSONB NOT NULL,
    "dataQualityScore" DOUBLE PRECISION NOT NULL,
    "lastEnriched" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoldenRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonGoldenRecord" (
    "id" TEXT NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "din" TEXT,
    "pan" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mergedFrom" JSONB,
    "directorships" JSONB,
    "verticalPresence" JSONB NOT NULL,
    "wealthEstimate" DOUBLE PRECISION,
    "riskProfile" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonGoldenRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIPersona" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "industryLabel" TEXT NOT NULL,
    "sizeLabel" TEXT NOT NULL,
    "growthLabel" TEXT NOT NULL,
    "riskLabel" TEXT NOT NULL,
    "creditScore" DOUBLE PRECISION,
    "fundingStage" TEXT,
    "keyInsights" JSONB NOT NULL,
    "predictedRevenue" DOUBLE PRECISION,
    "predictedGrowth" DOUBLE PRECISION,
    "competitors" JSONB,
    "opportunities" JSONB,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIPersona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerticalClient" (
    "id" TEXT NOT NULL,
    "vertical" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "metadata" JSONB,
    "goldenRecordId" TEXT,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerticalClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditSnapshot" (
    "id" TEXT NOT NULL,
    "companyCin" TEXT,
    "companyName" TEXT NOT NULL,
    "loanScore" DOUBLE PRECISION,
    "borrowingTotal" DOUBLE PRECISION,
    "outstandingTotal" DOUBLE PRECISION,
    "npaRisk" DOUBLE PRECISION,
    "sectorRisk" TEXT,
    "financials" JSONB,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenderSnapshot" (
    "id" TEXT NOT NULL,
    "tenderRef" TEXT,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "location" JSONB,
    "category" TEXT,
    "status" TEXT NOT NULL,
    "bidderCount" INTEGER,
    "winnerName" TEXT,
    "winnerCin" TEXT,
    "publishedAt" TIMESTAMP(3),
    "closingAt" TIMESTAMP(3),
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenderSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalSnapshot" (
    "id" TEXT NOT NULL,
    "caseType" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "partiesCount" INTEGER,
    "estimatedValue" DOUBLE PRECISION,
    "willsCoverage" JSONB,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LegalSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthcareSnapshot" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "region" JSONB NOT NULL,
    "avgDiscount" DOUBLE PRECISION,
    "pharmacyCount" INTEGER,
    "topDrugs" JSONB,
    "priceIndex" DOUBLE PRECISION,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthcareSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSRSnapshot" (
    "id" TEXT NOT NULL,
    "companyCin" TEXT,
    "companyName" TEXT,
    "csrSpend" DOUBLE PRECISION,
    "csrObligation" DOUBLE PRECISION,
    "projects" JSONB,
    "donationTotal" DOUBLE PRECISION,
    "impactMetrics" JSONB,
    "financialYear" TEXT NOT NULL,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CSRSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngagementEvent" (
    "id" TEXT NOT NULL,
    "vertical" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventData" JSONB NOT NULL,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EngagementEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BehaviorAnalytic" (
    "id" TEXT NOT NULL,
    "vertical" TEXT NOT NULL,
    "cohort" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "sampleSize" INTEGER,
    "period" TEXT NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BehaviorAnalytic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIEnhancement" (
    "id" TEXT NOT NULL,
    "vertical" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "improvement" DOUBLE PRECISION,
    "trainingData" JSONB,
    "deployedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIEnhancement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_cin_key" ON "Company"("cin");

-- CreateIndex
CREATE UNIQUE INDEX "Company_llpin_key" ON "Company"("llpin");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_state_city_idx" ON "Company"("state", "city");

-- CreateIndex
CREATE INDEX "Company_industry_idx" ON "Company"("industry");

-- CreateIndex
CREATE INDEX "Company_status_idx" ON "Company"("status");

-- CreateIndex
CREATE INDEX "Director_din_idx" ON "Director"("din");

-- CreateIndex
CREATE INDEX "Director_companyId_idx" ON "Director"("companyId");

-- CreateIndex
CREATE INDEX "Borrowing_companyId_idx" ON "Borrowing"("companyId");

-- CreateIndex
CREATE INDEX "Borrowing_lender_idx" ON "Borrowing"("lender");

-- CreateIndex
CREATE INDEX "Charge_companyId_idx" ON "Charge"("companyId");

-- CreateIndex
CREATE INDEX "Filing_companyId_filingDate_idx" ON "Filing"("companyId", "filingDate");

-- CreateIndex
CREATE UNIQUE INDEX "GoldenRecord_companyId_key" ON "GoldenRecord"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonGoldenRecord_din_key" ON "PersonGoldenRecord"("din");

-- CreateIndex
CREATE INDEX "PersonGoldenRecord_canonicalName_idx" ON "PersonGoldenRecord"("canonicalName");

-- CreateIndex
CREATE UNIQUE INDEX "AIPersona_companyId_key" ON "AIPersona"("companyId");

-- CreateIndex
CREATE INDEX "VerticalClient_vertical_idx" ON "VerticalClient"("vertical");

-- CreateIndex
CREATE INDEX "VerticalClient_goldenRecordId_idx" ON "VerticalClient"("goldenRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "VerticalClient_vertical_externalId_key" ON "VerticalClient"("vertical", "externalId");

-- CreateIndex
CREATE INDEX "CreditSnapshot_companyCin_idx" ON "CreditSnapshot"("companyCin");

-- CreateIndex
CREATE INDEX "TenderSnapshot_department_idx" ON "TenderSnapshot"("department");

-- CreateIndex
CREATE INDEX "TenderSnapshot_status_idx" ON "TenderSnapshot"("status");

-- CreateIndex
CREATE INDEX "LegalSnapshot_caseType_idx" ON "LegalSnapshot"("caseType");

-- CreateIndex
CREATE INDEX "HealthcareSnapshot_category_idx" ON "HealthcareSnapshot"("category");

-- CreateIndex
CREATE INDEX "CSRSnapshot_companyCin_idx" ON "CSRSnapshot"("companyCin");

-- CreateIndex
CREATE INDEX "CSRSnapshot_financialYear_idx" ON "CSRSnapshot"("financialYear");

-- CreateIndex
CREATE INDEX "EngagementEvent_vertical_eventType_idx" ON "EngagementEvent"("vertical", "eventType");

-- CreateIndex
CREATE INDEX "EngagementEvent_userId_idx" ON "EngagementEvent"("userId");

-- CreateIndex
CREATE INDEX "EngagementEvent_createdAt_idx" ON "EngagementEvent"("createdAt");

-- CreateIndex
CREATE INDEX "BehaviorAnalytic_vertical_metric_idx" ON "BehaviorAnalytic"("vertical", "metric");

-- CreateIndex
CREATE INDEX "AIEnhancement_vertical_modelName_idx" ON "AIEnhancement"("vertical", "modelName");

-- AddForeignKey
ALTER TABLE "Director" ADD CONSTRAINT "Director_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrowing" ADD CONSTRAINT "Borrowing_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filing" ADD CONSTRAINT "Filing_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoldenRecord" ADD CONSTRAINT "GoldenRecord_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIPersona" ADD CONSTRAINT "AIPersona_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
