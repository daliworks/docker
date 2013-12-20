FROM lopter/raring-base:latest
MAINTAINER Louis Opter <louis@dotcloud.com>

RUN apt-get update && apt-get install -y python-cairo collectd libgcrypt11 python-virtualenv supervisor sudo build-essential python-dev openssh-server openssh-client && apt-get clean && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*
RUN mkdir /var/run/sshd
# I wish we could feed a key to use, but this is not possible (yet?)
#RUN mkdir -pm 700 /root/.ssh/ && ssh-keygen -f /root/.ssh/authorized_keys.priv -N "" && mv /root/.ssh/authorized_keys.priv.pub /root/.ssh/authorized_keys

RUN adduser --system --group --no-create-home collectd && adduser --system --home /opt/graphite graphite
# Use --system-site-packages so it get access to pycairo (which cannot be installed via pip)
RUN sudo -u graphite virtualenv --system-site-packages ~graphite/env
ADD graphite/requirements.txt /opt/graphite/
RUN sudo -u graphite HOME=/opt/graphite /bin/sh -c ". ~/env/bin/activate && pip install -r /opt/graphite/requirements.txt"

ADD collectd/collectd.conf /etc/collectd/
ADD supervisor/ /etc/supervisor/conf.d/
ADD graphite/local_settings.py /opt/graphite/webapp/graphite/
ADD graphite/wsgi.py /opt/graphite/webapp/graphite/
ADD graphite/mkadmin.py /opt/graphite/webapp/graphite/
ADD graphite/carbon.conf /opt/graphite/conf/
ADD graphite/storage-schemas.conf /opt/graphite/conf/

RUN sed -i "s#^\(SECRET_KEY = \).*#\1\"`python -c 'import os; import base64; print(base64.b64encode(os.urandom(40)))'`\"#" ~graphite/webapp/graphite/app_settings.py
RUN sudo -u graphite HOME=/opt/graphite PYTHONPATH=/opt/graphite/lib/ /bin/sh -c "cd ~/webapp/graphite && ~/env/bin/python manage.py syncdb --noinput"
RUN sudo -u graphite HOME=/opt/graphite PYTHONPATH=/opt/graphite/lib/ /bin/sh -c "cd ~/webapp/graphite && ~/env/bin/python mkadmin.py"

# sshd, gunicorn, collectd, carbon/plaintext, carbon/pickle, carbon/amqp
EXPOSE 22 8080 25826/udp 2003 2004 7002
CMD exec supervisord -n
