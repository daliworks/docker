FROM		ubuntu
RUN		echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN		apt-get update
RUN		apt-get -y install redis-server openssh-server supervisor vim sudo

RUN		mkdir -p /var/run/sshd
RUN		mkdir -p /var/log/supervisor

RUN		echo "root:root" | chpasswd

ADD		supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE		22 6379

CMD		["/usr/bin/supervisord", "-n"]
