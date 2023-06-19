NAME = ft_transcendence
SRC_DIR = ./srcs
DOCKER_COMPOSE_FILE = $(SRC_DIR)/docker-compose.yaml
DOCKER_COMPOSE = docker-compose -f $(DOCKER_COMPOSE_FILE)
IMAGES := node:18-alpine3.16 postgres:15-alpine nginx:1.25.0-alpine dpage/pgadmin4:7.1


$(NAME) : all

all : up

clean : stop
	docker rm $$(docker ps -qa); \
	docker rmi -f $$(docker images -qa); \
	docker volume rm $$(docker volume ls -q) || \
	docker network rm $$(docker network ls -q) ||\
	echo "clean up"

re : clean pull-images
	$(DOCKER_COMPOSE) build --no-cache
	$(DOCKER_COMPOSE) up -d

up : pull-images
	$(DOCKER_COMPOSE) up -d --build

down :
	$(DOCKER_COMPOSE) down

start :
	$(DOCKER_COMPOSE) start

restart :
	$(DOCKER_COMPOSE) restart

stop :
	$(DOCKER_COMPOSE) stop

pull-images :
	@for image in $(IMAGES); do\
		docker pull $$image; \
	done

.PHONY: all clean re up down start restart stop pull-images
