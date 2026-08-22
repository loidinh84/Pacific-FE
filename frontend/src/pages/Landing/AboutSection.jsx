import { useLanguage } from "../../hooks/useLanguage";

export default function AboutSection() {
  const { t } = useLanguage();

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
          {t("about.badge")}
        </span>
        <h2 
          className="text-3xl md:text-4xl font-black text-white mb-6 font-heading"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {t("about.title")}
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
          {t("about.desc1")}
          <br />
          <br />
          {t("about.desc2")}
        </p>
      </div>
    </section>
  );
}
