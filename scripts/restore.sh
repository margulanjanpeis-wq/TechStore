#!/bin/bash

# TechStore Database Restore Script

if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <backup_file>"
    echo "Example: ./restore.sh backups/techstore_backup_20240428_120000.sql.gz"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Database credentials
DB_NAME="techstore"
DB_USER="techstore_user"
DB_PASSWORD="techstore_pass_2024"
DB_HOST="localhost"
DB_PORT="5432"

echo "Starting restore from $BACKUP_FILE at $(date)"

# Restore backup
gunzip -c $BACKUP_FILE | PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME

if [ $? -eq 0 ]; then
    echo "Restore completed successfully"
else
    echo "Restore failed!"
    exit 1
fi

echo "Restore finished at $(date)"
