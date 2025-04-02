import { PenTool, BookOpen, Microscope, Calculator } from "lucide-react"
import { FeatureModal } from "./feature-modal"

interface FeatureModalsProps {
  openModal: string | null
  setOpenModal: (modal: string | null) => void
}

export function FeatureModals({ openModal, setOpenModal }: FeatureModalsProps) {
  return (
    <>
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
    </>
  )
}

