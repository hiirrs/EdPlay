"use client"

import { useState } from "react"
import { Book, BookOpen, Calculator, Home, Microscope, PenTool } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("kelas")
  const [openModal, setOpenModal] = useState<string | null>(null)

  const username = "Fulan"
  const classData = [
    {
      id: 1,
      subject: "Matematika",
      class: "5-A",
      taskDate: "09/11/23",
      taskTime: "12:00",
      hasNewMaterial: true,
      hasExam: true,
      teacher: "Bapak Yudiastuti",
    },
    {
      id: 2,
      subject: "Matematika",
      class: "5-A",
      taskDate: "09/11/23",
      taskTime: "12:00",
      hasNewMaterial: true,
      hasExam: true,
      teacher: "Bapak Yudiastuti",
    },
    {
      id: 3,
      subject: "Matematika",
      class: "5-A",
      taskDate: "09/11/23",
      taskTime: "12:00",
      hasNewMaterial: true,
      hasExam: true,
      teacher: "Bapak Yudiastuti",
    },
    {
      id: 4,
      subject: "Matematika",
      class: "5-A",
      taskDate: "09/11/23",
      taskTime: "12:00",
      hasNewMaterial: true,
      hasExam: true,
      teacher: "Bapak Yudiastuti",
    },
    {
      id: 5,
      subject: "Matematika",
      class: "5-A",
      taskDate: "09/11/23",
      taskTime: "12:00",
      hasNewMaterial: true,
      hasExam: true,
      teacher: "Bapak Yudiastuti",
    },
    {
      id: 6,
      subject: "Matematika",
      class: "5-A",
      taskDate: "09/11/23",
      taskTime: "12:00",
      hasNewMaterial: true,
      hasExam: true,
      teacher: "Bapak Yudiastuti",
    },
  ]

  const leaderboardData = [
    { rank: 14, name: "Fulan 2", score: 2350 },
    { rank: 15, name: "Fulan", score: 2320 },
    { rank: 16, name: "Fulan 3", score: 2280 },
  ]

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Top Navigation */}
      <div className="bg-gray-700 text-white p-3 text-sm">
        <Button variant="link" className="text-white p-0 h-auto">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="bg-[#3f51b5] text-white p-4 flex justify-end">
        <div className="flex gap-6">
          <Button
            variant="ghost"
            className={`text-white hover:bg-[#4d5ec1] ${activeTab === "tugas" ? "bg-[#4d5ec1]" : ""}`}
            onClick={() => setActiveTab("tugas")}
          >
            Tugas
          </Button>
          <Button
            variant="ghost"
            className={`text-white hover:bg-[#4d5ec1] ${activeTab === "kelas" ? "bg-[#4d5ec1]" : ""}`}
            onClick={() => setActiveTab("kelas")}
          >
            Kelas
          </Button>
          <Button
            variant="ghost"
            className={`text-white hover:bg-[#4d5ec1] ${activeTab === "ujian" ? "bg-[#4d5ec1]" : ""}`}
            onClick={() => setActiveTab("ujian")}
          >
            Ujian
          </Button>
          <Button
            variant="ghost"
            className={`text-white hover:bg-[#4d5ec1] ${activeTab === "profil" ? "bg-[#4d5ec1]" : ""}`}
            onClick={() => setActiveTab("profil")}
          >
            Profil
          </Button>
          <Button variant="ghost" className="text-white hover:bg-[#4d5ec1]">
            Keluar
          </Button>
        </div>
      </nav>

      {/* User Welcome Section */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16 border-2 border-gray-200">
            <AvatarFallback className="bg-gray-100 text-gray-800 text-xl">F</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Hai {username}!</h1>
            <p className="text-gray-600">
              Kerjakan tugas kamu tepat waktu untuk naikin skor! Jangan lupa Bacayu dan Hitungin untuk tambah skor kamu
            </p>
          </div>
        </div>

        {/* Features Card */}
        <Card className="mb-8 overflow-hidden bg-[#172b4d] text-white border-0">
          <CardContent className="p-0">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
              <div className="flex flex-wrap justify-between">
                {/* Features */}
                <div
                  className="flex flex-col items-center p-4 hover:bg-[#1e3464] rounded-lg cursor-pointer transition-colors"
                  onClick={() => setOpenModal("ujian")}
                >
                  <div className="bg-[#f28b82] p-4 rounded-full mb-2">
                    <PenTool className="w-6 h-6 text-white" />
                  </div>
                  <span>Ujian</span>
                </div>

                <div
                  className="flex flex-col items-center p-4 hover:bg-[#1e3464] rounded-lg cursor-pointer transition-colors"
                  onClick={() => setOpenModal("tugas")}
                >
                  <div className="bg-[#fdd663] p-4 rounded-full mb-2">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span>Tugas</span>
                </div>

                {/* Leaderboard Section */}
                <div className="flex flex-col justify-center ml-4 mr-4">
                  {leaderboardData.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center mb-2 bg-[#ffe082] text-black rounded-full px-4 py-1 ${user.name === username ? "border-2 border-white" : ""}`}
                    >
                      <span className="w-6 text-center font-bold">{user.rank}</span>
                      <span className="mx-2">{user.name}</span>
                    </div>
                  ))}
                </div>

                <div
                  className="flex flex-col items-center p-4 hover:bg-[#1e3464] rounded-lg cursor-pointer transition-colors"
                  onClick={() => setOpenModal("bacayu")}
                >
                  <div className="bg-[#81c995] p-4 rounded-full mb-2">
                    <Microscope className="w-6 h-6 text-white" />
                  </div>
                  <span>Bacayu</span>
                </div>

                <div
                  className="flex flex-col items-center p-4 hover:bg-[#1e3464] rounded-lg cursor-pointer transition-colors"
                  onClick={() => setOpenModal("hitungin")}
                >
                  <div className="bg-[#a0c4ff] p-4 rounded-full mb-2">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <span>Hitungin</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classes Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Kelas Kamu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classData.map((item) => (
              <ClassCard key={item.id} data={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <FeatureModal
        title="Ujian"
        open={openModal === "ujian"}
        onClose={() => setOpenModal(null)}
        icon={<PenTool className="w-6 h-6 text-white" />}
        iconBg="bg-[#f28b82]"
      />

      <FeatureModal
        title="Tugas"
        open={openModal === "tugas"}
        onClose={() => setOpenModal(null)}
        icon={<BookOpen className="w-6 h-6 text-white" />}
        iconBg="bg-[#fdd663]"
      />

      <FeatureModal
        title="Bacayu"
        open={openModal === "bacayu"}
        onClose={() => setOpenModal(null)}
        icon={<Microscope className="w-6 h-6 text-white" />}
        iconBg="bg-[#81c995]"
      />

      <FeatureModal
        title="Hitungin"
        open={openModal === "hitungin"}
        onClose={() => setOpenModal(null)}
        icon={<Calculator className="w-6 h-6 text-white" />}
        iconBg="bg-[#a0c4ff]"
      />
    </div>
  )
}

// Component for Class Card
function ClassCard({ data }: { data: any }) {
  const subjectIcons: Record<string, JSX.Element> = {
    Matematika: <Calculator className="w-14 h-14 text-blue-500" />,
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex border-b p-4">
          <div className="mr-4">{subjectIcons[data.subject] || <Book className="w-14 h-14 text-blue-500" />}</div>
          <div>
            <h3 className="font-bold text-lg">{data.subject}</h3>
            <p className="text-gray-500">Kelas: {data.class}</p>

            <div className="flex items-center mt-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
              <span className="text-sm text-gray-600">
                Tugas ({data.taskDate} @{data.taskTime})
              </span>
            </div>

            {data.hasNewMaterial && (
              <div className="flex items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-sm text-gray-600">Materi Baru</span>
              </div>
            )}

            {data.hasExam && (
              <div className="flex items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-sm text-gray-600">Ujian</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-3 text-sm text-gray-600 bg-gray-50">{data.teacher}</div>
      </CardContent>
    </Card>
  )
}

// Component for Feature Modal
function FeatureModal({
  title,
  open,
  onClose,
  icon,
  iconBg,
}: {
  title: string
  open: boolean
  onClose: () => void
  icon: JSX.Element
  iconBg: string
}) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <div className={`${iconBg} p-2 rounded-full mr-2`}>{icon}</div>
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Tabs defaultValue="active">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="active" className="flex-1">
                Aktif
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex-1">
                Mendatang
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">
                Selesai
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">
                        {title === "Tugas"
                          ? "Latihan Perkalian"
                          : title === "Ujian"
                            ? "Ujian Tengah Semester"
                            : "Materi 1"}
                      </h3>
                      <p className="text-sm text-gray-500">Matematika - Kelas 5-A</p>
                    </div>
                    <Badge className="bg-yellow-500">{title === "Ujian" ? "24 Sept" : "20 Sept"}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">
                        {title === "Tugas" ? "Latihan Pembagian" : title === "Ujian" ? "Quiz Mingguan" : "Materi 2"}
                      </h3>
                      <p className="text-sm text-gray-500">Matematika - Kelas 5-A</p>
                    </div>
                    <Badge className="bg-yellow-500">{title === "Ujian" ? "30 Sept" : "28 Sept"}</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-center text-gray-500">Belum ada {title.toLowerCase()} mendatang</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">
                        {title === "Tugas" ? "PR Minggu Lalu" : title === "Ujian" ? "Quiz Sebelumnya" : "Materi Lama"}
                      </h3>
                      <p className="text-sm text-gray-500">Matematika - Kelas 5-A</p>
                    </div>
                    <Badge className="bg-green-500">Selesai</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Button onClick={onClose} className="w-full">
          Tutup
        </Button>
      </DialogContent>
    </Dialog>
  )
}

