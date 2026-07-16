# API Documentation

## Base URL
`/api/v1`

## Endpoints

### GET `/api/health`
- **Description**: Returns server status and health metadata.
- **Response**:
  ```json
  {
    "status": "healthy",
    "service": "GrowLedger Backend"
  }
  ```
