// tailwind.config.js

const plugin = require('tailwindcss/plugin');

export default {
    content: [
        './src/**/*.{js,ts,jsx,tsx}', // Proje dosyalarınızı buraya ekleyin
    ],
    theme: {
        extend: {
            // BÖLÜM 1: Animasyonlarınızı buraya ekleyin
            // @keyframes pulse-glow {...} kuralını buraya taşıyoruz
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 15px 5px rgba(59, 130, 246, 0.4)',
                        borderColor: 'rgba(59, 130, 246, 0.7)',
                    },
                    '50%': {
                        boxShadow: '0 0 25px 10px rgba(59, 130, 246, 0.6)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                    },
                },
                // UYARI: 'rotating' adında bir animasyonunuz daha var (.loginbox içinde)
                // Eğer o da bir keyframe ise, onu da buraya eklemelisiniz.
                // 'rotating': {
                //   '0%': { transform: 'rotate(0deg)' },
                //   '100%': { transform: 'rotate(360deg)' },
                // },
            },
            // .animate-pulse-glow sınıfını Tailwind'e "utility" olarak tanıtıyoruz
            animation: {
                'pulse-glow': 'pulse-glow 4s infinite ease-in-out',
                // UYARI: Eğer 'rotating' keyframe'ini eklerseniz, animasyonu da buraya ekleyin:
                // 'rotating': 'rotating 4s linear infinite',
            },
        },
    },
    plugins: [
        // BÖLÜM 2: Geriye kalan tüm stilleriniz için plugin
        plugin(function ({ addComponents }) {
            addComponents({
                // P-InputText & P-Password-Input
                '.p-inputtext, .p-password-input': {
                    backgroundColor: 'rgba(31, 41, 55, 0.5) !important',
                    borderColor: '#4b5563 !important',
                    color: '#ffffff !important',
                    width: '100% !important',
                    // :focus stillerini iç içe yazıyoruz
                    '&:focus': {
                        borderColor: '#3b82f6 !important',
                        boxShadow: '0 0 0 1px #3b82f6 !important',
                    },
                },

                '.p-component .p-filled': {
                    backgroundColor: 'rgba(31, 41, 55, 0.5) !important',
                },

                '.p-icon-field': {
                    width: '100% !important',
                },
                '.p-input-icon': {
                    top: '25% !important',
                },

                // P-Checkbox
                '.p-checkbox .p-checkbox-box': {
                    backgroundColor: 'rgba(31, 41, 55, 0.5) !important',
                    borderColor: '#4b5563 !important',
                    // .p-focus ve .p-highlight'ı iç içe yazıyoruz
                    '&.p-focus': {
                        borderColor: '#3b82f6 !important',
                    },
                    '&.p-highlight': {
                        backgroundColor: '#3b82f6 !important',
                        borderColor: '#3b82f6 !important',
                    },
                },
                '.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover': {
                    borderColor: '#3b82f6 !important',
                },

                // P-Calendar / Datepicker
                '.p-calendar .p-inputtext': {
                    width: '100% !important',
                },
                '.p-datepicker': {
                    backgroundColor: '#1f2937 !important',
                    borderColor: '#4b5563 !important',
                    // İç elementleri iç içe seçiyoruz
                    '.p-datepicker-header': {
                        backgroundColor: 'transparent !important',
                        color: '#e5e7eb !important',
                    },
                    'table th, table td': {
                        color: '#e5e7eb !important',
                    },
                    'table td > span:not(.p-disabled):hover': {
                        backgroundColor: '#3b82f6 !important',
                    },
                },

                // P-Dropdown
                '.p-dropdown': {
                    backgroundColor: 'rgba(31, 41, 55, 0.5) !important',
                    borderColor: '#4b5563 !important',
                },
                '.p-dropdown-panel': {
                    backgroundColor: '#1f2937 !important',
                    borderColor: '#4b5563 !important',
                },
                '.p-dropdown-item:not(.p-highlight):hover': {
                    backgroundColor: '#374151 !important',
                },

                // P-Fileupload
                '.p-fileupload-buttonbar, .p-fileupload-content': {
                    backgroundColor: 'rgba(31, 41, 55, 0.5) !important',
                    borderColor: '#4b5563 !important',
                    color: '#e5e7eb !important',
                },
                '.p-fileupload .p-button': {
                    backgroundColor: '#3b82f6 !important',
                    borderColor: '#3b82f6 !important',
                    '&:hover': {
                        backgroundColor: '#2563eb !important',
                    },
                },

                // P-Password
                '.p-password': {
                    width: '100% !important',
                },
                '.p-input-icon-left > i': {
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginTop: '0 !important',
                },

                // Loginbox (pseudo-element'ler ::before ve ::after ile)
                '.loginbox': {

                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        filter: 'drop-shadow(0 15px 50px #000)',
                        borderRadius: '20px',
                        animation: 'rotating 4s linear infinite', // UYARI: 'rotating' keyframe'i tanımlı olmalı!
                        animationDelay: '-1s',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: '4px',
                        background: '#2d2d39',
                        borderRadius: '15px',
                        border: '8px solid #25252d',
                    },
                },
            });
        }),
    ],
};