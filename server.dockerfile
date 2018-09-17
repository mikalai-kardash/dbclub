FROM bitnami/node as modules
COPY ./package.json /app
RUN cd /app && npm i

FROM bitnami/node as dev-server
COPY --from=modules /app/ /app/
RUN mkdir /app/dist
