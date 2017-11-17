all: build init start

build:
	docker-compose -f ledgers.yml build

init: reinit_db config accounts assets

start:
	docker-compose -f ledgers.yml up

restart: init start

config:
	rm -rf .bigchaindb_examples_docker .bigchaindb_examples_docker_connector
	touch .bigchaindb_examples_docker .bigchaindb_examples_docker_connector
	docker-compose -f ledgers.yml run --rm bdb-0 bigchaindb -yc .bigchaindb_examples configure
	docker-compose -f ledgers.yml run --rm bdb-0 bigchaindb -c .bigchaindb_examples init
	docker-compose -f ledgers.yml run --rm bdb-1 bigchaindb -yc .bigchaindb_examples configure
	docker-compose -f ledgers.yml run --rm bdb-1 bigchaindb -c .bigchaindb_examples init
	docker-compose -f ledgers.yml run --rm connector bigchaindb -yc .bigchaindb_examples configure

accounts:
	docker-compose -f ledgers.yml run --rm bdb-0 python init_accounts.py

assets:
	docker-compose -f ledgers.yml run --rm bdb-0 python init_assets.py


drop_db:
	docker-compose -f ledgers.yml stop rdb
	docker-compose -f ledgers.yml rm -f rdb

start_db:
	docker-compose -f ledgers.yml up -d rdb

reinit_db: drop_db start_db
	sleep 10

stop:
	docker-compose -f ledgers.yml down
