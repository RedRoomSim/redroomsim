FROM public.ecr.aws/lambda/python:3.11

# Set working directory
WORKDIR /var/task

# Copy code
COPY app ./app
COPY bootstrap.sh ./
COPY requirements.txt ./

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Entrypoint for Lambda
CMD ["bootstrap.sh"]
