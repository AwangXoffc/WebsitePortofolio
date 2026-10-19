import React, { useState, useEffect, useCallback, memo } from "react";
import { Helmet } from "react-helmet-async";
import { MessageCircle, Send, Youtube, Mail, ExternalLink, Sparkles } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { scrollToSection } from "../utils/scrollToSection";
const StatusBadge = memo(() => (<div className="inline-block animate-float lg:mx-0" data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
          <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-400"/>
          Ready to Innovate
        </span>
      </div>
    </div>
  </div>));
const MainTitle = memo(() => (<div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
      <span className="relative inline-block">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          Creative
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-2">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
          Technologist
        </span>
      </span>
    </h1>
  </div>));
const TechStack = memo(({ tech }) => (<div className="px-4 py-2 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
    {tech}
  </div>));
const CTAButton = memo(({ href, text, icon: Icon }) => (<a href={href} onClick={(event) => scrollToSection(event, href)} aria-label={text === "Projects" ? "Lihat proyek portofolio" : "Buka bagian kontak"} className="group relative inline-flex w-[160px] h-11 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030014]">
      <span className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700" aria-hidden="true"></span>
      <span className="relative h-full w-full bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden flex items-center justify-center">
        <span className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20" aria-hidden="true"></span>
        <span className="relative flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium">
            {text}
          </span>
          <Icon className={`w-4 h-4 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300`} aria-hidden="true"/>
        </span>
      </span>
    </a>));
