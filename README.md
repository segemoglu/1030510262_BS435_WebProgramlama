# AI vs REAL - Web Oyunu

Bu proje, React (Frontend) ve Django (Backend) kullanılarak geliştirilmiş bir web oyunudur.

## Kurulum ve Çalıştırma

Projeyi çalıştırmak için iki ayrı terminal kullanmanız gerekmektedir.

### 1. Backend (Sunucu) Hazırlığı

Öncelikle backend klasörüne gidin ve gerekli paketleri yükleyin:

```bash
cd backend
pip install django django-cors-headers
```

Veritabanını oluşturun:
```bash
python manage.py migrate
```

Sunucuyu başlatın:
```bash
python manage.py runserver
```
*(Sunucu http://127.0.0.1:8000 adresinde çalışacaktır)*

### 2. Frontend (Oyun) Hazırlığı

Yeni bir terminal açın ve ana dizine dönün:

```bash
# Eğer backend klasöründeyseniz:
cd ..

npm install
npm run dev
```

Ekranda çıkan linke (genellikle http://localhost:5173) tıklayarak oyunu başlatabilirsiniz.

## Özellikler

- **2 Oyun Modu:** Normal ve Zor.
- **Backend Entegrasyonu:** Skorlarınız veritabanına kaydedilir.
- **Liderlik Tablosu:** En yüksek 10 skoru görebilirsiniz.
