pipeline {
    agent any

    environment {
        // Nom d'utilisateur exact sur DockerHub
        DOCKER_HUB_USER = 'chali250'
        
        // Nom du repository sur DockerHub
        IMAGE_NAME      = 'visa_card_project'
        
        // Tag basé sur le numéro de Build dans Jenkins
        IMAGE_TAG       = "${BUILD_NUMBER}"
        
        // Identifiant des Credentials configurés dans Jenkins
        REGISTRY_CREDENTIALS = 'docker-hub-credentials'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Récupération du code source depuis GitHub
                git branch: 'main', url: 'https://github.com/chafikali250/visa_card_project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Installation propre des dépendances avec npm ci
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                // Exécution des tests automatisés (card.test.js)
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Construction de l'image Docker avec les tags spécifique et latest
                    sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ."
                    sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest ."
                }
            }
        }

        stage('Push Image to DockerHub') {
            steps {
                script {
                    // Connexion et envoi de l'image vers DockerHub
                    docker.withRegistry('https://index.docker.io/v1/', "${REGISTRY_CREDENTIALS}") {
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }
    }

    post {
        always {
            // Nettoyage des images Docker locales pour libérer de l'espace sur le serveur
            sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} || true"
            sh "docker rmi ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest || true"
        }
        success {
            echo "✅ Succès : Les tests sont passés et l'image a été poussée sur DockerHub (${DOCKER_HUB_USER}/${IMAGE_NAME}) !"
        }
        failure {
            echo "❌ Échec : Une erreur est survenue lors du pipeline."
        }
    }
}