const SocialLink = memo(({ icon: Icon, link, label }) => (<a href={link} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="group relative inline-flex p-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400">
      <span className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300" aria-hidden="true"></span>
      <span className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" aria-hidden="true"/>
      </span>
    </a>));
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const WORDS = ["UI/UX Designer", "Creative Technologist", "Immersive Experience Creator"];
const TECH_STACK = ["UI/UX Design", "Creative Technology", "Interface Design", "Digital Experience"];
const SOCIAL_LINKS = [
    { icon: MessageCircle, link: "https://wa.me/message/ZEXON4LRPFLEP1", label: "WhatsApp" },
    { icon: Send, link: "https://t.me/awangoffc", label: "Telegram" },
    { icon: Youtube, link: "https://www.youtube.com/@AwangOfc", label: "YouTube" }
];
const Home = () => {
    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    useEffect(() => {
        const initAOS = () => {
            AOS.init({
                once: true,
                offset: 10,
            });
        };
        initAOS();
        window.addEventListener('resize', initAOS);
        return () => window.removeEventListener('resize', initAOS);
    }, []);
    useEffect(() => {
        setIsLoaded(true);
        return () => setIsLoaded(false);
    }, []);
    const handleTyping = useCallback(() => {
        if (isTyping) {
            if (charIndex < WORDS[wordIndex].length) {
                setText(prev => prev + WORDS[wordIndex][charIndex]);
                setCharIndex(prev => prev + 1);
            }
            else {
                setTimeout(() => setIsTyping(false), PAUSE_DURATION);
            }
        }
        else {
            if (charIndex > 0) {
                setText(prev => prev.slice(0, -1));
                setCharIndex(prev => prev - 1);
            }
            else {
                setWordIndex(prev => (prev + 1) % WORDS.length);
                setIsTyping(true);
            }
        }
    }, [charIndex, isTyping, wordIndex]);
    useEffect(() => {
        const timeout = setTimeout(handleTyping, isTyping ? TYPING_SPEED : ERASING_SPEED);
        return () => clearTimeout(timeout);
    }, [handleTyping]);
    return (<>
      <Helmet>
        <title>Awang OfficiaL — Creative Technologist &amp; UI/UX Designer</title>
        <meta name="description" content="Halo! Saya Awang OfficiaL, seorang Creative Technologist dan UI/UX Designer yang berfokus pada pembuatan antarmuka futuristik serta pengalaman pengguna yang imersif dan elegan. Saya percaya bahwa perpaduan antara teknologi dan desain adalah kunci untuk menciptakan dunia digital yang lebih indah dan fungsional."/>
     <meta name="robots" content="index, follow"/>
        <link rel="canonical" href={window.location.origin + "/"}/>
        <meta property="og:title" content="Awang OfficiaL — Creative Technologist &amp; UI/UX Designer"/>
     <meta property="og:description" content="Halo! Saya Awang OfficiaL, Creative Technologist dan UI/UX Designer yang memadukan teknologi dan desain untuk menciptakan antarmuka futuristik serta pengalaman digital yang imersif, elegan, dan fungsional."/>
        <meta property="og:url" content={window.location.origin}/>
        <meta property="og:type" content="website"/>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Awang OfficiaL",
            "jobTitle": "Creative Technologist and UI/UX Designer",
            "url": "${window.location.origin}",
            "description": "Halo! Saya Awang OfficiaL, seorang Creative Technologist dan UI/UX Designer yang berfokus pada pembuatan antarmuka futuristik serta pengalaman pengguna yang imersif dan elegan. Saya percaya bahwa perpaduan antara teknologi dan desain adalah kunci untuk menciptakan dunia digital yang lebih indah dan fungsional."
          }
        `}</script>
      </Helmet>

      <div className="min-h-screen bg-[#030014] overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%]" id="Home">
        <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <div className="container mx-auto min-h-screen">
            <div className="flex flex-col lg:flex-row items-center justify-center h-screen md:justify-between gap-0 sm:gap-12 lg:gap-20">

              <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-left lg:text-left order-1 lg:order-1 lg:mt-0" data-aos="fade-right" data-aos-delay="200">
                <div className="space-y-4 sm:space-y-6">
                  <StatusBadge />
                  <MainTitle />


                  <div className="h-8 flex items-center" data-aos="fade-up" data-aos-delay="800">
                    <span className="text-xl md:text-2xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
                      {text}
                    </span>
                    <span className="w-[3px] h-6 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink"></span>
                  </div>


                  <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-light" data-aos="fade-up" data-aos-delay="1000">
                    Halo, saya Awang OfficiaL, Creative Technologist dan UI/UX Designer yang menciptakan website futuristik, elegan, dan interaktif.
                  </p>


                  <div className="flex flex-wrap gap-3 justify-start" data-aos="fade-up" data-aos-delay="1200">
                    {TECH_STACK.map((tech, index) => (<TechStack key={index} tech={tech}/>))}
                  </div>


                  <div className="flex flex-row gap-3 w-full justify-start" data-aos="fade-up" data-aos-delay="1400">
                    <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink}/>
                    <CTAButton href="#Contact" text="Contact" icon={Mail}/>
                  </div>


                  <div className="hidden sm:flex gap-4 justify-start" data-aos="fade-up" data-aos-delay="1600">
                    {SOCIAL_LINKS.map((social, index) => (<SocialLink key={index} {...social}/>))}
                  </div>
                </div>
              </div>


              <div className="w-full py-0 md:py-[10%] sm:py-0 lg:w-1/2 h-[260px] sm:h-[400px] lg:h-[600px] xl:h-[750px] relative flex items-center justify-center order-2 lg:order-2  mt-5 sm:mt-0" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} data-aos="fade-left" data-aos-delay="600">
                <div className="relative w-full opacity-90">
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out ${isHovering ? "opacity-50 scale-105" : "opacity-20 scale-100"}`}>
                  </div>

                  <div className={`relative lg:left-12 z-10 w-full opacity-90 transform transition-transform duration-500 ${isHovering ? "scale-105" : "scale-100"}`}>
                    <img src="Animation1.gif" alt="Developer Animation" className={`w-full h-full object-contain transition-all duration-500 ${isHovering
            ? "scale-[95%] sm:scale-[90%] md:scale-[90%] lg:scale-[90%] rotate-2"
            : "scale-[90%] sm:scale-[80%] md:scale-[80%] lg:scale-[80%]"}`}/>
                  </div>

                  <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${isHovering ? "opacity-50" : "opacity-20"}`}>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-700 ${isHovering ? "scale-110" : "scale-100"}`}>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>);
};
export default memo(Home);
