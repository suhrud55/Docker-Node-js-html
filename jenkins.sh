pipeline {
    agent any

    stages {
        stage("Git Clone") {
            steps {
                git url: 'https://github.com/suhrud55/Docker-Node-js-html.git', branch: 'main'
            }
        }

        stage("Build Image") {
            steps {
                sh 'docker build -t new .'
            }
        }

        stage("Run Container") {
            steps {
                sh 'docker run -d --name new -p 5555:81 new'
            }
        }
    }
}
