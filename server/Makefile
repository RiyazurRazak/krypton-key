.PHONY: build clean deploy

build:
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/create routes/create.go
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/get routes/get.go

clean:
	rm -rf ./bin

deploy: clean build
	sls deploy --verbose

format: 
	gofmt -w routes/create.go
	gofmt -w routes/get.go
