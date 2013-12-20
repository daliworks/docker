FROM		ubuntu
MAINTAINER	forty4
RUN		echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN		apt-get update

## adding a dedicated user
RUN             addgroup hadoop && adduser --ingroup hadoop hduser && echo "hduser:hadoop" | chpasswd && adduser hduser sudo

ADD		mahout-distribution-0.8.tar.gz  /home/hduser/
RUN		mv /home/hduser/mahout-distribution-0.8 /usr/local/mahout && chown -R hduser:hadoop /usr/local/mahout

RUN		echo "root:root" | chpasswd

ADD		supervisord.conf /etc/supervisor/conf.d/supervisord.conf
EXPOSE		22
CMD		["/usr/bin/supervisord", "-n"]
