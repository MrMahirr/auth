import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";

function RegisterPage() {
    const navigate = useNavigate();
    const toast = useRef(null);

    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [dob, setDob] = useState(null);
    const [gender, setGender] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [loading, setLoading] = useState(false);
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

        if (!email || !password || !firstName || !username) {
            toast.current.show({ severity: 'warn', summary: 'Eksik Bilgi', detail: 'Lütfen zorunlu alanları doldurun.' });
            return;
        }

        setLoading(true);

        try {
            const formattedDob = dob ? new Date(dob).toISOString().split('T')[0] : "";

            const payload = {
                user: {
                    username: username,
                    name: firstName,
                    surname: lastName,
                    email: email,
                    password: password,
                    gender: gender,
                    dateofbirth: formattedDob
                }
            };

            const response = await api.post('/users', payload);

            console.log('Kayıt Başarılı:', response.data);

            toast.current.show({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Hesap oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...'
            });

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


    const inputClass = "w-full !bg-gray-800 !text-white !pl-10 p-3 rounded-md border-none focus:ring-2 focus:ring-blue-500";

    return (
        <div
            className={`relative z-20 w-full max-w-lg rounded-2xl border border-blue-500/50 bg-gray-900/60 p-8 text-white backdrop-blur-lg animate-pulse-glow transition-all duration-1000 ease-out ${isMounted ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                }`}
        >
            <Toast ref={toast} />

            <h2 className="mb-6 animate-pulse text-center text-3xl font-bold text-blue-300">
                Hesap Oluştur
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Profil Resmi - Not: JSON payload ile dosya gitmez, backend formData istiyorsa yapı değişmeli */}
                <div className="flex justify-center">
                    <FileUpload
                        mode="basic"
                        name="profilePic"
                        accept="image/*"
                        maxFileSize={1000000}
                        chooseLabel="Profil Fotoğrafı Seç"
                        className="p-button-outlined !text-blue-300 !border-blue-500"
                        auto={false}
                    />
                </div>

                <span className="p-input-icon-left w-full relative">
                    <i className="pi pi-user text-gray-400 pl-2" style={{ zIndex: 1, position: 'absolute', top: '50%', transform: 'translateY(-50%)' }} />
                    <InputText
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Kullanıcı Adı"
                        className={inputClass}
                    />
                </span>

                <div className="flex flex-col gap-4 md:flex-row">
                    <span className="p-input-icon-left w-full relative">
                        <i className="pi pi-user text-gray-400 pl-2" style={{ zIndex: 1, position: 'absolute', top: '50%', transform: 'translateY(-50%)' }} />
                        <InputText
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Ad"
                            className={inputClass}
                        />
                    </span>
                    <span className="p-input-icon-left w-full relative">
                        <i className="pi pi-user text-gray-400 pl-2" style={{ zIndex: 1, position: 'absolute', top: '50%', transform: 'translateY(-50%)' }} />
                        <InputText
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Soyad"
                            className={inputClass}
                        />
                    </span>
                </div>

                <span className="p-input-icon-left w-full relative">
                    <i className="pi pi-envelope text-gray-400 pl-2" style={{ zIndex: 1, position: 'absolute', top: '50%', transform: 'translateY(-50%)' }} />
                    <InputText
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Adresi"
                        className={inputClass}
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
                        inputClassName="w-full !bg-gray-800 !text-white rounded-md p-3 border-none"
                    />
                    <Dropdown
                        value={gender}
                        options={genderOptions}
                        onChange={(e) => setGender(e.value)}
                        placeholder="Cinsiyet"
                        className="w-full md:w-1/2 !bg-gray-800 !border-none rounded-md"
                        pt={{
                            input: { className: '!text-white' },
                            trigger: { className: '!text-gray-400' },
                            panel: { className: '!bg-gray-800 !text-white' },
                            item: { className: 'hover:!bg-gray-700' }
                        }}
                    />
                </div>

                <span className="p-input-icon-left w-full relative">
                    <i className="pi pi-lock text-gray-400 pl-2" style={{ zIndex: 1, position: 'absolute', top: '50%', transform: 'translateY(-50%)' }} />
                    <Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Şifre"
                        className="w-full"
                        inputClassName={inputClass}
                        toggleMask
                    />
                </span>

                <span className="p-input-icon-left w-full relative">
                    <i className="pi pi-lock text-gray-400 pl-2" style={{ zIndex: 1, position: 'absolute', top: '50%', transform: 'translateY(-50%)' }} />
                    <Password
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Şifre Tekrarı"
                        className="w-full"
                        inputClassName={inputClass}
                        feedback={false}
                        toggleMask
                    />
                </span>

                <div className="flex items-center gap-2">
                    <Checkbox
                        inputId="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.checked)}
                        className="!border-gray-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer select-none">
                        Kullanım koşullarını{" "}
                        <a href="#" className="text-blue-400 hover:underline">
                            okudum ve kabul ediyorum
                        </a>
                        .
                    </label>
                </div>

                <Button
                    label={loading ? "Kaydediliyor..." : "Kayıt Ol"}
                    icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                    type="submit"
                    disabled={loading}
                    className="w-full !bg-blue-600 !py-3 !text-base font-bold !text-white hover:!bg-blue-700 border-none shadow-lg shadow-blue-500/30"
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