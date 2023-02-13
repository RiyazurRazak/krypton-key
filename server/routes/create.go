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

	payloadString := request.Body

	record := Record{}

	json.Unmarshal([]byte(payloadString), &record)

	if record.Id == "" || record.DeviceId == "" || record.Domain == "" || record.Username == "" || record.BiometricId == "" {
		return events.APIGatewayProxyResponse{StatusCode: 400}, nil
	}

	convertedRecord, err := dynamodbattribute.MarshalMap(record)

	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500}, nil
	}

	dynamoPayload := &dynamodb.PutItemInput{
		Item:      convertedRecord,
		TableName: aws.String("KRYPTON_SMART_LINK"),
	}

	_, err = db.PutItem(dynamoPayload)

	if err != nil {
		return events.APIGatewayProxyResponse{StatusCode: 500}, nil
	}

	return events.APIGatewayProxyResponse{StatusCode: 200}, nil

}

func main() {
	lambda.Start(Handler)
}
