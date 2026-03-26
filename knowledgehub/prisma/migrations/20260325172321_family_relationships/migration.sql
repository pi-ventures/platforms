-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "goldenRecordId" TEXT,
    "name" TEXT NOT NULL,
    "gender" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "dateOfDeath" TIMESTAMP(3),
    "isAlive" BOOLEAN NOT NULL DEFAULT true,
    "religion" TEXT,
    "maritalStatus" TEXT,
    "nationality" TEXT NOT NULL DEFAULT 'Indian',
    "pan" TEXT,
    "aadhaar" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "verticalIds" JSONB,
    "successionClass" TEXT,
    "willBeneficiary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyRelation" (
    "id" TEXT NOT NULL,
    "fromPersonId" TEXT NOT NULL,
    "toPersonId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    "lineage" TEXT,
    "isBloodRelation" BOOLEAN NOT NULL DEFAULT true,
    "isLegalRelation" BOOLEAN NOT NULL DEFAULT false,
    "marriageDate" TIMESTAMP(3),
    "divorceDate" TIMESTAMP(3),
    "heirClass" TEXT,
    "heirPriority" INTEGER,
    "coparcener" BOOLEAN NOT NULL DEFAULT false,
    "kartaEligible" BOOLEAN NOT NULL DEFAULT false,
    "relevantVerticals" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_goldenRecordId_key" ON "Person"("goldenRecordId");

-- CreateIndex
CREATE INDEX "Person_name_idx" ON "Person"("name");

-- CreateIndex
CREATE INDEX "Person_goldenRecordId_idx" ON "Person"("goldenRecordId");

-- CreateIndex
CREATE INDEX "FamilyRelation_fromPersonId_idx" ON "FamilyRelation"("fromPersonId");

-- CreateIndex
CREATE INDEX "FamilyRelation_toPersonId_idx" ON "FamilyRelation"("toPersonId");

-- CreateIndex
CREATE INDEX "FamilyRelation_relationType_idx" ON "FamilyRelation"("relationType");

-- CreateIndex
CREATE INDEX "FamilyRelation_heirClass_idx" ON "FamilyRelation"("heirClass");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyRelation_fromPersonId_toPersonId_relationType_key" ON "FamilyRelation"("fromPersonId", "toPersonId", "relationType");

-- AddForeignKey
ALTER TABLE "FamilyRelation" ADD CONSTRAINT "FamilyRelation_fromPersonId_fkey" FOREIGN KEY ("fromPersonId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyRelation" ADD CONSTRAINT "FamilyRelation_toPersonId_fkey" FOREIGN KEY ("toPersonId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
