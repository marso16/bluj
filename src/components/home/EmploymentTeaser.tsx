import Link from 'next/link'

export default function EmploymentTeaser() {
  return (
    <section className="py-12 px-6 border-t border-surface">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-ghost text-sm">Interested in joining the BluJ team?</p>
        <Link href="/employment" className="text-charge font-semibold text-sm hover:text-charge/70 transition-colors">
          View open positions →
        </Link>
      </div>
    </section>
  )
}
