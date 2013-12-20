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

# r
RUN		apt-get install -y r-base r-base-dev

# hadoop
## adding a dedicated user
RUN             addgroup hadoop && adduser --ingroup hadoop hduser && echo "hduser:hadoop" | chpasswd && adduser hduser sudo

## SSH configuration
RUN             su - hduser -c "ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa"
RUN             su - hduser -c "cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys"

## disabling IPv6

## installing hadoop
ADD             hadoop-2.2.0.tar.gz /home/hduser/
RUN             mv /home/hduser/hadoop-2.2.0 /usr/local/hadoop && chown -R hduser:hadoop /usr/local/hadoop

## setup bashrc - hadoop and mahout
ADD		.bashrc /home/hduser/
ADD             bashrc-hadoop /home/hduser/
RUN             cat /home/hduser/bashrc-hadoop >> /home/hduser/.bashrc && rm /home/hduser/bashrc-hadoop

## configure hadoop
ADD             core-site.xml /usr/local/hadoop/etc/hadoop/
ADD             yarn-site.xml /usr/local/hadoop/etc/hadoop/
ADD             mapred-site.xml /usr/local/hadoop/etc/hadoop/
ADD             hdfs-site.xml /usr/local/hadoop/etc/hadoop/

RUN		mkdir -p /etc/hadoop
RUN		cp /usr/local/hadoop/etc/hadoop/* /etc/hadoop/
RUN		chown -R hduser:hadoop /etc/hadoop/ && chmod -R 755 /etc/hadoop/

RUN		su - hduser -c "mkdir -p ~/mydata/hdfs/namenode"
RUN		su - hduser -c "mkdir -p ~/mydata/hdfs/datanode"

## mahout
ADD             mahout-distribution-0.8.tar.gz  /home/hduser/
RUN             mv /home/hduser/mahout-distribution-0.8 /usr/local/mahout && chown -R hduser:hadoop /usr/local/mahout

RUN 		echo "root:root" | chpasswd

ADD		supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE		22 9000 50030 50060 50070

CMD		["/usr/bin/supervisord", "-n"]
