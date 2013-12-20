FROM		ubuntu
RUN		echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN		apt-get update
RUN		apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN		echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list
RUN		apt-get update
RUN		apt-get install -y supervisor mongodb-10gen=2.4.8 openssh-server vim

RUN		mkdir -p /var/lib/mongodb
RUN		mkdir -p /var/run/sshd
RUN		mkdir -p /var/log/supervisor

ADD		mongodb.conf /etc/

RUN		echo "root:root" | chpasswd

ADD		supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE		22 27017 28017

CMD		["/usr/bin/supervisord", "-n"]
