import { PrismaClient } from "@prisma/client";
import BannerClient from "./BannerClient";

const prisma = new PrismaClient();

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6">
      <BannerClient initialBanners={JSON.parse(JSON.stringify(banners))} />
    </div>
  );
}

