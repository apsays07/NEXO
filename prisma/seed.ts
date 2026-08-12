import { PrismaClient } from "@prisma/client";
import { MOCK_MEMBERS, MOCK_IPOS, MOCK_ACTIVITIES } from "../lib/mockData";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding NEXO PostgreSQL database...");

  // Seed Members
  for (const member of MOCK_MEMBERS) {
    await prisma.member.upsert({
      where: { email: member.email },
      update: {
        name: member.name,
        avatar: member.avatar,
        role: member.role as any,
        panMasked: member.panMasked,
        panFull: member.panFull,
        defaultContribution: member.defaultContribution,
        phone: member.phone || null,
      },
      create: {
        id: member.id,
        name: member.name,
        email: member.email,
        password: member.id === "mem_1" ? "admin123" : "user123",
        avatar: member.avatar,
        role: member.role as any,
        panMasked: member.panMasked,
        panFull: member.panFull,
        defaultContribution: member.defaultContribution,
        joinedAt: member.joinedAt,
        phone: member.phone || null,
      },
    });
  }

  // Seed IPOs
  for (const ipo of MOCK_IPOS) {
    await prisma.ipo.upsert({
      where: { id: ipo.id },
      update: {
        name: ipo.name,
        company: ipo.company,
        logo: ipo.logo,
        category: ipo.category,
        status: ipo.status as any,
        recommendation: ipo.recommendation as any,
        thesis: ipo.thesis,
        isFeatured: ipo.isFeatured || false,
        createdBy: ipo.createdBy,
        registrarUrl: ipo.registrarUrl,
        combinedCapital: ipo.combinedCapital,
        participantsCount: ipo.participantsCount,
        tags: ipo.tags,
        issueSize: ipo.metrics.issueSize,
        priceMin: ipo.metrics.priceBand.min,
        priceMax: ipo.metrics.priceBand.max,
        lotSize: ipo.metrics.lotSize,
        minInvestment: ipo.metrics.minInvestment,
        openDate: ipo.metrics.openDate,
        closeDate: ipo.metrics.closeDate,
        allotmentDate: ipo.metrics.allotmentDate,
        listingDate: ipo.metrics.listingDate,
        gmp: ipo.metrics.gmp,
        gmpPercent: ipo.metrics.gmpPercent,
      },
      create: {
        id: ipo.id,
        name: ipo.name,
        company: ipo.company,
        logo: ipo.logo,
        category: ipo.category,
        status: ipo.status as any,
        recommendation: ipo.recommendation as any,
        thesis: ipo.thesis,
        isFeatured: ipo.isFeatured || false,
        createdBy: ipo.createdBy,
        registrarUrl: ipo.registrarUrl,
        combinedCapital: ipo.combinedCapital,
        participantsCount: ipo.participantsCount,
        tags: ipo.tags,
        issueSize: ipo.metrics.issueSize,
        priceMin: ipo.metrics.priceBand.min,
        priceMax: ipo.metrics.priceBand.max,
        lotSize: ipo.metrics.lotSize,
        minInvestment: ipo.metrics.minInvestment,
        openDate: ipo.metrics.openDate,
        closeDate: ipo.metrics.closeDate,
        allotmentDate: ipo.metrics.allotmentDate,
        listingDate: ipo.metrics.listingDate,
        gmp: ipo.metrics.gmp,
        gmpPercent: ipo.metrics.gmpPercent,
      },
    });
  }

  // Seed Activities
  for (const act of MOCK_ACTIVITIES) {
    await prisma.activity.create({
      data: {
        id: act.id,
        type: act.type,
        title: act.title,
        subtitle: act.subtitle,
        timestamp: act.timestamp,
        memberName: act.memberName,
        memberAvatar: act.memberAvatar,
        ipoId: act.ipoId || null,
        ipoName: act.ipoName || null,
      },
    }).catch(() => {});
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
