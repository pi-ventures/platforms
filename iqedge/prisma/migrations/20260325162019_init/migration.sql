-- CreateTable
CREATE TABLE "StudentSnapshot" (
    "id" TEXT NOT NULL,
    "curioushatId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "board" TEXT NOT NULL,
    "category" TEXT,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "scores" JSONB NOT NULL,
    "attendance" JSONB NOT NULL,
    "profileCard" JSONB NOT NULL,
    "entrancePrep" JSONB,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAnalytics" (
    "id" TEXT NOT NULL,
    "studentSnapshotId" TEXT NOT NULL,
    "performanceTrend" JSONB NOT NULL,
    "subjectStrength" JSONB NOT NULL,
    "predictedBoardScore" DOUBLE PRECISION,
    "collegeReadinessScore" DOUBLE PRECISION,
    "entranceExamReadiness" JSONB,
    "careerFitScores" JSONB,
    "scholarshipEligibility" JSONB,
    "peerRank" JSONB,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolSnapshot" (
    "id" TEXT NOT NULL,
    "curioushatId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "board" TEXT NOT NULL,
    "udiseCode" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "studentCount" INTEGER NOT NULL,
    "teacherCount" INTEGER NOT NULL,
    "metrics" JSONB NOT NULL,
    "govtSchemes" JSONB,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolAnalytics" (
    "id" TEXT NOT NULL,
    "schoolSnapshotId" TEXT NOT NULL,
    "passRate3yr" JSONB NOT NULL,
    "avgScoreBySubject" JSONB NOT NULL,
    "attendanceTrend" JSONB NOT NULL,
    "teacherEffectiveness" JSONB,
    "infrastructureScore" DOUBLE PRECISION,
    "improvementIndex" DOUBLE PRECISION,
    "districtRank" INTEGER,
    "stateRank" INTEGER,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL,
    "studentSnapshotId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "output" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "model" TEXT NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AggregateReport" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "scopeId" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "board" TEXT,
    "totalStudents" INTEGER NOT NULL,
    "totalSchools" INTEGER NOT NULL,
    "avgPassRate" DOUBLE PRECISION NOT NULL,
    "genderGap" DOUBLE PRECISION,
    "dropoutRate" DOUBLE PRECISION,
    "topSchools" JSONB,
    "bottomSchools" JSONB,
    "subjectWise" JSONB,
    "govtVsPrivate" JSONB,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AggregateReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "entries" JSONB NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngestLog" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "recordCount" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'received',
    "error" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "IngestLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutgestLog" (
    "id" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "responseCode" INTEGER,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "OutgestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentSnapshot_state_board_idx" ON "StudentSnapshot"("state", "board");

-- CreateIndex
CREATE INDEX "StudentSnapshot_grade_idx" ON "StudentSnapshot"("grade");

-- CreateIndex
CREATE UNIQUE INDEX "StudentSnapshot_curioushatId_key" ON "StudentSnapshot"("curioushatId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAnalytics_studentSnapshotId_key" ON "StudentAnalytics"("studentSnapshotId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolSnapshot_curioushatId_key" ON "SchoolSnapshot"("curioushatId");

-- CreateIndex
CREATE INDEX "SchoolSnapshot_state_city_idx" ON "SchoolSnapshot"("state", "city");

-- CreateIndex
CREATE INDEX "SchoolSnapshot_type_idx" ON "SchoolSnapshot"("type");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolAnalytics_schoolSnapshotId_key" ON "SchoolAnalytics"("schoolSnapshotId");

-- CreateIndex
CREATE INDEX "Prediction_type_idx" ON "Prediction"("type");

-- CreateIndex
CREATE INDEX "Prediction_studentSnapshotId_idx" ON "Prediction"("studentSnapshotId");

-- CreateIndex
CREATE INDEX "AggregateReport_scope_idx" ON "AggregateReport"("scope");

-- CreateIndex
CREATE UNIQUE INDEX "AggregateReport_scope_scopeId_academicYear_key" ON "AggregateReport"("scope", "scopeId", "academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_type_scope_academicYear_key" ON "Leaderboard"("type", "scope", "academicYear");

-- AddForeignKey
ALTER TABLE "StudentAnalytics" ADD CONSTRAINT "StudentAnalytics_studentSnapshotId_fkey" FOREIGN KEY ("studentSnapshotId") REFERENCES "StudentSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolAnalytics" ADD CONSTRAINT "SchoolAnalytics_schoolSnapshotId_fkey" FOREIGN KEY ("schoolSnapshotId") REFERENCES "SchoolSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_studentSnapshotId_fkey" FOREIGN KEY ("studentSnapshotId") REFERENCES "StudentSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
