"use client"

import type { ReactNode } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"

interface FeatureModalProps {
  title: string
  open: boolean
  onClose: () => void
  icon: ReactNode
  iconBg: string | undefined
}

export function FeatureModal({ title, open, onClose, icon, iconBg }: FeatureModalProps) {
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

