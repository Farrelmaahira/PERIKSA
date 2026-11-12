package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

type HealthResponse struct {
	Status    string    `json:"status"`
	Service   string    `json:"service"`
	Platform  string    `json:"platform"`
	Timestamp time.Time `json:"timestamp"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		resp := HealthResponse{
			Status:    "ok",
			Service:   "periksa-backend",
			Platform:  "Platform Elektronik Rekam Integritas Kontrak Sistem Akuntabel",
			Timestamp: time.Now().UTC(),
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(resp)
	})

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"message":"Selamat datang di API PERIKSA - Platform Elektronik Rekam Integritas Kontrak Sistem Akuntabel","docs":"/health"}`+"\n")
	})

	addr := ":" + port
	log.Printf("PERIKSA Backend boilerplate berjalan di %s\n", addr)
	if err := http.ListenAndServe(addr, mux); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server gagal berjalan: %v", err)
	}
}
