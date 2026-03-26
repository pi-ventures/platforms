-- AlterTable
ALTER TABLE "Connection" ADD COLUMN     "labels" JSONB,
ADD COLUMN     "relationKey" TEXT;

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "caste" TEXT,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "religion" TEXT,
ADD COLUMN     "successionLaw" TEXT,
ADD COLUMN     "tribe" TEXT;
