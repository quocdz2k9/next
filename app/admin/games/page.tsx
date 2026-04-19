import { PrismaClient } from "@prisma/client";
import GameClient from "./GameClient";

const prisma = new PrismaClient();

export default async function AdminGamesPage() {
  const games = await prisma.game.findMany({
    include: {
      _count: { select: { accounts: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6">
      <GameClient initialGames={JSON.parse(JSON.stringify(games))} />
    </div>
  );
}

