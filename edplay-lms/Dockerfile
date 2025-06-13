# Gunakan image resmi Node.js
FROM node:18

# Set working directory
WORKDIR /app

# Salin file yang dibutuhkan untuk instalasi awal
COPY package.json pnpm-lock.yaml* ./

# Install pnpm secara global
RUN npm install -g pnpm

# Salin folder prisma lebih awal supaya bisa dipakai generate
COPY prisma ./prisma

# Install dependencies (akan memicu postinstall -> prisma generate)
RUN pnpm install --frozen-lockfile

# Salin sisa project (terakhir, untuk cache efisien)
COPY . .

# Buka port sesuai kebutuhan (misal 3000)
EXPOSE 3000

# Jalankan aplikasi
CMD ["sh", "-c", "pnpm migrate && pnpm db-seed && pnpm start"]
