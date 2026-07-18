export default function AboutSection() {
  return (
    <section id="about" className="bg-pacific-figma-dark py-24 relative overflow-hidden">
      {/* Decorative ocean path backdrop blur */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-pacific-teal/5 blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <span 
          className="inline-block text-2xl font-bold tracking-widest text-pacific-blue-bright mb-4 font-heading"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Giới thiệu về
        </span>
        <h2 
          className="text-3xl md:text-4xl font-black text-white mb-6 font-heading"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Thái Bình Dương
        </h2>
        <div 
          className="w-16 h-1 bg-gradient-to-r from-pacific-blue-bright to-pacific-teal rounded-full mx-auto mb-10"
          data-aos="fade-up"
          data-aos-delay="300"
        ></div>
        <p 
          className="text-base md:text-lg text-white/80 leading-relaxed text-left space-y-4 font-normal"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          Thái Bình Dương (Pacific Ocean) là đại dương lớn nhất và sâu nhất trên
          Trái Đất, có diện tích khoảng 165,25 triệu km², chiếm gần 1/3 bề mặt
          hành tinh và khoảng một nửa diện tích các đại dương. Nó trải dài từ hệ
          Bắc Băng Dương đến Nam Đại Dương và được bao quanh bởi châu Á, châu Úc
          ở phía tây và châu Mỹ ở phía đông.
          <br />
          <br />
          Độ sâu trung bình của Thái Bình Dương vào khoảng 4.280 mét, với điểm
          sâu nhất là Rãnh Mariana (Challenger Deep) đạt gần 11.000 mét — sâu
          nhất từng được ghi nhận trong các đại dương. Khu vực này cũng là nơi
          tập trung &ldquo;Vành đai lửa Thái Bình Dương&rdquo;, một vùng có hoạt
          động địa chất mạnh với nhiều núi lửa và động đất.
          <br />
          <br />
          Thái Bình Dương đóng vai trò quan trọng trong hệ thống khí hậu toàn
          cầu, đặc biệt liên quan đến các hiện tượng như El Niño và La Niña,
          đồng thời là nơi sinh sống của hệ sinh thái biển phong phú và là tuyến
          giao thương hàng hải quan trọng bậc nhất thế giới.
        </p>
      </div>
    </section>
  );
}
