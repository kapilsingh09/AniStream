// NOTE: The responsive width and aspect ratio styles for the anime image cards in this component
// are needed for other components as well. Consider reusing or extracting these styles for consistency.

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Star, ChevronLeft, ChevronRight } from "lucide-react";

// Helper for status badge styling
const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case "ongoing":
      return "bg-green-600 text-white";
    case "finished":
      return "bg-blue-700 text-white";
    case "upcoming":
      return "bg-yellow-500 text-black";
    default:
      return "bg-slate-500 text-white";
  }
};

const SLIDES_TO_SHOW_DESKTOP = 5;

const AviAnime = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(SLIDES_TO_SHOW_DESKTOP);
  const navigate = useNavigate();
  const sliderRef = useRef();

  // Fetch anime data
  useEffect(() => {
    let ignore = false;
    const fetchAnime = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/available_data");
        if (!res.ok) throw new Error("Failed to fetch anime data");
        const data = await res.json();
        if (!ignore) setAnimeData(data);
      } catch (err) {
        if (!ignore) console.error("Fetch error:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchAnime();
    return () => { ignore = true; };
  }, []);

  // Responsive slides to show
  useEffect(() => {
    const calcSlidesToShow = () => {
      if (typeof window === "undefined") return SLIDES_TO_SHOW_DESKTOP;
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 768) return 2;
      if (window.innerWidth < 1024) return 3;
      if (window.innerWidth < 1280) return 4;
      return SLIDES_TO_SHOW_DESKTOP;
    };
    setSlidesToShow(calcSlidesToShow());
    const handleResize = () => setSlidesToShow(calcSlidesToShow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation handlers
  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? Math.max(animeData.length - slidesToShow, 0) : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) =>
      prev + slidesToShow >= animeData.length
        ? 0
        : Math.min(prev + 1, animeData.length - slidesToShow)
    );
  };

  const goToSlide = (idx) => setCurrent(idx);

  // Card click handler
  const handleClick = (id) => {
    navigate(`/watch/${id}`);
  };

  // Skeletons for loading
  const skeletons = Array(slidesToShow).fill(0);

  // Calculate slider width and transform
  const getSliderWidth = () =>
    loading
      ? "100%"
      : `${(animeData.length / slidesToShow) * 100}%`;

  const getSliderTransform = () =>
    `translateX(-${current * (100 / slidesToShow)}%)`;

  // Main render
  return (
    <div className="min-h-[40vh] bg-black relative">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-white px-4 sm:px-8">
            Local Anime Slider
          </h1>
        </div>
        <div className="relative">
          {/* Slider */}
          <div
            className="overflow-hidden px-1 sm:px-4 md:px-8 py-2"
            ref={sliderRef}
          >
            <div
              className="flex gap-3 transition-transform duration-500"
              style={{
                transform: getSliderTransform(),
                width: getSliderWidth(),
              }}
            >
              {loading
                ? skeletons.map((_, i) => (
                    <div
                      key={i}
                      className="
                        animate-pulse 
                        aspect-[2/3]
                        w-[80vw] sm:w-[40vw] md:w-[28vw] lg:w-[18vw] xl:w-[15vw]
                        bg-white/10 
                        rounded-xl 
                        flex-shrink-0
                        max-w-[180px] sm:max-w-none
                      "
                    ></div>
                  ))
                : animeData.map((anime, idx) => {
                    const { id, title, img, reception, status } = anime;
                    // Rating logic
                    const kitsuRatingRaw = reception?.ratings?.kitsu_average;
                    let displayRating = "N/A";
                    if (typeof kitsuRatingRaw === "number") {
                      displayRating = (kitsuRatingRaw / 10).toFixed(1);
                    } else if (
                      typeof kitsuRatingRaw === "string" &&
                      kitsuRatingRaw !== "N/A"
                    ) {
                      const num = parseFloat(kitsuRatingRaw);
                      if (!isNaN(num)) {
                        displayRating = (num / 10).toFixed(1);
                      }
                    }
                    return (
                      <div
                        key={id}
                        onClick={() => handleClick(id)}
                        className="
                          bg-black/20
                          rounded-xl 
                          overflow-hidden 
                          text-white 
                          flex flex-col 
                          hover:scale-[1.03] 
                          transition-transform 
                          duration-300 
                          cursor-pointer 
                          group 
                          flex-shrink-0
                          w-[80vw] sm:w-[40vw] md:w-[28vw] lg:w-[18vw] xl:w-[15vw]
                          max-w-[180px] sm:max-w-none
                        "
                        style={{
                          minWidth: "0",
                        }}
                      >
                        {/* Image Wrapper with fixed aspect ratio */}
                        <div className="relative aspect-[2/3] w-full">
                          <img
                            src={img}
                            alt={title}
                            className="w-full h-full object-cover rounded-xl group-hover:brightness-110 transition-all duration-300"
                            loading="lazy"
                            style={{
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                          />
                          {/* Play Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black/80 to-transparent z-10" />
                            <div className="rounded-full z-40 border-2 border-white/40 h-10 w-10 flex items-center group-hover:scale-110 duration-400 animate-pulse justify-center text-white bg-black/40">
                              <Play size={18} />
                            </div>
                          </div>
                          {/* Star Rating */}
                          {displayRating !== "N/A" && (
                            <div className="absolute top-2 right-2 flex items-center text-xs gap-1 bg-red-500 text-white font-semibold px-2 py-1 rounded-lg backdrop-blur-sm z-30">
                              <Star className="w-3 h-3" />
                              <span className="font-semibold text-xs">
                                {displayRating}
                              </span>
                            </div>
                          )}
                          {/* Status Badge */}
                          {status && status.toLowerCase() && (
                            <div
                              className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(
                                status
                              )} z-30`}
                            >
                              {status}
                            </div>
                          )}
                        </div>
                        {/* Title */}
                        <div className="py-1 ml-1 text-xs sm:text-sm font-medium leading-tight">
                          <div
                            className="line-clamp-2 group-hover:text-yellow-400 transition-colors"
                            title={title}
                          >
                            {title}
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
          {/* Navigation Buttons */}
          {!loading && animeData.length > slidesToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-2 -translate-y-1/2 z-20 bg-zinc-800/70 hover:bg-black/80 text-white p-2 rounded-full shadow transition-all duration-200"
                aria-label="Previous"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-2 -translate-y-1/2 z-20 bg-zinc-800/70 hover:bg-black/80 text-white p-2 rounded-full shadow transition-all duration-200"
                aria-label="Next"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
          {/* Dots */}
          {!loading && animeData.length > slidesToShow && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({
                length: Math.max(animeData.length - slidesToShow + 1, 1),
              }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    current === idx
                      ? "bg-white"
                      : "bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AviAnime;
