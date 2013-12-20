FROM		ubuntu
RUN		echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN		apt-get update
RUN		apt-get install -y python-software-properties python g++ make
RUN		add-apt-repository -y ppa:chris-lea/node.js-legacy
RUN		add-apt-repository -y ppa:chris-lea/node.js
RUN		apt-get update
RUN		apt-get install -y nodejs=0.8.26-1chl1~precise1
RUN		apt-get install -y npm

RUN		apt-get install -y openssh-server supervisor vim sudo git

RUN             mkdir -p /var/run/sshd
RUN             mkdir -p /var/log/supervisor

RUN		echo "root:root" | chpasswd
ADD		supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ADD		. /src
RUN		cd /src; npm install

EXPOSE		22 8080

CMD		["/usr/bin/supervisord", "-n"]
