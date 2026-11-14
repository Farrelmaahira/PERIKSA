package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
)

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

func loadDotEnv(paths ...string) {
	for _, p := range paths {
		data, err := os.ReadFile(p)
		if err != nil {
			continue
		}
		for _, line := range strings.Split(string(data), "\n") {
			line = strings.TrimSpace(line)
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			parts := strings.SplitN(line, "=", 2)
			if len(parts) == 2 {
				k := strings.TrimSpace(parts[0])
				v := strings.TrimSpace(parts[1])
				v = strings.Trim(v, `"'`)
				if os.Getenv(k) == "" {
					_ = os.Setenv(k, v)
				}
			}
		}
	}
}

func main() {
	loadDotEnv(".env", "../.env")
	reset := flag.Bool("reset", false, "Reset public schema before applying SQL")
	seedDemo := flag.Bool("seed-demo", false, "Apply demo accounts after schema migration")
	filePath := flag.String("file", "", "Path to PERIKSA.sql file (optional, auto-detected)")
	dbURL := flag.String("db", "", "PostgreSQL connection string (default from DATABASE_URL or localhost)")
	flag.Parse()

	connStr := *dbURL
	if connStr == "" {
		connStr = getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/periksa?sslmode=disable")
	}

	targetPath := *filePath
	if targetPath == "" {
		candidates := []string{
			"scripts/PERIKSA.sql",
			"backend/scripts/PERIKSA.sql",
			"../scripts/PERIKSA.sql",
			"../../scripts/PERIKSA.sql",
		}
		for _, c := range candidates {
			if _, err := os.Stat(c); err == nil {
				targetPath = c
				break
			}
		}
	}

	if targetPath == "" {
		log.Fatal("File PERIKSA.sql tidak ditemukan. Tentukan dengan flag -file <path>.")
	}

	absPath, err := filepath.Abs(targetPath)
	if err != nil {
		absPath = targetPath
	}

	sqlBytes, err := os.ReadFile(absPath)
	if err != nil {
		log.Fatalf("Gagal membaca file %s: %v", absPath, err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	fmt.Printf("[INFO] Menghubungkan ke database...\n")
	conn, err := pgx.Connect(ctx, connStr)
	if err != nil {
		log.Fatalf("Gagal terhubung ke database: %v", err)
	}
	defer conn.Close(ctx)

	tableExists := false
	if *reset {
		fmt.Println("[WARN] Mereset schema public...")
		_, err := conn.Exec(ctx, "DROP SCHEMA public CASCADE; CREATE SCHEMA public;")
		if err != nil {
			log.Fatalf("Gagal mereset schema public: %v", err)
		}
	} else {
		_ = conn.QueryRow(ctx, `SELECT EXISTS (
			SELECT FROM information_schema.tables 
			WHERE table_schema = 'public' 
			AND table_name = 'regions'
		)`).Scan(&tableExists)
	}
	if tableExists {
		fmt.Println("[INFO] Skema sudah termigrasi (tabel regions sudah ada). Melewati eksekusi PERIKSA.sql.")
		if !*seedDemo {
			return
		}
	} else {
		fmt.Println("[INFO] Menyiapkan compatibility domain datetime...")
		_, err = conn.Exec(ctx, `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'datetime') THEN CREATE DOMAIN datetime AS timestamptz; END IF; END $$;`)
		if err != nil {
			log.Fatalf("Gagal membuat domain datetime: %v", err)
		}

		fmt.Printf("[INFO] Mengimpor %s...\n", absPath)
		_, err = conn.Exec(ctx, string(sqlBytes))
		if err != nil {
			log.Fatalf("Gagal mengeksekusi SQL: %v", err)
		}

		fmt.Println("[SUCCESS] PERIKSA.sql berhasil diimpor ke database.")
	}

	if *seedDemo {
		demoSQL, err := os.ReadFile("/app/seed_demo.sql")
		if err != nil {
			log.Fatalf("Gagal membaca seed demo: %v", err)
		}
		fmt.Println("[INFO] Menyiapkan akun demo...")
		if _, err := conn.Exec(ctx, string(demoSQL)); err != nil {
			log.Fatalf("Gagal mengeksekusi seed demo: %v", err)
		}
		fmt.Println("[SUCCESS] Akun demo siap digunakan.")
	}
}
