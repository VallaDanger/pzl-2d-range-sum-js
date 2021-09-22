pipeline { 

    agent { 
        label "linux" 
    }

    tools { 
        nodejs 'node-14'
    }
    
    environment {
        GIT_BRANCH_REF = "${GIT_BRANCH}"
        GIT_LOCAL_BRANCH = "${GIT_BRANCH}"
    }

    stages { 
        
        stage ('clone') {
            
            steps {
        
                script {
                    GIT_LOCAL_BRANCH = GIT_BRANCH_REF.replace("refs/heads/", "")
                    GIT_LOCAL_BRANCH = GIT_LOCAL_BRANCH.replace("origin/", "")
                }
        
                echo 'Building Branch: ' + GIT_LOCAL_BRANCH
        
                git poll: false,
                    branch: "${GIT_LOCAL_BRANCH}",
                    credentialsId: 'GIT_SSH',
                    url: 'ssh://git@pi4.chux.net:3322/gerrit/pzl-2d-range-sum-js.git'
                 
            }
                
        }
        
        stage ('install') {
            steps {
                sh "npm install --save-dev"
            }
        }

        stage ('clean') {
            steps {
                sh "npm run clean"
            }
        }

        stage ('test') {
            steps {
                sh "npm run test"
            }
        }

        stage ('coverage') {
            steps {
                sh "npm run coverage"
            }
        }

        stage('sonar') {
            steps {
                script {
                    def sonarScannerHome = tool 'sonar-scanner-v4'
                    env.sonar_scanner_home = sonarScannerHome
                }
                withSonarQubeEnv(installationName: 'sonar') {
                    sh "${sonar_scanner_home}/bin/sonar-scanner"
                }
            }
        }

        stage("quality") {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

    }

    post {
    
        success {
            build   job: '/CHUX/update-grok', 
                    parameters: [
                        [
                            $class: 'StringParameterValue', 
                            name: 'GROK_PROJECT', 
                            value: 'cs-puzzles'
                        ],
                        [
                            $class: 'StringParameterValue', 
                            name: 'GIT_REPOSITORY', 
                            value: 'pzl-2d-range-sum-js'
                        ],
                        [
                            $class: 'StringParameterValue', 
                            name: 'GIT_BRANCH', 
                            value: "${GIT_LOCAL_BRANCH}"
                        ]
                    ]
             build	job: '/CHUX/update-code', 
                    parameters: [
                        [
                            $class: 'StringParameterValue', 
                            name: 'CODE_PROJECT', 
                            value: 'compsci/puzzles'
                        ],
                        [
                            $class: 'StringParameterValue', 
                            name: 'GIT_REPOSITORY', 
                            value: 'pzl-2d-range-sum-js'
                        ],
                        [
                            $class: 'StringParameterValue', 
                            name: 'GIT_BRANCH', 
                            value: "${GIT_LOCAL_BRANCH}"
                        ]
                    ]
        }

    }

}
