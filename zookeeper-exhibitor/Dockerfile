FROM 		ubuntu

RUN		echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN		apt-get update
RUN		apt-get upgrade -y

RUN		apt-get install -y openssh-server supervisor vim
RUN		mkdir -p /var/run/sshd
RUN		mkdir -p /var/log/supervisor

# Zookeeper
RUN		apt-get install -y -q openjdk-7-jre-headless wget maven
#RUN		wget -q -O /opt/zookeeper-3.4.5.tar.gz http://apache.mirrors.pair.com/zookeeper/zookeeper-3.4.5/zookeeper-3.4.5.tar.gz
RUN		wget -q -O /opt/zookeeper-3.4.5.tar.gz http://mirror.apache-kr.org/zookeeper/zookeeper-3.4.5/zookeeper-3.4.5.tar.gz
RUN		tar -xzf /opt/zookeeper-3.4.5.tar.gz -C /opt
#RUN		cp /opt/zookeeper-3.4.5/conf/zoo_sample.cfg /opt/zookeeper-3.4.5/conf/zoo.cfg
ADD		./log4j.properties /opt/zookeeper-3.4.5/conf/
ADD		./zoo.cfg /opt/zookeeper-3.4.5/conf/
ENV		JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64

# Exhibitor - netflix
RUN		mkdir -p /opt/exhibitor
ADD		pom.xml /opt/exhibitor/
RUN		mvn -f /opt/exhibitor/pom.xml assembly:single

RUN 		echo "root:root" | chpasswd

ADD		supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE		22 2181 2888 3888 8080

CMD		["/usr/bin/supervisord", "-n"]
