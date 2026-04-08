export default function MultilingualSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
            Only Platform
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">98 Languages. Accredited Certifications.</h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            The only EdTech platform supporting 24 Indian languages + 74 international languages across 12 regions with accredited certifications — issued through <span className="text-violet-600 font-semibold">Gurukul Global Vidyaniketan</span> (Gurukul.foundation) — from DELF, Goethe, JLPT, HSK, TOPIK, DELE, Trinity College London, NIFT, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
            <div className="text-3xl mb-3">&#127757;</div>
            <h3 className="font-bold text-gray-900 mb-2">98 Languages</h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">All 24 Indian languages including Bhojpuri, Santali, Bodo + 74 international across Europe, Middle East, East Asia, Southeast Asia, Africa, Caucasus — with AI tutoring in each.</p>
            <div className="flex flex-wrap gap-1">
              {['&#127467;&#127479;','&#127466;&#127480;','&#127465;&#127466;','&#127464;&#127475;','&#127471;&#127477;','&#127472;&#127479;','&#127480;&#127462;','&#127463;&#127479;','&#127479;&#127482;','&#127470;&#127481;'].map((f, i) => (
                <span key={i} className="text-lg" dangerouslySetInnerHTML={{ __html: f }} />
              ))}
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium self-center ml-1">+88 more</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-2xl p-6">
            <div className="text-3xl mb-3">&#127925;</div>
            <h3 className="font-bold text-gray-900 mb-2">Music &amp; Performing Arts</h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">Hindustani &amp; Carnatic classical, Western theory, music production, Bharatanatyam, theatre — from Class III to Postgraduate.</p>
            <div className="flex flex-wrap gap-1.5">
              {['Trinity College','ABRSM','London College of Music'].map(c => (
                <span key={c} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">&#127941; {c}</span>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-6">
            <div className="text-3xl mb-3">&#128087;</div>
            <h3 className="font-bold text-gray-900 mb-2">Fashion &amp; Design</h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">Higher education fashion courses with industry tie-ups — design fundamentals, textile science, sustainable fashion, fashion business.</p>
            <div className="flex flex-wrap gap-1.5">
              {['NIFT','Pearl Academy','Parsons Affiliate'].map(c => (
                <span key={c} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">&#127941; {c}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center mb-2">Accredited Certification Partners</p>
          <p className="text-[11px] text-gray-500 text-center mb-3">All certifications issued through <a href="https://gurukul.foundation" target="_blank" rel="noopener noreferrer" className="text-violet-600 font-semibold hover:underline">Gurukul Global Vidyaniketan</a> (Gurukul.foundation)</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'DELF/DALF (French)','Goethe-Zertifikat (German)','JLPT (Japanese)','HSK (Mandarin)',
              'TOPIK (Korean)','DELE (Spanish)','Trinity College London','ABRSM',
              'London College of Music','NIFT','Pearl Academy','Parsons School of Design',
              'Cambridge IGCSE','IB Diploma','UGC Recognised','AICTE Approved',
            ].map(c => (
              <span key={c} className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg font-medium">&#127941; {c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
