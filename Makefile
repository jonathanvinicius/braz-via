# SAM build — artefato enxuto para Lambda (< 250 MB descompactado)
build-BrazviaApiFunction:
	npm ci
	npm run build
	cp -r dist/* $(ARTIFACTS_DIR)/
	cp package.json package-lock.json $(ARTIFACTS_DIR)/
	cd $(ARTIFACTS_DIR) && npm ci --omit=dev
	rm -rf $(ARTIFACTS_DIR)/node_modules/swagger-ui-dist
	find $(ARTIFACTS_DIR)/node_modules -type f \( -name "*.md" -o -name "*.markdown" -o -name "CHANGELOG*" -o -name "LICENSE*" \) -delete

# Lambda dedicada a migrations/seeders (inclui sequelize-cli + arquivos SQL)
build-BrazviaMigrateFunction:
	npm ci
	npm run build
	mkdir -p $(ARTIFACTS_DIR)/src/infrastructure/database
	cp -r dist/* $(ARTIFACTS_DIR)/
	cp -r src/infrastructure/database/migrations $(ARTIFACTS_DIR)/src/infrastructure/database/
	cp -r src/infrastructure/database/seeders $(ARTIFACTS_DIR)/src/infrastructure/database/
	cp package.json package-lock.json sequelize.config.js .sequelizerc $(ARTIFACTS_DIR)/
	cd $(ARTIFACTS_DIR) && npm ci --omit=dev
	cd $(ARTIFACTS_DIR) && npm install sequelize-cli --no-save
