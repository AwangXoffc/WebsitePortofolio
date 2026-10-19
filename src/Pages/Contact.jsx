import React, { useState, useEffect } from "react";
import { Share2, User, Mail, MessageSquare, Send } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import Komentar from "../components/Commentar";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        AOS.init({
            once: false,
        });
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const contactEmail = String(import.meta.env.VITE_CONTACT_EMAIL ||
            import.meta.env.VITE_CONTACT_RECEIVER_EMAIL ||
            import.meta.env.VITE_PUBLIC_CONTACT_EMAIL ||
            import.meta.env.VITE_EMAIL_TO ||
            import.meta.env.VITE_EMAIL ||
            (typeof __PORTFOLIO_CONTACT_EMAIL__ === "string" ? __PORTFOLIO_CONTACT_EMAIL__ : "") ||
            '').trim();
        const validContactEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)
            && !/email-anda|your-email|example\.com/i.test(contactEmail);
        if (!validContactEmail) {
            Swal.fire({
                title: 'Email kontak belum terbaca',
                text: 'Alamat penerima belum tersedia pada konfigurasi website. Silakan gunakan kanal sosial di bawah atau coba kembali nanti.',
                icon: 'info',
                confirmButtonColor: '#6366f1'
            });
            return;
        }
        setIsSubmitting(true);
        Swal.fire({
            title: 'Mengirim Pesan...',
            html: 'Harap tunggu selagi kami mengirim pesan Anda',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const formSubmitUrl = `https://formsubmit.co/ajax/${contactEmail}`;
            const submitData = new FormData();
            submitData.append('name', formData.name.trim());
            submitData.append('email', formData.email.trim());
            submitData.append('message', formData.message.trim());
            submitData.append('_subject', 'Pesan Baru dari Website Awang OfficiaL');
            submitData.append('_captcha', 'false');
            submitData.append('_template', 'table');
            const response = await axios.post(formSubmitUrl, submitData, {
                headers: { Accept: 'application/json' },
                timeout: 20000,
            });
            if (response.data?.success === false || response.data?.success === 'false') {
                throw new Error(response.data?.message || 'FormSubmit menolak pengiriman pesan.');
            }
            await Swal.fire({
                title: 'Berhasil!',
                text: response.data?.message || 'Pesan berhasil dikirim. Jika ini pengiriman pertama, periksa email penerima untuk konfirmasi aktivasi FormSubmit.',
                icon: 'success',
                confirmButtonColor: '#6366f1',
                timer: 3500,
                timerProgressBar: true
            });
            setFormData({ name: '', email: '', message: '' });
        }
        catch (error) {
            const status = error.response?.status;
            const serverMessage = typeof error.response?.data?.message === 'string'
                ? error.response.data.message
                : '';
            const localMessage = typeof error.message === 'string' && error.message !== 'Network Error'
                ? error.message
                : '';
            let message = serverMessage || localMessage || 'Pesan belum berhasil dikirim. Periksa koneksi internet dan coba kembali.';
            if (status === 400 || status === 403 || /activate|confirm|verify/i.test(serverMessage)) {
                message = serverMessage || 'Periksa alamat email penerima dan selesaikan konfirmasi aktivasi FormSubmit jika diminta.';
            }
            await Swal.fire({
                title: 'Gagal mengirim pesan',
                text: message,
                icon: 'error',
                confirmButtonColor: '#6366f1'
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="px-[5%] sm:px-[5%] lg:px-[10%] scroll-mt-24" id="Contact">
      <div className="text-center lg:mt-[5%] mt-10 mb-2 sm:px-0 px-[5%]">
        <h2 data-aos="fade-down" data-aos-duration="1000" className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          <span style={{
            color: "#6366f1",
            backgroundImage: "linear-gradient(45deg, #6366f1 10%, #a855f7 93%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
        }}>
            Hubungi Saya
          </span>
        </h2>
        <p data-aos="fade-up" data-aos-duration="1100" className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Punya pertanyaan? Kirimi saya pesan, dan saya akan segera membalasnya.
        </p>
      </div>

      <div className="h-auto py-10 flex items-center justify-center 2xl:pr-[3.1%] lg:pr-[3.8%] md:px-0">
        <div className="container px-[1%] grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-[45%_55%] 2xl:grid-cols-[35%_65%] gap-12">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-5 py-10 sm:p-10 transform transition-all duration-500 hover:shadow-[#6366f1]/10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                  Hubungi
                </h2>
                <p className="text-gray-400">
                  Ada yang ingin didiskusikan? Kirim saya pesan dan mari kita bicara.
                </p>
              </div>
              <Share2 className="w-10 h-10 text-[#6366f1] opacity-50"/>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div data-aos="fade-up" data-aos-delay="100" className="relative group">
                <User className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors"/>
                <input type="text" name="name" placeholder="Nama Anda" value={formData.name} onChange={handleChange} disabled={isSubmitting} className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50" required/>
              </div>
              <div data-aos="fade-up" data-aos-delay="200" className="relative group">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors"/>
                <input type="email" name="email" placeholder="Email Anda" value={formData.email} onChange={handleChange} disabled={isSubmitting} className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50" required/>
              </div>
              <div data-aos="fade-up" data-aos-delay="300" className="relative group">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors"/>
                <textarea name="message" placeholder="Pesan Anda" value={formData.message} onChange={handleChange} disabled={isSubmitting} className="w-full resize-none p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 h-[9.9rem] disabled:opacity-50" required/>
              </div>
              <button data-aos="fade-up" data-aos-delay="400" type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366f1]/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                <Send className="w-5 h-5"/>
                {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-white/10 flex justify-center space-x-6">
              <SocialLinks />
            </div>
          </div>

          <div className="  bg-white/5 backdrop-blur-xl rounded-3xl p-3 py-3 md:p-10 md:py-8 shadow-2xl transform transition-all duration-500 hover:shadow-[#6366f1]/10">
            <Komentar />
          </div>
        </div>
      </div>
    </div>);
};
export default ContactPage;
