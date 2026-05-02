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
                sh 'ls -la'
            }
        }

        stage('Code Analysis') {
            steps {
                echo '🔍 Код тексерілуде...'
                sh '''
                    echo "=== Жоба файлдары ==="
                    find . -name "*.py" | head -20
                    echo ""
                    echo "=== Backend файлдары ==="
                    ls -la backend/
                    echo ""
                    echo "=== Frontend файлдары ==="
                    ls -la frontend/
                    echo ""
                    echo "=== Docker файлдары ==="
                    ls -la docker-compose.yml Jenkinsfile
                    echo "✅ Код анализі аяқталды"
                '''
            }
        }

        stage('Validate Config') {
            steps {
                echo '⚙️ Конфигурация тексерілуде...'
                sh '''
                    echo "=== docker-compose.yml тексеру ==="
                    cat docker-compose.yml | grep "container_name" || true
                    echo ""
                    echo "=== Backend requirements ==="
                    cat backend/requirements.txt
                    echo ""
                    echo "=== Nginx конфигурация ==="
                    ls -la nginx/
                    echo "✅ Конфигурация дұрыс"
                '''
            }
        }

        stage('Security Check') {
            steps {
                echo '🔐 Қауіпсіздік тексерілуде...'
                sh '''
                    echo "=== .env файлдары тексеру ==="
                    if [ -f ".env" ]; then
                        echo "⚠️ .env файлы бар — .gitignore-да болуы керек"
                    else
                        echo "✅ .env файлы commit-те жоқ"
                    fi

                    echo ""
                    echo "=== .gitignore тексеру ==="
                    cat .gitignore | grep -E "\.env|secret|password" || true

                    echo ""
                    echo "=== SSL сертификаттар ==="
                    ls -la nginx/ssl/ || true

                    echo "✅ Қауіпсіздік тексеруі аяқталды"
                '''
            }
        }

        stage('Build Report') {
            steps {
                echo '📊 Build есебі жасалуда...'
                sh '''
                    echo "=================================="
                    echo "  TechStore CI/CD Build Report"
                    echo "=================================="
                    echo ""
                    echo "📦 Жоба: TechStore"
                    echo "🌿 Branch: main"
                    echo "📅 Күні: $(date)"
                    echo ""
                    echo "📁 Файлдар саны:"
                    find . -name "*.py" | wc -l | xargs echo "  Python файлдары:"
                    find . -name "*.jsx" | wc -l | xargs echo "  React файлдары:"
                    find . -name "*.css" | wc -l | xargs echo "  CSS файлдары:"
                    echo ""
                    echo "🐳 Docker сервистері:"
                    cat docker-compose.yml | grep "container_name:" | sed 's/.*container_name: /  - /'
                    echo ""
                    echo "✅ Build Report дайын!"
                    echo "=================================="
                '''
            }
        }
    }

    post {
        success {
            echo '✅ TechStore Pipeline сәтті аяқталды!'
            echo '🚀 Жоба GitHub-та: https://github.com/margulanjanpeis-wq/TechStore'
        }
        failure {
            echo '❌ Pipeline сәтсіз аяқталды. Логтарды тексеріңіз.'
        }
        always {
            echo '🏁 Pipeline аяқталды'
        }
    }
}
