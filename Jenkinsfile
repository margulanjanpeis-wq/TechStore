pipeline {
    agent any

    environment {
        COMPOSE_FILE     = 'docker-compose.yml'
        BACKEND_IMAGE    = 'techstore-backend'
        FRONTEND_IMAGE   = 'techstore-frontend'
        TELEGRAM_BOT_TOKEN = credentials('telegram-bot-token')
        TELEGRAM_CHAT_ID   = credentials('telegram-chat-id')
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        // ── 1. Код алу ────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 GitHub-тан код алынуда...'
                checkout scm
                sh 'git log --oneline -5'
            }
        }

        // ── 2. Тесттер ────────────────────────────────────────
        stage('Test') {
            steps {
                echo '🧪 Тесттер іске қосылуда...'
                sh '''
                    cd backend
                    pip install -r requirements.txt --quiet
                    pip install pytest pytest-cov --quiet
                    python -m pytest ../tests/test_auth_unit.py -v \
                        --tb=short \
                        --junitxml=../test-results.xml \
                        || true
                '''
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'test-results.xml'
                }
            }
        }

        // ── 3. Docker image жасау ─────────────────────────────
        stage('Build') {
            steps {
                echo '🐳 Docker image жасалуда...'
                sh '''
                    docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ./backend
                    docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} ./frontend
                    docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest
                    docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest
                '''
            }
        }

        // ── 4. Deploy ─────────────────────────────────────────
        stage('Deploy') {
            steps {
                echo '🚀 Deploy жасалуда...'
                sh '''
                    docker-compose -f ${COMPOSE_FILE} pull --quiet || true
                    docker-compose -f ${COMPOSE_FILE} up -d --build \
                        --remove-orphans
                    docker-compose -f ${COMPOSE_FILE} ps
                '''
            }
        }

        // ── 5. Health check ───────────────────────────────────
        stage('Health Check') {
            steps {
                echo '❤️ Сервис тексерілуде...'
                sh '''
                    sleep 10
                    curl -f http://localhost:8000/health || \
                        (echo "Backend жауап бермейді!" && exit 1)
                    echo "✅ Backend жұмыс істейді"
                '''
            }
        }
    }

    // ── Pipeline аяқталғанда ──────────────────────────────────
    post {
        success {
            echo '✅ Pipeline сәтті аяқталды!'
            sh """
                curl -s -X POST \
                    "https://api.telegram.org/bot\${TELEGRAM_BOT_TOKEN}/sendMessage" \
                    -d chat_id="\${TELEGRAM_CHAT_ID}" \
                    -d parse_mode="HTML" \
                    -d text="✅ <b>TechStore Deploy сәтті!</b>%0A%0A📦 Build: #${BUILD_NUMBER}%0A🌿 Branch: ${GIT_BRANCH}%0A⏱ Уақыт: ${currentBuild.durationString}%0A🔗 ${BUILD_URL}" \
                    || true
            """
        }
        failure {
            echo '❌ Pipeline сәтсіз аяқталды!'
            sh """
                curl -s -X POST \
                    "https://api.telegram.org/bot\${TELEGRAM_BOT_TOKEN}/sendMessage" \
                    -d chat_id="\${TELEGRAM_CHAT_ID}" \
                    -d parse_mode="HTML" \
                    -d text="❌ <b>TechStore Deploy сәтсіз!</b>%0A%0A📦 Build: #${BUILD_NUMBER}%0A🌿 Branch: ${GIT_BRANCH}%0A❗ Stage: ${FAILED_STAGE}%0A🔗 ${BUILD_URL}" \
                    || true
            """
        }
        always {
            echo '🧹 Ескі Docker image-дар тазаланады...'
            sh '''
                docker image prune -f --filter "until=24h" || true
            '''
        }
    }
}
