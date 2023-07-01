FROM python:3.11-slim as builder

WORKDIR /app
COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

CMD python manage.py migrate && python manage.py runserver 0.0.0.0:8000

# RUN mkdir -p /app/psycopg2-source
# WORKDIR /app/psycopg2-source
# RUN apt-get update && apt-get install -y --no-install-recommends git && \
# 	git clone https://github.com/psycopg/psycopg2.git . && \
# 	python setup.py build_ext --pg-config=/usr/bin/pg_config && python setup.py install

# WORKDIR /app



# FROM python:3.11-slim
# WORKDIR /app
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1
# COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
