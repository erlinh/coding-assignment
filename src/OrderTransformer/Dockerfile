# Stage 1: Build React UI
FROM node:22-alpine AS ui-build
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /ui
COPY ui/package.json ui/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY ui/ ./
RUN pnpm build

# Stage 2: Build .NET app
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY src/OrderTransformer/OrderTransformer.csproj ./src/OrderTransformer/
RUN dotnet restore src/OrderTransformer/OrderTransformer.csproj
COPY src/OrderTransformer/ ./src/OrderTransformer/
# Copy built UI assets into wwwroot before publishing
COPY --from=ui-build /src/OrderTransformer/wwwroot ./src/OrderTransformer/wwwroot/
RUN dotnet publish src/OrderTransformer/OrderTransformer.csproj -c Release -o /app

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["dotnet", "OrderTransformer.dll"]
