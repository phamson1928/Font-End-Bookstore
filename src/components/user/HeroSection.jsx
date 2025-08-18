export const HeroSection = () => {
  return (
    <section className="relative rounded-xl overflow-hidden mb-8">
      <img
        src="/images/heroimage1.jpg"
        alt="Bookstore Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      <div className="relative container mx-auto px-4 py-16 md:py-24 ml-10">
        <div className="max-w-xl text-white">
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-md">
            Khám phá thế giới qua từng trang sách
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/90 max-w-lg">
            Hàng ngàn đầu sách chất lượng với giá ưu đãi nhất thị trường.
          </p>
          <button className="mt-6 bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold shadow-md transition duration-300">
            Khám phá ngay
          </button>
        </div>
      </div>
    </section>
  );
};
