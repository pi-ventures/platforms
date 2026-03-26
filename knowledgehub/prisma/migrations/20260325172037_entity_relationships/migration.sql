-- CreateTable
CREATE TABLE "EntityRelationship" (
    "id" TEXT NOT NULL,
    "sourceVertical" TEXT NOT NULL,
    "sourceEntityId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "targetVertical" TEXT NOT NULL,
    "targetEntityId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetName" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "strength" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "direction" TEXT NOT NULL DEFAULT 'bidirectional',
    "metadata" JSONB,
    "discoveredBy" TEXT NOT NULL DEFAULT 'manual',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityMapping" (
    "id" TEXT NOT NULL,
    "goldenRecordType" TEXT NOT NULL,
    "goldenRecordId" TEXT NOT NULL,
    "vertical" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "matchScore" DOUBLE PRECISION NOT NULL,
    "matchMethod" TEXT NOT NULL,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntityMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EntityRelationship_sourceVertical_sourceEntityId_idx" ON "EntityRelationship"("sourceVertical", "sourceEntityId");

-- CreateIndex
CREATE INDEX "EntityRelationship_targetVertical_targetEntityId_idx" ON "EntityRelationship"("targetVertical", "targetEntityId");

-- CreateIndex
CREATE INDEX "EntityRelationship_relationshipType_idx" ON "EntityRelationship"("relationshipType");

-- CreateIndex
CREATE UNIQUE INDEX "EntityRelationship_sourceVertical_sourceEntityId_targetVert_key" ON "EntityRelationship"("sourceVertical", "sourceEntityId", "targetVertical", "targetEntityId", "relationshipType");

-- CreateIndex
CREATE INDEX "EntityMapping_goldenRecordId_idx" ON "EntityMapping"("goldenRecordId");

-- CreateIndex
CREATE INDEX "EntityMapping_vertical_idx" ON "EntityMapping"("vertical");

-- CreateIndex
CREATE UNIQUE INDEX "EntityMapping_vertical_externalId_key" ON "EntityMapping"("vertical", "externalId");
