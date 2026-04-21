import React from "react";
import Header from "../Components/Tools/Header";
import { getBukuTanah } from "../api/bukuTanahApi";
import { getPeminjaman } from "../api/peminjamanApi";
import { getPengembalian } from "../api/pengembalianApi";
import { getPetugas } from "../api/petugasApi";
import { MoonLoader } from "react-spinners";

const Dashboard = () => {
  const [stats, setStats] = React.useState({
    totalBuku: 0,
    bukuTersedia: 0,
    bukuTerpinjam: 0,
    totalPeminjaman: 0,
    peminjamanAktif: 0,
    totalPengembalian: 0,
    totalPetugas: 0,
  });
  const [recentPeminjaman, setRecentPeminjaman] = React.useState([]);
  const [recentPengembalian, setRecentPengembalian] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data
      const [bukuRes, peminjamanRes, pengembalianRes, petugasRes] =
        await Promise.all([
          getBukuTanah(),
          getPeminjaman(),
          getPengembalian(),
          getPetugas(),
        ]);

      const bukuData = bukuRes.data.data || [];
      const peminjamanData = peminjamanRes.data.data || [];
      const pengembalianData = pengembalianRes.data.data || [];
      const petugasData = petugasRes.data.data || [];

      // Calculate statistics
      const bukuTersedia = bukuData.filter(
        (b) => b.status === "tersedia",
      ).length;
      const bukuTerpinjam = bukuData.filter(
        (b) => b.status === "terpinjam",
      ).length;

      // Find active peminjaman (those without pengembalian)
      const peminjamanWithPengembalian = new Set(
        pengembalianData.map((p) => p.id_pinjam),
      );
      const peminjamanAktif = peminjamanData.filter(
        (p) => !peminjamanWithPengembalian.has(p.id_pinjam),
      ).length;

      setStats({
        totalBuku: bukuData.length,
        bukuTersedia,
        bukuTerpinjam,
        totalPeminjaman: peminjamanData.length,
        peminjamanAktif,
        totalPengembalian: pengembalianData.length,
        totalPetugas: petugasData.length,
      });

      // Get recent data (last 5)
      setRecentPeminjaman(peminjamanData.slice(0, 5));
      setRecentPengembalian(pengembalianData.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <div
      className={`bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm text-gray-600 font-medium">
            {title}
          </p>
          <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl md:text-4xl opacity-20">{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div>
        <Header title="DASHBOARD" />
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <MoonLoader color="#3b82f6" size={60} />
          <p className="text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="DASHBOARD" />

      <div className="p-4 md:p-6 lg:p-10">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard
            title="Total Buku Tanah"
            value={stats.totalBuku}
            subtitle={`${stats.bukuTersedia} tersedia, ${stats.bukuTerpinjam} dipinjam`}
            icon="📚"
            color="border-blue-500"
          />
          <StatCard
            title="Peminjaman Aktif"
            value={stats.peminjamanAktif}
            subtitle={`dari ${stats.totalPeminjaman} total peminjaman`}
            icon="📤"
            color="border-yellow-500"
          />
          <StatCard
            title="Total Pengembalian"
            value={stats.totalPengembalian}
            subtitle="Buku yang sudah dikembalikan"
            icon="📥"
            color="border-green-500"
          />
          <StatCard
            title="Total Petugas"
            value={stats.totalPetugas}
            subtitle="Petugas aktif"
            icon="👥"
            color="border-purple-500"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Recent Peminjaman */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center">
              <span className="mr-2">📤</span>
              Peminjaman Terbaru
            </h3>
            {recentPeminjaman.length > 0 ? (
              <div className="space-y-3">
                {recentPeminjaman.map((item) => (
                  <div
                    key={item.id_pinjam}
                    className="border-l-4 border-yellow-400 pl-3 md:pl-4 py-2"
                  >
                    <p className="font-medium text-sm">
                      {item.kode_peminjaman}
                    </p>
                    <p className="text-xs text-gray-600">
                      {item.Petugas?.nama || "-"} •{" "}
                      {item.BukuTanah?.nomor_hak || "-"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.tanggal_pinjam).toLocaleDateString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Belum ada peminjaman</p>
            )}
          </div>

          {/* Recent Pengembalian */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center">
              <span className="mr-2">📥</span>
              Pengembalian Terbaru
            </h3>
            {recentPengembalian.length > 0 ? (
              <div className="space-y-3">
                {recentPengembalian.map((item) => (
                  <div
                    key={item.id_kembali}
                    className="border-l-4 border-green-400 pl-3 md:pl-4 py-2"
                  >
                    <p className="font-medium text-sm">
                      {item.kode_pengembalian}
                    </p>
                    <p className="text-xs text-gray-600">
                      {item.Petugas?.nama || "-"} •{" "}
                      {item.BukuTanah?.nomor_hak || "-"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.tanggal_kembali).toLocaleDateString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Belum ada pengembalian</p>
            )}
          </div>
        </div>

        {/* Status Overview */}
        <div className="mt-4 md:mt-6 bg-white rounded-lg shadow-md p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
            Status Buku Tanah
          </h3>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
            <div className="flex-1 w-full">
              <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex">
                <div
                  className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{
                    width: `${(stats.bukuTersedia / stats.totalBuku) * 100}%`,
                  }}
                >
                  {stats.bukuTersedia > 0 && `${stats.bukuTersedia}`}
                </div>
                <div
                  className="bg-yellow-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{
                    width: `${(stats.bukuTerpinjam / stats.totalBuku) * 100}%`,
                  }}
                >
                  {stats.bukuTerpinjam > 0 && `${stats.bukuTerpinjam}`}
                </div>
              </div>
            </div>
            <div className="flex gap-3 md:gap-4 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded"></div>
                <span className="whitespace-nowrap">
                  Tersedia ({stats.bukuTersedia})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-500 rounded"></div>
                <span className="whitespace-nowrap">
                  Dipinjam ({stats.bukuTerpinjam})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
