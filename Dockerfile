FROM ubuntu:trusty
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# update to the latest packages
RUN apt-get update

# To be able to add new repositories
RUN apt-get -y install python-software-properties
RUN apt-get -y install apt-file
RUN apt-file update
RUN apt-get -y install software-properties-common


# Installation of Git
RUN add-apt-repository ppa:git-core/ppa
RUN apt-get update
RUN apt-get -y install git

# Installation of NodeJS 5.8
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash \
    && source /root/.nvm/nvm.sh \
    && nvm install 5.8 \
    && npm install watchify -g \
    && npm install browserify -g \
    && npm install http-server -g \
    && npm install nodemon -g

RUN mkdir -p /root/app
WORKDIR /root/app

COPY package.json /root/app/

RUN source /root/.nvm/nvm.sh \
&& npm install

COPY . /root/app/

EXPOSE 8080

CMD source /root/.nvm/nvm.sh \
&& npm run dev

