# Postbox React Native Client

Experiment with react native and mobx.

## Captured API requests

### Authentication
```
curl 'https://api.mappan.is/epo/v1/auth/tokens' -H 'Authorization: Basic bWFwcGFuLXBhc3N3b3JkOg==' --data 'grant_type=password&username=&password='
{
	"access_token": "eyJhbGciOiJSUzI1NiJ9.....",
	"token_type": "bearer",
	"refresh_token": "eyJhbGciOiJSUzI1NiJ9....",
	"expires_in": 28800,
	"scope": "mappan.notandi mappan.password",
	"jti": "6828d39d-e860-4f58-94e8-e831d46a5ef3"
}
```

### User Information
```
curl 'https://api.mappan.is/epo/v1/users/me' -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiJ9....'
{
	"name": "...",
	"nin": "...",
	"email": "...",
	"emailNotification": true,
	"devices": [],
	"avatar": "https://api.mappan.is/epo/v1/users/me/avatars/$0",
	"signedAvatar": "https://api.mappan.is/epo/v1/users/me/avatars/$0/ebox/$1/expiration...",
	"address": "...",
	"zip": "000",
	"thjodskraAddress": "...",
	"thjodskraZip": "000",
	"wantsAttachment": false,
	"thjodskraAddressStreetNumber": "0",
	"thjodskraAddressStreetName": "...",
	"addressStreetNumber": "0",
	"addressStreetName": "..."
}
```

### List of Messages
```
curl 'https://api.mappan.is/epo/v1/messages?order=desc&trash=false' -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiJ9....'
[
	{
		"id": $0,
		"subject": "Póstaðflutningsskýrsla E3 ... Afhent ...",
		"senderName": "Íslandspóstur hf",
		"deliveryDate": 0,
		"opened": false,
		"trash": false,
		"icon60": "https://www.mappan.is/images/icons/117/60.png",
		"icon160": "https://www.mappan.is/images/icons/117/160.png",
		"icon200": "https://www.mappan.is/images/icons/117/200.png"
	}
]
```

### Message Details
```
curl 'https://api.mappan.is/epo/v1/messages/$0' -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiJ9....'
{
	"id": #0,
	"subject": "Póstaðflutningsskýrsla E3 ... Afhent ...",
	"senderName": "Íslandspóstur hf",
	"deliveryDate": 0,
	"opened": true,
	"trash": false,
	"icon60": "https://www.mappan.is/images/icons/117/60.png",
	"icon160": "https://www.mappan.is/images/icons/117/160.png",
	"icon200": "https://www.mappan.is/images/icons/117/200.png"
}
```

### Message Files
```
curl 'https://api.mappan.is/epo/v1/messages/$0/files' -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiJ9....'
[
	{
		"name": "Skjal-$0.pdf",
		"path": "https://api.mappan.is/epo/v1/messages/$0/files/0",
		"signedPath": "https://api.mappan.is/epo/v1/messages/$0/files/0/...",
		"size": 0,
		"pageCount": 1
	}
]
```

### Message File Pages
```
curl 'https://api.mappan.is/epo/v1/messages/$0/files/0/pages' -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiJ9....'
{
	"pages": [
		{
			"page": 1,
			"signedUrl": "https://api.mappan.is/epo/v1/messages/$0/files/0/pages/1/..."
		}
	]
}
```

### Postbox Locations
```
curl 'https://api.mappan.is/epo/v1/postbox/postlocations?filter=O' -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiJ9....'
[
	{
		"postId": "99",
		"boxMachineName": "",
		"name1": "Ekkert valið",
		"name2": "",
		"addressLine1": "",
		"addressLine2": "",
		"postCode": "",
		"town": "",
		"countryCode": "",
		"latitude": 0,
		"longitude": 0,
		"operatingHours": "",
		"isPostBox": false,
		"isPostOffice": false,
		"email": "",
		"telephone": "",
		"description1": "",
		"description2": "",
		"description3": ""
	}
]
```

### Deliveries
Query params:
 - active (boolean)
 - rows (integer)
 - type (enum: to, from)
```
curl 'https://api.mappan.is/epo/v1/postbox/deliveries?active=false&rows=20&type=to' -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiJ9....'
{
	"totalRows": 20,
	"deliveries": [
		{
			"active": false,
			"sender": false,
			"recipient": true,
			"payable": false,
			"registrationNumber": "$0",
			"previousRegistrationNumber": "",
			"dateTimeDescription": "Afhent",
			"dateTime": "0000-00-00T00:00:00Z",
			"statusCode": [1-6],
			"statusText": "Afhent",
			"deliveryLocation": "[addr]",
			"latitude": 0,
			"longitude": 0,
			"recipientName": "[name]",
			"senderName": "[name",
			"mailType": "IPA",
			"mailTypeText": "Tollskyld sending",
			"customs": true,
			"customsDeclarationNumber": "...",
			"totalAmount": 0,
			"currency": "",
			"paidDate": "0000-00-00T00:00:00Z",
			"specialRemark": "[text]"
		}
	]
}
```


### Delivery
```
curl 'https://api.mappan.is/epo/v1/postbox/deliveries/$0' -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiJ9....'
{
	"delivery": {
		"active": true,
		"sender": false,
		"recipient": true,
		"payable": false,
		"registrationNumber": "$0",
		"previousRegistrationNumber": "",
		"dateTimeDescription": "Kom til landsins",
		"dateTime": "0000-00-00T00:00:00Z",
		"statusCode": 3,
		"statusText": "Á Tollalager. Vantar reikning",
		"deliveryLocation": "...",
		"latitude": 64.000,
		"longitude": -20.000,
		"recipientName": "...",
		"senderName": "...",
		"mailType": "IPA",
		"mailTypeText": "Tollskyld sending",
		"customs": true,
		"customsDeclarationNumber": "...",
		"totalAmount": 0,
		"currency": "ISK",
		"paidDate": "",
		"specialRemark": ""
	},
	"events": [
		{
			"timestamp": "0000-00-00T00:00:00Z",
			"location": "Tollmiðlun",
			"description": "Á lager. Beðið eftir gögnum",
			"latitude": 0,
			"longitude": 0
		}
	]
}
```
