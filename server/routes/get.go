package main

import (
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type Record struct {
	Id          string `json:"id"`
	DeviceId    string `json:"deviceId"`
	Domain      string `json:"domain"`
	Username    string `json:"username"`
	BiometricId string `json:"biometricId"`
}

func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	awsSession := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	db := dynamodb.New(awsSession)
	deviceId := request.QueryStringParameters["deviceid"]
	domain := request.QueryStringParameters["domain"]

	scanInput := &dynamodb.ScanInput{
		TableName:        aws.String("KRYPTON_SMART_LINK"),
		FilterExpression: aws.String("deviceId = :deviceKey and #domain = :domainKey"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":deviceKey": {
				S: aws.String(deviceId),
			},
			":domainKey": {
				S: aws.String(domain),
			},
		},
		ExpressionAttributeNames: map[string]*string{
			"#domain": aws.String("domain"),
		},
	}

	result, err := db.Scan(scanInput)

	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500}, nil
	}

	responsePayload := []Record{}
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &responsePayload)
	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500}, nil
	}

	jsonResponsePayload, err := json.Marshal(responsePayload)

	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500}, nil
	}

	return events.APIGatewayProxyResponse{StatusCode: 200, Body: string(jsonResponsePayload)}, nil

}

func main() {
	lambda.Start(Handler)
}
