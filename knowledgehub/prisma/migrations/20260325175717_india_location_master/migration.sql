-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameLocal" TEXT,
    "type" TEXT NOT NULL,
    "capital" TEXT,
    "highCourt" TEXT,
    "population" INTEGER,
    "area" DOUBLE PRECISION,
    "literacy" DOUBLE PRECISION,
    "language" TEXT[],
    "lgdCode" TEXT,
    "censuscode" TEXT,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameLocal" TEXT,
    "headquarters" TEXT,
    "population" INTEGER,
    "area" DOUBLE PRECISION,
    "literacy" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "lgdCode" TEXT,
    "censuscode" TEXT,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameLocal" TEXT,
    "type" TEXT NOT NULL DEFAULT 'block',
    "population" INTEGER,
    "lgdCode" TEXT,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Panchayat" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameLocal" TEXT,
    "type" TEXT NOT NULL DEFAULT 'gram_panchayat',
    "population" INTEGER,
    "lgdCode" TEXT,

    CONSTRAINT "Panchayat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Village" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "panchayatId" TEXT,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "nameLocal" TEXT,
    "population" INTEGER,
    "households" INTEGER,
    "area" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "lgdCode" TEXT,
    "censusCode" TEXT,
    "nearestTown" TEXT,
    "distanceToTown" DOUBLE PRECISION,
    "hasPostOffice" BOOLEAN NOT NULL DEFAULT false,
    "hasRailway" BOOLEAN NOT NULL DEFAULT false,
    "hasBankBranch" BOOLEAN NOT NULL DEFAULT false,
    "hasSchool" BOOLEAN NOT NULL DEFAULT false,
    "hasPhc" BOOLEAN NOT NULL DEFAULT false,
    "roadType" TEXT,

    CONSTRAINT "Village_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pincode" (
    "id" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "districtId" TEXT,
    "officeName" TEXT,
    "officeType" TEXT,
    "region" TEXT,
    "division" TEXT,
    "circle" TEXT,
    "taluk" TEXT,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Pincode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostOffice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branchType" TEXT NOT NULL,
    "deliveryStatus" TEXT NOT NULL,
    "districtId" TEXT,
    "pincodeId" TEXT,
    "pincode" TEXT NOT NULL,
    "circle" TEXT,
    "region" TEXT,
    "division" TEXT,
    "telephone" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "PostOffice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RailwayStation" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameLocal" TEXT,
    "districtId" TEXT,
    "state" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "division" TEXT,
    "category" TEXT,
    "platforms" INTEGER,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "elevation" DOUBLE PRECISION,
    "pincode" TEXT,

    CONSTRAINT "RailwayStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airport" (
    "id" TEXT NOT NULL,
    "iataCode" TEXT,
    "icaoCode" TEXT,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "operator" TEXT,
    "runways" INTEGER,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "elevation" DOUBLE PRECISION,
    "pincode" TEXT,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Court" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "address" TEXT,
    "pincode" TEXT,
    "benchType" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Court_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "State_code_key" ON "State"("code");

-- CreateIndex
CREATE INDEX "State_code_idx" ON "State"("code");

-- CreateIndex
CREATE INDEX "State_name_idx" ON "State"("name");

-- CreateIndex
CREATE UNIQUE INDEX "District_code_key" ON "District"("code");

-- CreateIndex
CREATE INDEX "District_stateId_idx" ON "District"("stateId");

-- CreateIndex
CREATE INDEX "District_name_idx" ON "District"("name");

-- CreateIndex
CREATE INDEX "Block_districtId_idx" ON "Block"("districtId");

-- CreateIndex
CREATE INDEX "Block_name_idx" ON "Block"("name");

-- CreateIndex
CREATE INDEX "Panchayat_blockId_idx" ON "Panchayat"("blockId");

-- CreateIndex
CREATE UNIQUE INDEX "Village_code_key" ON "Village"("code");

-- CreateIndex
CREATE INDEX "Village_blockId_idx" ON "Village"("blockId");

-- CreateIndex
CREATE INDEX "Village_name_idx" ON "Village"("name");

-- CreateIndex
CREATE INDEX "Village_latitude_longitude_idx" ON "Village"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "Pincode_pincode_key" ON "Pincode"("pincode");

-- CreateIndex
CREATE INDEX "Pincode_pincode_idx" ON "Pincode"("pincode");

-- CreateIndex
CREATE INDEX "Pincode_districtId_idx" ON "Pincode"("districtId");

-- CreateIndex
CREATE INDEX "Pincode_state_district_idx" ON "Pincode"("state", "district");

-- CreateIndex
CREATE INDEX "PostOffice_pincode_idx" ON "PostOffice"("pincode");

-- CreateIndex
CREATE INDEX "PostOffice_districtId_idx" ON "PostOffice"("districtId");

-- CreateIndex
CREATE INDEX "PostOffice_name_idx" ON "PostOffice"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RailwayStation_code_key" ON "RailwayStation"("code");

-- CreateIndex
CREATE INDEX "RailwayStation_code_idx" ON "RailwayStation"("code");

-- CreateIndex
CREATE INDEX "RailwayStation_districtId_idx" ON "RailwayStation"("districtId");

-- CreateIndex
CREATE INDEX "RailwayStation_zone_idx" ON "RailwayStation"("zone");

-- CreateIndex
CREATE INDEX "RailwayStation_name_idx" ON "RailwayStation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_iataCode_key" ON "Airport"("iataCode");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_icaoCode_key" ON "Airport"("icaoCode");

-- CreateIndex
CREATE INDEX "Airport_city_idx" ON "Airport"("city");

-- CreateIndex
CREATE INDEX "Airport_state_idx" ON "Airport"("state");

-- CreateIndex
CREATE INDEX "Court_type_jurisdiction_idx" ON "Court"("type", "jurisdiction");

-- CreateIndex
CREATE INDEX "Court_state_city_idx" ON "Court"("state", "city");

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Panchayat" ADD CONSTRAINT "Panchayat_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Village" ADD CONSTRAINT "Village_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Village" ADD CONSTRAINT "Village_panchayatId_fkey" FOREIGN KEY ("panchayatId") REFERENCES "Panchayat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pincode" ADD CONSTRAINT "Pincode_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostOffice" ADD CONSTRAINT "PostOffice_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostOffice" ADD CONSTRAINT "PostOffice_pincodeId_fkey" FOREIGN KEY ("pincodeId") REFERENCES "Pincode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RailwayStation" ADD CONSTRAINT "RailwayStation_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;
