# Vef2-Hopverk1

## meðlimir
- Bjarni
- Eygló
- Þorri

## Uppsetning

### Forsendur
- **Node.js** (útgáfa 18 eða hærri)
- **PostgreSQL** gagnagrunnur
- **Cloudinary** reikning (fyrir myndaupload)

### Umhverfisbreytur
Búðu til skrána **.env** í rót verkefnisins og settu inn eftirfarandi:

DATABASE_URL="postgresql://vef2_hopverk1_user:gNS94hxNhqYhQPaNPV571gTtIQ6BwZas@dpg-cv840l52ng1s73a1eoog-a.frankfurt-postgres.render.com/vef2_hopverk1" 
JWT_SECRET="your-secret-key" 
CLOUDINARY_CLOUD_NAME="your-cloud-name" 
CLOUDINARY_API_KEY="your-api-key" 
CLOUDINARY_API_SECRET="your-api-secret"

### Uppsetningarleiðbeiningar
1. Klóna verkefnið:
   git clone https://github.com/BjarniTHG/Vef2-Hopverk1.git
   cd Vef2-Hopverk1

Settu upp nauðsynleg pakka:
npm install

Settu upp gagnagrunninn:
npm run setup

Keyrðu þróunarþjóninn:
npm run dev

Fyrir raun:
npm run start

Admin Notendagögn
Netfang: admin@example.com
Notandanafn: admin
Lykilorð: AdminPassword123

Auðkenning
Skrá nýjan notanda: POST /routes/register
Innskrá: POST /routes/login

Notendastjórnun
Uppfæra prófílmynd: POST /account/upload
Uppfæra notendanafn: POST /account/update-username
Uppfæra lykilorð: POST /account/update-password

Hetjur (Champions)
Sækja allar hetjur: GET /champions
Sækja tiltekið hetju: GET /champions/:id
Synca hetjur (Admin): POST /champions/sync
Merkja/afmerkja favorit: POST /champions/:id/favorite og DELETE /champions/:id/favorite

Atriði (Items)
Sækja öll atriði: GET /items
Sækja tiltekið atriði: GET /items/:id
Synca atriði (Admin): POST /items/sync

Aðrir endapunktar
API yfirlit: GET /
Notendalisti (þróun): GET /users
Tiltekinn notandi (þróun): GET /users/:id

Dæmi um requestur:

- Nýskrá nýjan notanda:
POST http://localhost:3000/routes/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "Password123"}'

- Innskráning notanda:
POST http://localhost:3000/routes/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "Password123"}'

- Sækja alla champions:
GET http://localhost:3000/champions?page=1&limit=20

- Sækja tiltekinn champion:
GET http://localhost:3000/champions/Aatrox

- Sækja öll items:
GET http://localhost:3000/items?page=1&limit=20

- Sækja tiltekið item:
GET http://localhost:3000/items/1001

- Takmörkun á beiðnum
100 beiðnir á mínútu fyrir hvert IP

- Öryggiseiginleikar
JWT token auðkenning
Lykilorð dulkóðuð með bcrypt
Inntaksskoðun og hreinsun
rate limiting