import { Avatar, AvatarFallback } from "../ui/avatar"

interface UserWelcomeProps {
  username: string
}

export function UserWelcome({ username }: UserWelcomeProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Avatar className="w-16 h-16 border-2 border-gray-200">
        <AvatarFallback className="bg-gray-100 text-gray-800 text-xl">{username.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">Hai {username}!</h1>
        <p className="text-gray-600">
          Kerjakan tugas kamu tepat waktu untuk naikin skor! Jangan lupa Bacayu dan Hitungin untuk tambah skor kamu
        </p>
      </div>
    </div>
  )
}
