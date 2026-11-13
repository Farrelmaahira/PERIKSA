FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# NEXT_PUBLIC_* boleh datang dari build arg (CI) atau dari frontend/.env yang ikut
# ke build context. Arg yang kosong sengaja tidak diekspor supaya nilai di .env terpakai.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_DUMMY
ENV NEXT_TELEMETRY_DISABLED=1

RUN set -a; \
    [ -n "${NEXT_PUBLIC_API_URL:-}" ] && export NEXT_PUBLIC_API_URL; \
    [ -n "${NEXT_PUBLIC_SITE_URL:-}" ] && export NEXT_PUBLIC_SITE_URL; \
    [ -n "${NEXT_PUBLIC_DUMMY:-}" ] && export NEXT_PUBLIC_DUMMY; \
    npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]

