# Why APIs: openAPI, root httpAPI and service httpAPI, an Explanations
20261008
## What are them?
### OpenAPI
OpenAPI is a kind of **contract**. This is used to define the route of the interface, the methods, the required parameters, request body, response body and status code. In this file, it references to `transport/openapi`. These contracts are described in the `openapi.yaml` file, for example:
```yaml
paths:
  /v1/auth/register:
    post:
      operationId: registerAccount
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/RegisterRequest"
      responses:
        "201":
          description: Account created successfully.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
        "400":
          $ref: "#/components/responses/InvalidRequest"
        "409":
          $ref: "#/components/responses/EmailUnavailable"
```
After carefully defining these contracts, this system uses `oapi-codegen` to read openAPI contracts to generate go code. This process is defined in makefile:
```Makefile
go tool oapi-codegen \ 
  --config ./api/oapi-codegen.yaml \
  ./api/openapi.yaml
```
and code will be generated according to the contract:
```yaml
generate:
  models: true
  gin-server: true
output: internal/transport/openapi/server.gen.go
```
Here's the generated code:
```go
// RegisterRequest defines model for RegisterRequest.
type RegisterRequest struct {
	// DisplayName Display name; surrounding whitespace is removed and the resulting value must contain 1 to 80 Unicode code points.
	DisplayName string `json:"display_name"`

	// Email Email address; surrounding whitespace is removed by the server.
	Email string `json:"email"`

	// Password Password normalized to NFC by the server; limited to 1024 UTF-8 bytes after normalization.
	Password string `json:"password"`
}
```
```go
router.POST(options.BaseURL+"/v1/auth/register", wrapper.RegisterAccount)
```
```go
// RegisterAccount Register a new account
// (POST /v1/auth/register)
RegisterAccount(c *gin.Context)
```
Therefore the generated code will be able to call the httpapi implementations. 
### Root httpAPI
This references to `transport/httpapi`. Four classes of service are defined here:
```go
type Server struct {
	account   AccountOperations
	inventory InventoryOperations
	checkout  CheckoutOperations
	order     OrderOperations
}
```
while each services contains their detailed operations:
```go
type AccountOperations interface {
	RegisterAccount(*gin.Context)
	LoginAccount(*gin.Context)
	GetCurrentAccount(*gin.Context)
	LogoutAccount(*gin.Context)
}
```
The root httpAPI implements some shared features like request id generation, source validation and error response. 
### Service httpAPi
This belongs to each modules (for example, account, inventory, checkout and order), these APIs serve as a bridge between http request and service order. This part is responsible for media type parsing, decoding, service function calling, and encoding.
## Why we need them?
From the above part, it is obvious that the `openAPI` is used for automatically generating interfaces based on contracts defined in its yaml file, while the two `httpAPI`s are used for routing and this two-layer structure could provide proper abstraction among multiple service modules.