FROM 		ubuntu

RUN		echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN		apt-get update

# node.js
RUN		apt-get install -y python-software-properties python g++ make
RUN		add-apt-repository -y ppa:chris-lea/node.js-legacy 
RUN		add-apt-repository -y ppa:chris-lea/node.js
RUN		apt-get update
RUN		apt-get install -y nodejs=0.8.26-1chl1~precise1 npm build-essential openssh-server supervisor vim sudo git wget curl maven

RUN             mkdir -p /var/run/sshd
RUN             mkdir -p /var/log/supervisor

# java
RUN		add-apt-repository ppa:webupd8team/java
RUN		apt-get update
RUN		echo oracle-jdk7-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
RUN		apt-get install -y oracle-jdk7-installer
RUN		ln -s /usr/lib/jvm/java-7-oracle /usr/lib/jvm/jdk
ENV		JAVA_HOME /usr/lib/jvm/jdk

## adding a dedicated user
RUN             addgroup daliworks && adduser --ingroup daliworks daliworks && echo "daliworks:daliworks" | chpasswd && adduser daliworks sudo

## SSH configuration
RUN             su - daliworks -c "ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa"
RUN             su - daliworks -c "cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys"

RUN 		echo "root:root" | chpasswd

ADD		supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE		22 8080 4444

CMD		["/usr/bin/supervisord", "-n"]
