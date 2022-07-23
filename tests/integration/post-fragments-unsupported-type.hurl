# authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# send plaintext fragment
Content-Type: text/plane

```This is a fragment!```

HTTP/1.1 415

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" == "invalid request: content type not supported"
