#!/bin/bash
# Generate self-signed SSL certificates for development
# For production, replace with Let's Encrypt certificates

SSL_DIR="$(dirname "$0")/ssl"
mkdir -p "$SSL_DIR"

echo "Generating self-signed SSL certificate..."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$SSL_DIR/key.pem" \
  -out "$SSL_DIR/cert.pem" \
  -subj "/C=KZ/ST=Almaty/L=Almaty/O=TechStore/OU=DevOps/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

echo "SSL certificate generated:"
echo "  Certificate: $SSL_DIR/cert.pem"
echo "  Private key: $SSL_DIR/key.pem"
echo ""
echo "Certificate details:"
openssl x509 -in "$SSL_DIR/cert.pem" -noout -subject -dates
