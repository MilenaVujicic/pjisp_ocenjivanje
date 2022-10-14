FROM python:3.10-bullseye

EXPOSE 8001

WORKDIR /usr/src

COPY requirements.txt .
RUN apt update
RUN pip install -r requirements.txt
COPY . /usr/src
COPY start_server.sh .

CMD ["./start_server.sh"]