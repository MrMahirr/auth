import { useState, useEffect, useRef } from "react"; // <--- useRef EKLENDİ
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // <--- AXIOS EKLENDİ

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast"; // <--- TOAST EKLENDİ

function RegisterPage() {
    const navigate = useNavigate();
    const toast = useRef(null); // <--- TOAST REFERANSI

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // <--- YENİ STATE (Şifre Tekrarı için)
    const [dob, setDob] = useState(null);
    const [gender, setGender] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [loading, setLoading] = useState(false); // <--- LOADING STATE
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!termsAccepted) {
            toast.current.show({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen kullanım koşullarını kabul edin.' });
            return;
        }

        if (password !== confirmPassword) {
            toast.current.show({ severity: 'error', summary: 'Hata', detail: 'Şifreler birbiriyle uyuşmuyor!' });
            return;
        }

        if (!email || !password || !firstName) {
            toast.current.show({ severity: 'warn', summary: 'Eksik Bilgi', detail: 'Lütfen zorunlu alanları doldurun.' });
            return;
        }

        setLoading(true);

        try {
            const payload = {
                username: `${firstName}${lastName}`,
                email: email,
                password: password,
                // image: "...", // Profil resmi yükleme işlemi ayrıca (FormData ile) yapılmalı, şimdilik metin gönderiyoruz.
            };

            const response = await axios.post('http://localhost:3000/users', payload);

            console.log('Kayıt Başarılı:', response.data);

            toast.current.show({ severity: 'success', summary: 'Başarılı', detail: 'Hesap oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...' });


            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (error) {
            console.error("Kayıt Hatası:", error);
            const errorMessage = error.response?.data?.message || 'Kayıt sırasında bir hata oluştu.';

            const displayError = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;

            toast.current.show({ severity: 'error', summary: 'Hata', detail: displayError });
        } finally {
            setLoading(false);
        }
    };

    const genderOptions = [
        { label: "Erkek", value: "male" },
        { label: "Kadın", value: "female" },
        { label: "Belirtmek İstemiyorum", value: "other" },
    ];

    return (
        <div
            className={`relative z-20 w-full max-w-lg rounded-2xl border border-blue-500/50 bg-gray-900/60 p-8 text-white backdrop-blur-lg animate-pulse-glow transition-all duration-1000 ease-out ${
                isMounted ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
        >
            <Toast ref={toast} />

            <h2 className="mb-6 animate-pulse text-center text-3xl font-bold text-blue-300">
                Hesap Oluşturuluyor
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

                <FileUpload
                    name="profilePic"
                    mode="basic"
                    accept="image/*"
                    maxFileSize={1000000}
                    chooseLabel="Profil Fotoğrafı"
                    className="text-sm"
                    auto={false}
                />

                <div className="flex flex-col gap-4 md:flex-row">
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-user text-gray-400 pl-2" />
                        <InputText
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Ad"
                            className="w-full text-white pl-7 rounded-md p-1"
                        />
                    </span>
                    <span className="p-input-icon-left w-full ">
                        <i className="pi pi-user text-gray-400 pl-2" />
                        <InputText
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Soyad"
                            className="w-full text-white pl-7 rounded-md p-1"
                        />
                    </span>
                </div>

                <span className="p-input-icon-left w-full">
                    <i className="pi pi-envelope text-gray-400 pl-2" />
                    <InputText
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Adresi"
                        className="w-full text-white pl-7 p-1 rounded-md "
                    />
                </span>

                <div className="flex flex-col gap-4 md:flex-row">
                    <Calendar
                        value={dob}
                        onChange={(e) => setDob(e.value)}
                        placeholder="Doğum Tarihi"
                        dateFormat="dd/mm/yy"
                        showIcon
                        className="w-full md:w-1/2"
                        inputClassName="w-full !text-white rounded-md p-1"
                    />
                    <Dropdown
                        value={gender}
                        options={genderOptions}
                        onChange={(e) => setGender(e.value)}
                        placeholder="Cinsiyet"
                        className="w-full md:w-1/2"
                    />
                </div>

                <span className="p-input-icon-left w-full">
                    <i className="pi pi-lock text-gray-400 pl-2" />
                    <Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Şifre"
                        className="w-full"
                        inputClassName="w-full !text-white pl-7 rounded-md p-1"
                        toggleMask
                    />
                </span>


                <span className="p-input-icon-left w-full">
                    <i className="pi pi-lock text-gray-400 pl-2" />
                    <Password
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Şifre Tekrarı"
                        className="w-full"
                        inputClassName="w-full !text-white pl-7 rounded-md p-1"
                        feedback={false}
                        toggleMask
                    />
                </span>

                <div className="flex items-center gap-2">
                    <Checkbox
                        inputId="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.checked)}
                    />
                    <label htmlFor="terms" className="text-sm text-gray-300">
                        Kullanım koşullarını{" "}
                        <a href="#" className="text-blue-400 hover:underline">
                            okudum ve kabul ediyorum
                        </a>
                        .
                    </label>
                </div>

                <Button
                    label={loading ? "Kaydediliyor..." : "Kayıt Ol"}
                    icon={loading ? "pi pi-spin pi-spinner" : ""}
                    type="submit"
                    disabled={loading}
                    className="w-full !bg-blue-600 !py-3 !text-base font-bold !text-white hover:!bg-blue-700"
                />

                <div className="mt-4 text-center text-gray-400">
                    Zaten bir hesabın var mı?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-blue-400 transition-colors hover:text-blue-300 hover:underline"
                    >
                        <i className="pi pi-sign-in mr-1 text-xs" />
                        Giriş Yap
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;