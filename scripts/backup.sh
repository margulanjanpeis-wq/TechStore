#!/bin/bash

# TechStore Database Backup Script

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="techstore_backup_${TIMESTAMP}.sql.gz"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Database credentials
DB_NAME="techstore"
DB_USER="techstore_user"
DB_PASSWORD="techstore_pass_2024"
DB_HOST="localhost"
DB_PORT="5432"

echo "Starting backup at $(date)"

# Create backup
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME | gzip > "$BACKUP_DIR/$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP_FILE"
    
    # Keep only last 7 backups
    cd $BACKUP_DIR
    ls -t techstore_backup_*.sql.gz | tail -n +8 | xargs -r rm
    echo "Old backups cleaned up"
else
    echo "Backup failed!"
    exit 1
fi

echo "Backup finished at $(date)"
