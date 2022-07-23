# authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: application/json

{ "service": "DynamoDB" }

HTTP/1.1 201

[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 25

[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# GET 1st existing fragment's info
GET {{fragment1_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
Content-Type: application/json

[Asserts]
jsonpath "$.id" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.created" isString
jsonpath "$.updated" isString
jsonpath "$.type" == "application/json"
jsonpath "$.size" == 25

# POST markdown
POST http://localhost:8080/v1/fragments

Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/markdown

```DynamoDB is **great**.```

HTTP/1.1 201

[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 22

[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# GET 2nd existing fragment's info
GET {{fragment2_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
Content-Type: text/markdown

[Asserts]
jsonpath "$.id" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.created" isString
jsonpath "$.updated" isString
jsonpath "$.type" == "text/markdown"
jsonpath "$.size" == 22

# GET all fragments
GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
Content-Type: application/json

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"

# DELETE fragment 1
DELETE {{fragment1_url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"

# Try GET on deleted fragment 1
GET {{fragment1_url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 404

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "fragment does not exist"

# GET all fragments
GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
Content-Type: application/json

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" not includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"
