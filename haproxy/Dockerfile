FROM 		ubuntu

RUN		echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN		apt-get update
RUN		apt-get install -y haproxy openssh-server supervisor vim wget
RUN		mkdir -p /var/run/sshd
RUN		mkdir -p /var/log/supervisor

ADD		haproxy.cfg /etc/haproxy/

RUN 		echo "root:root" | chpasswd

ADD		supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE		22 80

CMD		["/usr/bin/supervisord", "-n"]
