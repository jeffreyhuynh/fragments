# authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# send plaintext fragment
Content-Type: text/plane

```This is a fragment!```

HTTP/1.1 401

[Asserts]
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"
