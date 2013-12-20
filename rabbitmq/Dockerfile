# RabbitMQ

FROM		ubuntu
RUN		echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN		apt-get update
RUN		apt-get install -y curl python-pip

RUN		curl http://www.rabbitmq.com/rabbitmq-signing-key-public.asc > rabbitmq-signing-key-public.asc
RUN		apt-key add rabbitmq-signing-key-public.asc
RUN		echo "deb http://www.rabbitmq.com/debian/ testing main" >> /etc/apt/sources.list
RUN		apt-get update

# trick
RUN		dpkg-divert --local --rename --add /sbin/initctl
RUN		ln -s /bin/true /sbin/initctl

RUN		apt-get install -y rabbitmq-server supervisor openssh-server vim sudo
RUN		pip install Celery

RUN		mkdir -p /var/run/sshd
RUN		mkdir -p /var/log/supervisor

RUN		echo "root:root" | chpasswd

ADD		supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE		22 5672

CMD		["/usr/bin/supervisord", "-n"]
