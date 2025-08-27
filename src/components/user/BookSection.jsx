import { BookCard } from "./BookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const BookSection = ({ id, title, books, handleBookClick }) => {
  return (
    <section id={id} className="mb-12 relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>

      {books.length === 0 ? (
        <p className="text-gray-600 text-center">
          Sách của danh mục này sẽ sớm được cập nhật
        </p>
      ) : (
        <div className="relative">
          {/* Swiper */}
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            spaceBetween={20}
            slidesPerView={5}
            loop={false}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
          >
            {books.map((book) => (
              <SwiperSlide key={book.id}>
                <BookCard book={book} onClick={() => handleBookClick(book)} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom nút điều hướng */}
          {/* Previous Button */}
          <button
            className="absolute top-1/2 -left-6 transform -translate-y-1/2 
                       group bg-white/90 backdrop-blur-sm shadow-xl 
                       rounded-full p-3 transition-all duration-300 ease-out
                       hover:bg-white hover:shadow-2xl hover:scale-110
                       border border-white/20 z-50"
          >
            <div className="relative">
              <ChevronLeft
                className="w-6 h-6 text-slate-700 transition-all duration-300 
                                 group-hover:text-blue-600 group-hover:-translate-x-0.5"
              />
              <div
                className="absolute inset-0 bg-blue-500/20 rounded-full scale-0 
                         group-hover:scale-100 transition-transform duration-300 -z-10"
              ></div>
            </div>
          </button>

          {/* Next Button */}
          <button
            className="absolute top-1/2 -right-6 transform -translate-y-1/2 
                       group bg-white/90 backdrop-blur-sm shadow-xl 
                       rounded-full p-3 transition-all duration-300 ease-out
                       hover:bg-white hover:shadow-2xl hover:scale-110
                       border border-white/20 z-50"
          >
            <div className="relative">
              <ChevronRight
                className="w-6 h-6 text-slate-700 transition-all duration-300 
                                  group-hover:text-blue-600 group-hover:translate-x-0.5"
              />
              <div
                className="absolute inset-0 bg-blue-500/20 rounded-full scale-0 
                         group-hover:scale-100 transition-transform duration-300 -z-10"
              ></div>
            </div>
          </button>
        </div>
      )}
    </section>
  );
};
