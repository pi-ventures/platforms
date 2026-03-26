-- CreateTable
CREATE TABLE "VerticalDataPoint" (
    "id" TEXT NOT NULL,
    "vertical" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "features" JSONB,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerticalDataPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatternDetection" (
    "id" TEXT NOT NULL,
    "patternType" TEXT NOT NULL,
    "verticals" TEXT[],
    "description" TEXT NOT NULL,
    "entities" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "impact" TEXT NOT NULL,
    "actionable" BOOLEAN NOT NULL DEFAULT true,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatternDetection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrossVerticalInsight" (
    "id" TEXT NOT NULL,
    "sourceVerticals" TEXT[],
    "insightType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dataPoints" JSONB NOT NULL,
    "recommendation" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL,
    "targetVerticals" TEXT[],
    "isActioned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrossVerticalInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PredictiveModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vertical" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "precision" DOUBLE PRECISION,
    "recall" DOUBLE PRECISION,
    "f1Score" DOUBLE PRECISION,
    "featureCount" INTEGER,
    "trainingRecords" INTEGER,
    "lastTrainedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PredictiveModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PredictiveResult" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "vertical" TEXT NOT NULL,
    "prediction" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PredictiveResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VerticalDataPoint_vertical_idx" ON "VerticalDataPoint"("vertical");

-- CreateIndex
CREATE INDEX "VerticalDataPoint_entityType_idx" ON "VerticalDataPoint"("entityType");

-- CreateIndex
CREATE UNIQUE INDEX "VerticalDataPoint_vertical_entityId_key" ON "VerticalDataPoint"("vertical", "entityId");

-- CreateIndex
CREATE INDEX "PatternDetection_patternType_idx" ON "PatternDetection"("patternType");

-- CreateIndex
CREATE INDEX "PatternDetection_impact_idx" ON "PatternDetection"("impact");

-- CreateIndex
CREATE INDEX "CrossVerticalInsight_insightType_idx" ON "CrossVerticalInsight"("insightType");

-- CreateIndex
CREATE UNIQUE INDEX "PredictiveModel_name_version_key" ON "PredictiveModel"("name", "version");

-- CreateIndex
CREATE INDEX "PredictiveResult_vertical_entityType_idx" ON "PredictiveResult"("vertical", "entityType");

-- CreateIndex
CREATE INDEX "PredictiveResult_modelId_idx" ON "PredictiveResult"("modelId");

-- AddForeignKey
ALTER TABLE "PredictiveResult" ADD CONSTRAINT "PredictiveResult_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "PredictiveModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
