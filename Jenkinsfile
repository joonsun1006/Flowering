def component = [
    'front': true,
    'back': true,
    'nginx': true,
    'redis': true
]
pipeline {
    agent any
    environment {
        // 환경변수 설정
                // Docker 이미지 태그 설정
        NGINX_TAG = "latest"
        FRONT_TAG = "v1.0"
        BACK_TAG = "v2.1"
        REDIS_TAG = "alpine"
        
        // Docker Hub 및 GitHub 크리덴셜 ID
        DOCKER_HUB_CREDENTIALS_ID = "Docker-hub"
        GITHUB_CREDENTIALS_ID = "Github-access-token"
        REPO = "s10-webmobile1-sub2/S10P12C106"
    }
    stages {
        stage('Checkout') {
            steps {
                // GitHub 크리덴셜을 사용하여 소스 코드 체크아웃
                checkout scm: [
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions: [[$class: 'SubmoduleOption', parentCredentials: true, recursiveSubmodules: true]],
                    userRemoteConfigs: [[credentialsId: 'Github-access-token', url: 'https://github.com/sail106/settings']]
                ]
            }
        }
        stage("Copy Env") {
            steps{
                script{
                    sh 'ls -al'
                    // .env 파일 복사
                    sh 'cp back/secure-settings/.env front/'
                    sh 'ls front -al'
                }
            }
        }
        stage("Build") {
            steps {
                script {
                    sh 'ls -al'
                    // Docker Compose를 사용하여 서비스 빌드
                    sh "docker-compose -f back/docker-compose.yml build"
                }
            }
        }
        stage("Docker Login") {
            steps {
                // Docker Hub 크리덴셜을 사용하여 Docker에 로그인
                withCredentials([usernamePassword(credentialsId: 'Docker-hub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login --username $DOCKER_USER --password-stdin'
                }
            }
        }
        stage("Tag and Push") {
            steps {
                script {
                    // Docker 이미지 태그 및 푸시
                    sh "docker-compose -f back/docker-compose.yml push"
                }
            }
        }
        stage('Prune old images'){
            steps{
                script{
                    sh "docker image prune --filter until=1h"
                }
            }
        }
        stage('Pull') {
            steps {
                script {
                    component.each{entry ->
                        if(entry.value&&entry.key!="redis"){
                            def var = entry.key
                            sh "docker compose -p test-server pull ${var.toLowerCase()}"
                        }
                    }
                }
            }
        }
        stage('Up') {
            steps {
                script {
                    component.each{ entry ->
                        if(entry.value){
                            def var = entry.key
                            try {
                                sh "docker compose -p test-server up -d ${var.toLowerCase()}"
                            } catch (Exception e) {
                                // 'docker compose up -d' 명령이 실패한 경우
                                echo "Failed to up. Starting 'docker compose start'..."
                                sh "docker compose -p test-server restart ${var.toLowerCase()}"
                            }
                        }
                    }
                }
            }
        }
    }
    // post {
    //     always {
    //         script {
    //             def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
    //             def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
    //             mattermostSend (color: 'good',
    //                     message: "빌드 ${currentBuild.currentResult}: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
    //                     endpoint: 'https://meeting.ssafy.com/hooks/',
    //                     channel: 'C106-Jenkins'
    //             )
    //         }
    //     }
    // }
    
}
