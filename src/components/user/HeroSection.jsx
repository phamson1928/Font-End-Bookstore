import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

export const HeroSection = () => {
  return (
    <section className="relative rounded-xl overflow-hidden mb-8 h-[200px] sm:h-[280px] md:h-[360px] lg:h-[420px]">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="h-full"
      >
        <SwiperSlide>
          <img
            src="/images/heroimage1.jpg"
            alt="Bookstore Banner 1"
            className="w-full h-full object-cover bg-black"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/images/heroimage2.jpg"
            alt="Bookstore Banner 2"
            className="w-full h-full object-cover bg-black"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="/images/heroimage3.jpg"
            alt="Bookstore Banner 3"
            className="w-full h-full object-cover bg-black"
          />
        </SwiperSlide>
      </Swiper>

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none z-0" />

      {/* text trên ảnh */}
      <div className="absolute inset-0 flex items-center z-10 container mx-auto px-4 ml-10 ">
        <div className="max-w-xl text-white bg-black/50 p-6 rounded-xl">
          <h2 className="text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-md">
            Khám phá thế giới qua từng trang sách
          </h2>
          <p className="mt-4 text-sm md:text-lg text-white/90 max-w-lg">
            Hàng ngàn đầu sách chất lượng với giá ưu đãi nhất thị trường.
          </p>
          <button className="mt-6 bg-white text-blue-700 hover:bg-gray-100 px-6 py-2 md:py-3 rounded-full font-semibold shadow-md transition duration-300">
            Khám phá ngay
          </button>
        </div>
      </div>
    </section>
  );
};
