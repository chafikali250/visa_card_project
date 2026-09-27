pipeline {
    agent any

    // 1. Variables d'environnement
    environment {
        IMAGE_NAME           = 'visa-service'
        REGISTRY_CREDENTIALS = 'docker-hub-credentials' // L'ID créé dans les Credentials Jenkins[cite: 1]
        IMAGE_TAG            = "${BUILD_NUMBER}"
    }

    options {
        // Annule le build s'il dépasse 20 minutes et conserve les 10 derniers builds[cite: 4]
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        // Étape 1 : Installation des dépendances
        stage('Install Dependencies') {
            steps {
                // Utilisation de npm ci sans flags obsolètes[cite: 4]
                sh 'npm ci'
            }
        }

        // Étape 2 : Exécution des tests unitaires
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        // Étape 3 : Construction de l'image Docker & Push sur Docker Hub
        stage('Build & Push to Docker Hub') {
            steps {
                script {
                    // Connexion sécurisée à Docker Hub avec récupération dynamique du nom d'utilisateur
                    docker.withRegistry('https://index.docker.io/v1/', REGISTRY_CREDENTIALS) {
                        def DOCKER_USER = env.DOCKER_USERNAME
                        
                        echo "Building Docker image: ${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                        def appImage = docker.build("${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG}")
                        
                        echo "Pushing image to Docker Hub..."
                        appImage.push("${IMAGE_TAG}")
                        appImage.push('latest')
                    }
                }
            }
        }
    }

    // Nettoyage de l'espace disque sur le serveur Jenkins après l'exécution
    post {
        always {
            script {
                echo "Cleaning up local Docker images..."
                sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest || true"
            }
        }
        success {
            echo "Pipeline executed successfully! Image pushed to Docker Hub."
        }
        failure {
            echo "Pipeline failed! Check the console output logs above."[cite: 3]
        }
    }
}
