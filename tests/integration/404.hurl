# 404 test
GET http://localhost:8080/this/route/does/not/exist

HTTP/1.1 404

# must match the following:
# { 
#     "status": "error",
#     "error": {
#        "code": "404",
#        "message": "not found"
#     }
# }

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "not found"
