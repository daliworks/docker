FROM 		ubuntu

RUN		echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN		apt-get update
RUN		apt-get upgrade -y

RUN		apt-get install -y openssh-server supervisor vim
RUN		mkdir -p /var/run/sshd
RUN		mkdir -p /var/log/supervisor

# Zookeeper
RUN		apt-get install -y -q openjdk-7-jre-headless wget
#RUN		wget -q -O /opt/zookeeper-3.4.5.tar.gz http://apache.mirrors.pair.com/zookeeper/zookeeper-3.4.5/zookeeper-3.4.5.tar.gz
RUN		wget -q -O /opt/zookeeper-3.4.5.tar.gz http://mirror.apache-kr.org/zookeeper/zookeeper-3.4.5/zookeeper-3.4.5.tar.gz
RUN		tar -xzf /opt/zookeeper-3.4.5.tar.gz -C /opt
#RUN		cp /opt/zookeeper-3.4.5/conf/zoo_sample.cfg /opt/zookeeper-3.4.5/conf/zoo.cfg
ADD		./log4j.properties /opt/zookeeper-3.4.5/conf/
ADD		./zoo.cfg /opt/zookeeper-3.4.5/conf/
ENV		JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64

RUN 		echo "root:root" | chpasswd

ADD		supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE		22 2181 2888 3888

#RUN echo "/opt/zookeeper-3.4.5/bin/zkServer.sh start" >> /etc/bash.bashrc
#RUN echo "/usr/sbin/sshd -D" >> /etc/bash.bashrc
#ENTRYPOINT ["/bin/bash"]
#ENTRYPOINT ["/opt/zookeeper-3.4.5/bin/zkServer.sh", "start-foreground"]
#CMD		/opt/zookeeper-3.4.5/bin/zkServer.sh start && /usr/sbin/sshd -D

CMD		["/usr/bin/supervisord", "-n"]
