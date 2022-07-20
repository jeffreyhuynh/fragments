# health check test
GET http://localhost:8080

HTTP/1.1 200
Cache-Control: no-cache

# must match the following:
# { 
#     "status": "ok",
#     "author": "(STRING)",
#     "githubUrl": "https://github.com/(...)",
#     "version": "x.y.z"
# }

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.author" isString
jsonpath "$.githubUrl" matches /^https:\/\/github.com\/.+/
jsonpath "$.version" matches /^\d+\.\d+\.\d+$/
