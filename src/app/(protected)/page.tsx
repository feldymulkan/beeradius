import prisma from "@/lib/prisma";
import OnlineUserCount from "@/components/OnlineUserCount";


export const dynamic = "force-dynamic";

export default async function DashboardPage() {

  const groupedUsers = await prisma.radcheck.groupBy({
    by: ['username'],
  });
  const totalUsers = groupedUsers.length;

  const groupedGroups = await prisma.radgroupreply.groupBy({
    by: ['groupname'],
  });
  const totalGroups = groupedGroups.length;


  return (
    <div className="mb-6">


      <div className=" flex justify-center">

        <div className="not-prose stats stats-vertical lg:stats-horizontal shadow mt-6">

        <OnlineUserCount />

        <div className="stat">
          <div className="stat-figure text-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.084-1.284-.23-1.857M12 12c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zM6 20v-2c0-.653.084-1.284.23-1.857m0 0A7.988 7.988 0 0112 13a7.988 7.988 0 015.77 5.143m-5.77 1.857A10 10 0 0012 21a10 10 0 00-5.77-1.857z"></path></svg>
          </div>
          <div className="stat-title">Total User</div>
          <div className="stat-value text-info">{totalUsers}</div>
          <div className="stat-desc">User terdaftar</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <div className="stat-title">Total Grup</div>
          <div className="stat-value text-accent">{totalGroups}</div>
          <div className="stat-desc">Grup profil</div>
        </div>

      </div>


      </div>

    </div>
  );
}