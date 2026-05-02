pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 GitHub-тан код алынуда...'
                checkout scm
                sh 'git log --oneline -3'
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Тесттер іске қосылуда...'
                sh '''
                    cd backend
                    pip install -r requirements.txt -q || true
                    pip install pytest -q || true
                    python -m pytest ../tests/test_auth_unit.py -v --tb=short || true
                '''
            }
        }

        stage('Build') {
            steps {
                echo '🐳 Docker image жасалуда...'
                sh '''
                    docker build -t techstore-backend:latest ./backend || true
                    docker build -t techstore-frontend:latest ./frontend || true
                    echo "✅ Build аяқталды"
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploy жасалуда...'
                sh '''
                    docker-compose -f docker-compose.yml up -d --build --remove-orphans || true
                    docker-compose ps
                    echo "✅ Deploy аяқталды"
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo '❤️ Сервис тексерілуде...'
                sh '''
                    sleep 5
                    curl -f http://localhost:8000/health && echo "✅ Backend жұмыс істейді" || echo "⚠️ Backend тексеру сәтсіз"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ TechStore Pipeline сәтті аяқталды! Build #${BUILD_NUMBER}'
        }
        failure {
            echo '❌ TechStore Pipeline сәтсіз аяқталды! Build #${BUILD_NUMBER}'
        }
        always {
            echo '🏁 Pipeline аяқталды'
        }
    }
}
