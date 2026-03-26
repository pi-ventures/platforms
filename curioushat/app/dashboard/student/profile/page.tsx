'use client'
import StudentProfileCard from '@/components/dashboard/StudentProfileCard'

export default function StudentProfilePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <StudentProfileCard
        onSendToCollege={() => alert('Profile sent to college admission leads!')}
        onSendToCoaching={() => alert('Profile sent to coaching institute!')}
      />
    </div>
  )
}
