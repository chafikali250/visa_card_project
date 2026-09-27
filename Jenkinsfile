pipeline {
    agent any

    environment {
        IMAGE_NAME           = 'visa-service'
        REGISTRY_CREDENTIALS = 'docker-hub-credentials'
        IMAGE_TAG            = "${BUILD_NUMBER}"
    }

    options {
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build & Push to Docker Hub') {
            steps {
                script {
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
            echo "Pipeline failed! Check the console output logs above."
        }
    }
}        
