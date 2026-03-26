-- CreateTable
CREATE TABLE "WealthSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userType" TEXT NOT NULL DEFAULT 'individual',
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "netWorth" JSONB NOT NULL,
    "platforms" JSONB NOT NULL,
    "metrics" JSONB NOT NULL,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WealthSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationSnapshot" (
    "id" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "region" JSONB NOT NULL,
    "academicYear" TEXT NOT NULL,
    "board" TEXT,
    "totalStudents" INTEGER,
    "avgBoardScore" DOUBLE PRECISION,
    "topStreamDemand" JSONB,
    "topEntranceExams" JSONB,
    "admissionRate" DOUBLE PRECISION,
    "coachingPenetration" DOUBLE PRECISION,
    "rawPayload" JSONB NOT NULL,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EducationSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdmissionFunnel" (
    "id" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "region" JSONB NOT NULL,
    "totalProfiles" INTEGER NOT NULL,
    "totalLeadsSent" INTEGER NOT NULL,
    "totalApplications" INTEGER NOT NULL,
    "totalAdmissions" INTEGER NOT NULL,
    "conversionRate" DOUBLE PRECISION NOT NULL,
    "topColleges" JSONB NOT NULL,
    "topCoaching" JSONB NOT NULL,
    "avgLeadCost" DOUBLE PRECISION NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdmissionFunnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterReport" (
    "id" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "scopeId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MasterReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformMetrics" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketInsight" (
    "id" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "region" JSONB NOT NULL,
    "insight" TEXT NOT NULL,
    "dataPoints" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngestLog" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "recordCount" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'received',
    "error" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "IngestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WealthSnapshot_userId_idx" ON "WealthSnapshot"("userId");

-- CreateIndex
CREATE INDEX "WealthSnapshot_state_city_idx" ON "WealthSnapshot"("state", "city");

-- CreateIndex
CREATE INDEX "EducationSnapshot_dataType_idx" ON "EducationSnapshot"("dataType");

-- CreateIndex
CREATE INDEX "EducationSnapshot_academicYear_idx" ON "EducationSnapshot"("academicYear");

-- CreateIndex
CREATE INDEX "AdmissionFunnel_academicYear_idx" ON "AdmissionFunnel"("academicYear");

-- CreateIndex
CREATE INDEX "MasterReport_reportType_idx" ON "MasterReport"("reportType");

-- CreateIndex
CREATE UNIQUE INDEX "MasterReport_reportType_scope_scopeId_period_key" ON "MasterReport"("reportType", "scope", "scopeId", "period");

-- CreateIndex
CREATE INDEX "PlatformMetrics_platform_metricType_idx" ON "PlatformMetrics"("platform", "metricType");

-- CreateIndex
CREATE INDEX "MarketInsight_sector_idx" ON "MarketInsight"("sector");

-- CreateIndex
CREATE INDEX "IngestLog_source_status_idx" ON "IngestLog"("source", "status");
