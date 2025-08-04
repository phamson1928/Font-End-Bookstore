export const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg mb-8 overflow-hidden">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Khám phá thế giới qua từng trang sách
          </h2>
          <p className="text-lg mb-6">
            Hàng ngàn đầu sách chất lượng với giá ưu đãi nhất thị trường.
          </p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition duration-300">
            Khám phá ngay
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <div class="w-full h-64 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 800 300"
                class="w-full h-full"
              >
                <g transform="translate(100, 50)">
                  <path
                    d="M0,20 C60,5 110,0 150,0 L150,200 C110,200 60,195 0,180 Z"
                    fill="#f8f9fa"
                    stroke="#334155"
                    stroke-width="2"
                  />

                  <path
                    d="M150,0 C190,0 240,5 300,20 L300,180 C240,195 190,200 150,200 Z"
                    fill="#f8f9fa"
                    stroke="#334155"
                    stroke-width="2"
                  />

                  <path d="M150,0 L150,200" stroke="#334155" stroke-width="3" />

                  <path
                    d="M30,40 L120,40"
                    stroke="#94a3b8"
                    stroke-width="1.5"
                  />
                  <path
                    d="M30,60 L120,60"
                    stroke="#94a3b8"
                    stroke-width="1.5"
                  />
                  <path
                    d="M30,80 L120,80"
                    stroke="#94a3b8"
                    stroke-width="1.5"
                  />
                  <path
                    d="M30,100 L120,100"
                    stroke="#94a3b8"
                    stroke-width="1.5"
                  />
                  <path
                    d="M30,120 L120,120"
                    stroke="#94a3b8"
                    stroke-width="1.5"
                  />
                  <path
                    d="M30,140 L120,140"
                    stroke="#94a3b8"
                    stroke-width="1.5"
                  />
                  <path
                    d="M30,160 L120,160"
                    stroke="#94a3b8"
                    stroke-width="1.5"
                  />

                  <path
                    d="M180,40 L270,40"
                    stroke="#94a3b8"
                    stroke-width="1.5"
                  />
                  <path
                    d="M180,60 L270,60"
                    stroke="#94a3b8"
                    stroke-width="1.5"
                  />
                  <path
                    d="M180,80 L270,80"
                    stroke="#94a3b8"
                    stroke-width="1.5"
                  />
                  <path
                    d="M180,100 L270,100"
                    stroke="#94a3b8"
                    stroke-width="1.5"
                  />
                  <path
                    d="M180,120 L270,120"
                    stroke="#94a3b8"
                    stroke-width="1.5"
                  />
                  <path
                    d="M180,140 L270,140"
                    stroke="#94a3b8"
                    stroke-width="1.5"
                  />
                  <path
                    d="M180,160 L270,160"
                    stroke="#94a3b8"
                    stroke-width="1.5"
                  />
                </g>

                <g transform="translate(450, 80)">
                  <rect
                    x="0"
                    y="0"
                    width="40"
                    height="140"
                    rx="2"
                    fill="#3b82f6"
                    stroke="#1e40af"
                    stroke-width="2"
                  />
                  <rect x="0" y="0" width="5" height="140" fill="#1e40af" />
                  <text
                    x="20"
                    y="75"
                    font-size="14"
                    fill="white"
                    text-anchor="middle"
                    transform="rotate(-90, 20, 75)"
                  >
                    NOVEL
                  </text>

                  <rect
                    x="50"
                    y="20"
                    width="35"
                    height="120"
                    rx="2"
                    fill="#ef4444"
                    stroke="#b91c1c"
                    stroke-width="2"
                  />
                  <rect x="50" y="20" width="5" height="120" fill="#b91c1c" />
                  <text
                    x="67.5"
                    y="85"
                    font-size="12"
                    fill="white"
                    text-anchor="middle"
                    transform="rotate(-90, 67.5, 85)"
                  >
                    POETRY
                  </text>

                  <rect
                    x="95"
                    y="10"
                    width="45"
                    height="130"
                    rx="2"
                    fill="#10b981"
                    stroke="#047857"
                    stroke-width="2"
                  />
                  <rect x="95" y="10" width="5" height="130" fill="#047857" />
                  <text
                    x="117.5"
                    y="80"
                    font-size="14"
                    fill="white"
                    text-anchor="middle"
                    transform="rotate(-90, 117.5, 80)"
                  >
                    HISTORY
                  </text>

                  <rect
                    x="150"
                    y="30"
                    width="30"
                    height="110"
                    rx="2"
                    fill="#f59e0b"
                    stroke="#b45309"
                    stroke-width="2"
                  />
                  <rect x="150" y="30" width="5" height="110" fill="#b45309" />
                  <text
                    x="165"
                    y="90"
                    font-size="11"
                    fill="white"
                    text-anchor="middle"
                    transform="rotate(-90, 165, 90)"
                  >
                    SCI-FI
                  </text>
                </g>

                <g transform="translate(350, 180)">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke="#334155"
                    stroke-width="2"
                  />
                  <circle
                    cx="80"
                    cy="20"
                    r="18"
                    fill="none"
                    stroke="#334155"
                    stroke-width="2"
                  />
                  <path d="M38,20 L62,20" stroke="#334155" stroke-width="2" />
                  <path d="M98,15 L120,5" stroke="#334155" stroke-width="2" />
                </g>

                <path
                  d="M200,30 L230,30 L230,90 L215,75 L200,90 Z"
                  fill="#8b5cf6"
                  stroke="#6d28d9"
                  stroke-width="1.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
