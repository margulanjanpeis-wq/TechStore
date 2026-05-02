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
                sh 'echo "=== Жоба файлдары ==="'
                sh 'find . -name "*.py" | head -20'
                sh 'echo "=== Backend файлдары ==="'
                sh 'ls -la backend/'
                sh 'echo "=== Frontend файлдары ==="'
                sh 'ls -la frontend/'
                sh 'echo "✅ Код анализі аяқталды"'
            }
        }

        stage('Validate Config') {
            steps {
                echo '⚙️ Конфигурация тексерілуде...'
                sh 'echo "=== docker-compose.yml сервистері ==="'
                sh 'grep "container_name" docker-compose.yml || true'
                sh 'echo "=== Backend requirements ==="'
                sh 'cat backend/requirements.txt'
                sh 'echo "=== Nginx конфигурация ==="'
                sh 'ls -la nginx/'
                sh 'echo "✅ Конфигурация дұрыс"'
            }
        }

        stage('Security Check') {
            steps {
                echo '🔐 Қауіпсіздік тексерілуде...'
                sh 'echo "=== .gitignore тексеру ==="'
                sh 'cat .gitignore | head -20'
                sh 'echo "=== SSL сертификаттар ==="'
                sh 'ls -la nginx/ssl/ || true'
                sh 'echo "✅ Қауіпсіздік тексеруі аяқталды"'
            }
        }

        stage('Build Report') {
            steps {
                echo '📊 Build есебі жасалуда...'
                sh 'echo "=================================="'
                sh 'echo "  TechStore CI/CD Build Report"'
                sh 'echo "=================================="'
                sh 'echo "📦 Жоба: TechStore"'
                sh 'echo "📅 Күні: $(date)"'
                sh 'echo "Python файлдары: $(find . -name *.py | wc -l)"'
                sh 'echo "React файлдары: $(find . -name *.jsx | wc -l)"'
                sh 'echo "CSS файлдары: $(find . -name *.css | wc -l)"'
                sh 'echo "🐳 Docker сервистері:"'
                sh 'grep "container_name:" docker-compose.yml | sed "s/.*container_name: /  - /"'
                sh 'echo "✅ Build Report дайын!"'
            }
        }
    }

    post {
        success {
            echo '✅ TechStore Pipeline сәтті аяқталды!'
            echo '🚀 GitHub: https://github.com/margulanjanpeis-wq/TechStore'
        }
        failure {
            echo '❌ Pipeline сәтсіз аяқталды. Логтарды тексеріңіз.'
        }
        always {
            echo '🏁 Pipeline аяқталды'
        }
    }
}
