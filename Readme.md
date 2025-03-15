# Vef2-Hopverk1

## Samstarfsaðilar
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
DATABASE_URL="postgresql://username:password@localhost:5432/yourdbname" 
JWT_SECRET="your-secret-key" 
CLOUDINARY_CLOUD_NAME="your-cloud-name" 
CLOUDINARY_API_KEY="your-api-key" 
CLOUDINARY_API_SECRET="your-api-secret"

### Uppsetningarleiðbeiningar
1. Klóna verkefnið:
   git clone https://github.com/BjarniTHG/Vef2-Hopverk1.git
   cd Vef2-Hopverk1

2. npm install

3. npm run setup

4. npm run dev

5. npm run start

Admin Notendagögn
Netfang: admin@example.com
Notandanafn: admin
Lykilorð: AdminPassword123

Endapunktar(listi á forsíðu):
Auðkenning
Skrá nýjan notanda: POST /routes/register
Innskrá: POST /routes/login

Notendastjórnun
Uppfæra mynd: POST /account/upload
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

Innskráning:
POST http://localhost:3000/routes/login
  -H "Content-Type: application/json"
  -d '{"email": "user@example.com", "password": "Password123"}'

Dæmi um beiðnir fyrir gögn:
Allir champions:
GET http://localhost:3000/champions?page=1&limit=20

Tiltekinn champion:
GET http://localhost:3000/champions/Aatrox

Öll items:
GET http://localhost:3000/items?page=1&limit=20

Tiltekið item:
GET http://localhost:3000/items/1001

Takmörkun á beiðnum
100 beiðnir á mínútu fyrir hvert IP

Öryggiseiginleikar
JWT token auðkenning
Lykilorð dulkóðuð með bcrypt
Inntaksskoðun og hreinsun
rate limiting