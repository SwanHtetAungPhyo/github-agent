FROM ubuntu:latest
LABEL authors="swanhtet"

ENTRYPOINT ["top", "-b"]