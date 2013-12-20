FROM		ubuntu:latest
MAINTAINER	Sebastien Han

# Hack for initctl not being available in Ubuntu
RUN		dpkg-divert --local --rename --add /sbin/initctl
RUN		ln -s /bin/true /sbin/initctl

# Repo and packages
RUN		echo deb http://archive.ubuntu.com/ubuntu precise main | tee /etc/apt/sources.list
RUN		echo deb http://archive.ubuntu.com/ubuntu precise-updates main | tee -a /etc/apt/sources.list
RUN		echo deb http://archive.ubuntu.com/ubuntu precise universe | tee -a /etc/apt/sources.list
RUN		echo deb http://archive.ubuntu.com/ubuntu precise-updates universe | tee -a /etc/apt/sources.list
RUN		apt-get update
RUN		apt-get install -y --force-yes wget lsb-release sudo

# Fake a fuse install otherwise ceph won't get installed
RUN		apt-get install libfuse2
RUN		cd /tmp; apt-get download fuse
RUN		cd /tmp; dpkg-deb -x fuse_* .
RUN		cd /tmp; dpkg-deb -e fuse_*
RUN		cd /tmp; rm fuse_*.deb
RUN		cd /tmp; echo -en '#!/bin/bash\nexit 0\n' > DEBIAN/postinst
RUN		cd /tmp; dpkg-deb -b . /fuse.deb
RUN		cd /tmp; dpkg -i /fuse.deb

# Install Ceph
CMD		wget -q -O- 'https://ceph.com/git/?p=ceph.git;a=blob_plain;f=keys/release.asc' | apt-key add -
RUN		echo deb http://ceph.com/debian-dumpling/ $(lsb_release -sc) main | tee /etc/apt/sources.list.d/ceph-dumpling.list
RUN		apt-get update
RUN		apt-get install -y --force-yes ceph ceph-deploy

# Avoid host resolution error from ceph-deploy
RUN		echo ::1 ceph-mon | tee /etc/hosts

# Deploy the monitor
RUN		ceph-deploy new ceph-mon

EXPOSE		6789
