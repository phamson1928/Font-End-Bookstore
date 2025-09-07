import { BookCard } from "./BookCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatedBookItem } from './AnimatedBookItem';

export const BookSection = ({ id, title, books, handleBookClick }) => {
  return (
    <section id={id} className="mb-16 relative">
      {/* Enhanced Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          <div className="absolute -bottom-1 left-0 w-8 h-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full"></div>
        </div>

        {/* Section decoration */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>

      {books.length === 0 ? (
        <div
          className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-12 
                      border border-white/50 shadow-lg text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-slate-400"
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
          <p className="text-slate-600 text-lg font-medium">
            Sách của danh mục này sẽ sớm được cập nhật
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Đang cập nhật
          </div>
        </div>
      ) : (
        <div className="relative group">
          {/* Background decoration */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 
                        rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          ></div>

          {/* Swiper Container */}
          <div className="relative px-12">
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: `.custom-next-${id}`,
                prevEl: `.custom-prev-${id}`,
              }}
              spaceBetween={24}
              slidesPerView={5}
              loop={false}
              style={{
                padding: "20px 0",
                margin: "-20px 0",
                overflow: "visible",
              }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 16 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
                1280: { slidesPerView: 5, spaceBetween: 24 },
              }}
            >
              {books.map((book, index) => (
                <SwiperSlide
                  key={book.id}
                  style={{
                    height: "auto",
                    padding: "20px 0",
                  }}
                >
                  <AnimatedBookItem index={index}>
                    <BookCard book={book} onClick={() => handleBookClick(book)} />
                  </AnimatedBookItem>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Enhanced Custom Navigation Buttons */}
            {/* Previous Button */}
            <button
              className={`custom-prev-${id} absolute top-1/2 -left-6 transform -translate-y-1/2
                       group/btn bg-white/95 backdrop-blur-md shadow-2xl
                       rounded-2xl p-4 transition-all duration-300 ease-out
                       hover:bg-white hover:shadow-3xl hover:scale-110
                       border-2 border-white/50 z-50 hover:border-blue-200
                       opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0`}
            >
              <div className="relative">
                <ChevronLeft
                  className="w-6 h-6 text-slate-700 transition-all duration-300
                             group-hover/btn:text-blue-600 group-hover/btn:-translate-x-1
                             group-hover/btn:drop-shadow-lg"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                           rounded-full scale-0 group-hover/btn:scale-125 transition-transform duration-300 -z-10"
                ></div>
              </div>

              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 to-purple-400/0 
                            group-hover/btn:from-blue-400/20 group-hover/btn:to-purple-400/20 transition-all duration-300"
              ></div>
            </button>

            {/* Next Button */}
            <button
              className={`custom-next-${id} absolute top-1/2 -right-6 transform -translate-y-1/2
                       group/btn bg-white/95 backdrop-blur-md shadow-2xl
                       rounded-2xl p-4 transition-all duration-300 ease-out
                       hover:bg-white hover:shadow-3xl hover:scale-110
                       border-2 border-white/50 z-50 hover:border-blue-200
                       opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0`}
            >
              <div className="relative">
                <ChevronRight
                  className="w-6 h-6 text-slate-700 transition-all duration-300
                             group-hover/btn:text-blue-600 group-hover/btn:translate-x-1
                             group-hover/btn:drop-shadow-lg"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                           rounded-full scale-0 group-hover/btn:scale-125 transition-transform duration-300 -z-10"
                ></div>
              </div>

              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 to-purple-400/0 
                            group-hover/btn:from-blue-400/20 group-hover/btn:to-purple-400/20 transition-all duration-300"
              ></div>
            </button>
          </div>

          {/* Scroll indicators */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full"></div>
            <div className="w-4 h-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full"></div>
            <div className="w-2 h-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full"></div>
          </div>
        </div>
      )}
    </section>
  );
};
