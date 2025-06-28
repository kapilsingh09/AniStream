import { Filter } from 'lucide-react';
import React, { useState } from 'react'


const FeaturedSection = () => {
  const filters = ["All", "Completed", "Ongoing", "Upcoming", "Movies"];
  const [isOpen , setisOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState("All");
  return (
    <div>
           <section className="flex flex-wrap gap-4 items-center">
          <Filter className="text-gray-400" />
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setisOpen(!isOpen)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeFilter === filter
                  ? "bg-pink-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {filter}
            </button>
          ))}
      { isOpen && <div className='h-[30vh] w-full border-2 border-white'>

        </div>}
        </section>

    </div>
  )
}

export default FeaturedSection
