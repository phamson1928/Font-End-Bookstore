import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { useState, useEffect } from "react";

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const slides = [
    {
      image: "/images/heroimage1.jpg",
      alt: "Bookstore Banner 1",
      title: "Khám phá thế giới qua từng trang sách",
      subtitle: "Hàng ngàn đầu sách chất lượng với giá ưu đãi nhất thị trường.",
      accent: "from-blue-600 to-purple-600",
    },
    {
      image: "/images/heroimage2.jpg",
      alt: "Bookstore Banner 2",
      title: "Tri thức là sức mạnh vô hạn",
      subtitle: "Đọc sách mỗi ngày để mở rộng tầm nhìn và phát triển bản thân.",
      accent: "from-emerald-600 to-teal-600",
    },
    {
      image: "/images/heroimage3.jpg",
      alt: "Bookstore Banner 3",
      title: "Câu chuyện bắt đầu từ đây",
      subtitle:
        "Tìm kiếm những cuốn sách yêu thích và bắt đầu hành trình khám phá.",
      accent: "from-orange-600 to-red-600",
    },
  ];

  return (
    <section className="relative rounded-2xl overflow-hidden mb-12 h-[200px] sm:h-[280px] md:h-[360px] lg:h-[480px] group">
      {/* Enhanced Swiper */}
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        slidesPerView={1}
        loop={true}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active-custom",
          bulletClass: "swiper-pagination-bullet-custom",
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={1000}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-105"
              />
              {/* Animated overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 
                            opacity-0 animate-fade-in"
                style={{
                  animationDelay: "0.5s",
                  animationFillMode: "forwards",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Enhanced Text Content */}
      <div className="absolute inset-0 flex items-center z-20 container mx-auto px-4 lg:px-8">
        <div
          className={`max-w-2xl text-white transform transition-all duration-1000 ml-4 lg:ml-12
                       ${
                         isVisible
                           ? "translate-x-0 opacity-100"
                           : "-translate-x-10 opacity-0"
                       }`}
        >
          {/* Animated background */}
          <div
            className="absolute -inset-6 bg-gradient-to-r from-black/60 to-transparent 
                        backdrop-blur-sm rounded-3xl border border-white/10 
                        transform -skew-y-1 shadow-2xl"
          ></div>

          <div className="relative z-10 p-8 lg:p-10">
            {/* Animated title */}
            <h2
              className={`text-2xl md:text-4xl lg:text-5xl font-black leading-tight mb-6
                          bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent
                          transform transition-all duration-700 delay-300
                          ${
                            isVisible
                              ? "translate-y-0 opacity-100"
                              : "translate-y-8 opacity-0"
                          }`}
            >
              {slides[currentSlide]?.title}
            </h2>

            {/* Animated subtitle */}
            <p
              className={`text-base md:text-xl text-white/90 max-w-xl leading-relaxed mb-8
                         transform transition-all duration-700 delay-500
                         ${
                           isVisible
                             ? "translate-y-0 opacity-100"
                             : "translate-y-8 opacity-0"
                         }`}
            >
              {slides[currentSlide]?.subtitle}
            </p>

            {/* Enhanced CTA Button */}
            <div
              className={`transform transition-all duration-700 delay-700
                           ${
                             isVisible
                               ? "translate-y-0 opacity-100"
                               : "translate-y-8 opacity-0"
                           }`}
            >
              <button
                className={`group/btn relative bg-gradient-to-r ${slides[currentSlide]?.accent} 
                                text-white hover:shadow-2xl px-8 py-4 md:py-5 rounded-2xl font-bold 
                                transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
                                text-base md:text-lg overflow-hidden`}
              >
                <span className="relative z-10 flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 transition-transform duration-300 group-hover/btn:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  Khám phá ngay
                </span>

                {/* Button shine effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                              transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full 
                              transition-transform duration-700"
                ></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-8 right-8 z-10 hidden lg:block">
        <div className="animate-bounce delay-1000">
          <div
            className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center
                        border border-white/20 shadow-xl"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-8 left-8 z-10 hidden md:flex space-x-4">
        <div className="animate-pulse delay-500">
          <div className="w-3 h-3 bg-white/40 rounded-full"></div>
        </div>
        <div className="animate-pulse delay-700">
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
        </div>
        <div className="animate-pulse delay-1000">
          <div className="w-4 h-4 bg-white/50 rounded-full"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .swiper-pagination-bullet-custom {
          width: 12px !important;
          height: 12px !important;
          background: rgba(255, 255, 255, 0.3) !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
          margin: 0 8px !important;
        }

        .swiper-pagination-bullet-active-custom {
          background: white !important;
          transform: scale(1.2) !important;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.5) !important;
        }

        .swiper-pagination {
          bottom: 30px !important;
        }
      `}</style>
    </section>
  );
};
