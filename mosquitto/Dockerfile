# Mosquitto

FROM		ubuntu
RUN		echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN		apt-get update
RUN		apt-get install -y mosquitto mosquitto-clients supervisor openssh-server vim sudo

RUN		mkdir -p /var/run/sshd
RUN		mkdir -p /var/log/supervisor

RUN		echo "root:root" | chpasswd

ADD		supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE		22 1883 8883 8884

CMD		["/usr/bin/supervisord", "-n"]
